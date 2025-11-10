import { llm } from '../llm';
import { prompts } from './promptBuilder';
import { PlanStep, PolicyDecision } from '../types';
import { ORCHESTRATION_LIMITS } from '../config';

export async function makePolicyDecision(
  query: string,
  currentPlan: PlanStep[],
  issues: string[] = [],
  metadata: {
    startTime: number;
    retryCount: number;
  }
): Promise<PolicyDecision> {
  console.log('[Policy Engine] Making decision');

  const completedSteps = currentPlan.filter(s => s.status === 'completed').length;
  const failedSteps = currentPlan.filter(s => s.status === 'failed').length;
  const elapsedTime = Date.now() - metadata.startTime;

  // Deterministic policies first
  
  // 1. Timeout check
  if (elapsedTime > ORCHESTRATION_LIMITS.totalTimeout) {
    return {
      action: 'stop',
      reason: 'Total timeout exceeded. Proceeding with available results.',
      confidence: 1.0,
    };
  }

  // 2. Max retries check
  if (metadata.retryCount >= ORCHESTRATION_LIMITS.maxRetries) {
    return {
      action: 'stop',
      reason: 'Maximum retries reached. Proceeding with available results.',
      confidence: 1.0,
    };
  }

  // 3. All steps completed successfully
  if (completedSteps === currentPlan.length && failedSteps === 0) {
    return {
      action: 'stop',
      reason: 'All steps completed successfully.',
      confidence: 1.0,
    };
  }

  // 4. Too many failures
  if (failedSteps > currentPlan.length / 2) {
    return {
      action: 'replan',
      reason: 'More than half of steps failed. Need to replan.',
      confidence: 0.9,
    };
  }

  // 5. Significant issues during verification
  if (issues.length > 3) {
    return {
      action: 'replan',
      reason: 'Too many verification issues. Need to replan.',
      confidence: 0.85,
    };
  }

  // 6. Good progress, continue
  if (completedSteps > 0 && completedSteps >= currentPlan.length * 0.6) {
    return {
      action: 'stop',
      reason: 'Sufficient information gathered. Ready to synthesize.',
      confidence: 0.8,
    };
  }

  // If no deterministic decision, ask LLM
  const prompt = prompts.buildPolicyPrompt(query, currentPlan, completedSteps, issues);

  try {
    const response = await llm.verify(prompt); // Use verifier for deterministic reasoning
    const decision: PolicyDecision = JSON.parse(response);

    console.log('[Policy Engine] Decision:', decision.action, '-', decision.reason);
    return decision;
  } catch (error) {
    console.error('[Policy Engine] Failed to get LLM decision:', error);
    
    // Fallback decision
    if (completedSteps > 0) {
      return {
        action: 'stop',
        reason: 'Error in policy decision. Proceeding with available results.',
        confidence: 0.5,
      };
    } else {
      return {
        action: 'replan',
        reason: 'Error in policy decision and no results yet. Attempting replan.',
        confidence: 0.5,
      };
    }
  }
}

export function shouldEnableBeastMode(metadata: {
  startTime: number;
  retryCount: number;
  completedSteps: number;
  totalSteps: number;
}): boolean {
  const elapsedTime = Date.now() - metadata.startTime;
  const timeThreshold = ORCHESTRATION_LIMITS.totalTimeout * 0.8; // 80% of total timeout
  const progressThreshold = metadata.totalSteps * 0.3; // 30% of steps

  return (
    elapsedTime > timeThreshold ||
    (metadata.retryCount >= 2 && metadata.completedSteps < progressThreshold)
  );
}
