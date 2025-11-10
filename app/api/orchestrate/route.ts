import { NextRequest, NextResponse } from 'next/server';
import { createPlan } from '@/lib/mcp/planner';
import { verifyPlan } from '@/lib/mcp/verifier';
import { executeSteps } from '@/lib/mcp/executor';
import { synthesizeReport, extractKnowledge } from '@/lib/mcp/synthesizer';
import { makePolicyDecision, shouldEnableBeastMode } from '@/lib/mcp/policyEngine';
import { db } from '@/lib/supabase';
import { OrchestrationResult } from '@/lib/types';

export const runtime = 'nodejs'; // Can be 'edge' for faster cold starts
export const maxDuration = 300; // 5 minutes max

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('[Orchestrator] Starting research for query:', query);

    const startTime = Date.now();
    let retryCount = 0;
    let currentPlan;
    let verificationResult;

    // Phase 1: Planning & Verification
    while (retryCount < 3) {
      console.log(`[Orchestrator] Planning attempt ${retryCount + 1}`);

      currentPlan = await createPlan(query);

      // Verify the plan
      verificationResult = await verifyPlan(currentPlan.steps);

      if (verificationResult.isValid) {
        console.log('[Orchestrator] Plan verified successfully');
        break;
      }

      console.warn('[Orchestrator] Plan verification failed:', verificationResult.issues);
      retryCount++;

      if (retryCount >= 3) {
        // Proceed with best-effort plan
        console.log('[Orchestrator] Max retries reached, proceeding with current plan');
        break;
      }
    }

    if (!currentPlan) {
      throw new Error('Failed to create a valid plan');
    }

    // Create session in database
    const session = await db.createSession(query, currentPlan);

    // Phase 2: Execution
    console.log('[Orchestrator] Starting execution phase');
    currentPlan.status = 'executing';
    await db.updateSession(session.id, { status: 'executing', plan: currentPlan });

    const executedSteps = await executeSteps(currentPlan.steps, async (step, result) => {
      console.log(`[Orchestrator] Step completed: ${step.title}`);
    });

    // Update plan with executed steps
    currentPlan.steps = executedSteps;

    // Phase 3: Policy Decision
    const completedCount = executedSteps.filter(s => s.status === 'completed').length;
    const policyDecision = await makePolicyDecision(
      query,
      executedSteps,
      verificationResult?.issues || [],
      { startTime, retryCount }
    );

    console.log('[Orchestrator] Policy decision:', policyDecision.action);

    // Check if Beast Mode should be enabled
    const beastMode = shouldEnableBeastMode({
      startTime,
      retryCount,
      completedSteps: completedCount,
      totalSteps: executedSteps.length,
    });

    if (beastMode) {
      console.log('[Orchestrator] Beast Mode enabled - forcing completion');
    }

    // Phase 4: Extract Knowledge
    const knowledge = extractKnowledge(executedSteps);

    // Save knowledge to database
    for (const entry of knowledge) {
      entry.sessionId = session.id;
      await db.addKnowledge(session.id, entry);
    }

    // Phase 5: Synthesis
    console.log('[Orchestrator] Starting synthesis phase');
    const finalReport = await synthesizeReport(query, executedSteps, knowledge);

    // Create final result
    const result: OrchestrationResult = {
      planId: currentPlan.id,
      query,
      steps: executedSteps,
      finalReport,
      knowledge,
      status: completedCount === executedSteps.length ? 'success' : 'partial',
      metadata: {
        totalTime: Date.now() - startTime,
        tokensUsed: 0, // TODO: Track tokens if needed
        stepsCompleted: completedCount,
        stepsTotal: executedSteps.length,
      },
    };

    // Update session with final result
    await db.updateSession(session.id, {
      status: 'completed',
      result,
    });

    console.log('[Orchestrator] Research completed successfully');
    console.log(`[Orchestrator] Total time: ${result.metadata.totalTime}ms`);
    console.log(`[Orchestrator] Steps completed: ${completedCount}/${executedSteps.length}`);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Orchestrator] Error:', error);
    return NextResponse.json(
      {
        error: 'Orchestration failed',
        message: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}

// Streaming endpoint for real-time updates
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  try {
    const session = await db.getSession(sessionId);
    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch session', message: error.message },
      { status: 500 }
    );
  }
}
