import { llm } from '../llm';
import { prompts } from './promptBuilder';
import { PlanStep, StepResult } from '../types';

export async function executeStep(
  step: PlanStep,
  context: any[] = []
): Promise<StepResult> {
  console.log('[Executor] Executing step:', step.title);

  const startTime = Date.now();

  try {
    // Build execution prompt with context
    const prompt = prompts.buildExecutePrompt(step, context);
    const response = await llm.execute(prompt);

    // Parse the response
    let result: StepResult;
    try {
      const parsed = JSON.parse(response);
      result = {
        data: parsed.data || {},
        sources: parsed.sources || [],
        confidence: parsed.confidence || 0.7,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      // If parsing fails, create a result from the raw response
      console.warn('[Executor] Failed to parse JSON response, using raw text');
      result = {
        data: { rawResponse: response },
        sources: [],
        confidence: 0.5,
        executionTime: Date.now() - startTime,
      };
    }

    console.log('[Executor] Step completed in', result.executionTime, 'ms');
    return result;
  } catch (error: any) {
    console.error('[Executor] Step execution failed:', error);
    throw new Error(`Failed to execute step "${step.title}": ${error.message}`);
  }
}

export async function executeSteps(
  steps: PlanStep[],
  onStepComplete?: (step: PlanStep, result: StepResult) => void
): Promise<PlanStep[]> {
  console.log('[Executor] Executing', steps.length, 'steps');

  const results: PlanStep[] = [];
  const completedSteps = new Map<string, StepResult>();

  // Create execution order based on dependencies
  const executionOrder = topologicalSort(steps);

  for (const stepId of executionOrder) {
    const step = steps.find(s => s.id === stepId);
    if (!step) continue;

    // Get context from dependencies
    const context = step.dependencies
      .map(depId => completedSteps.get(depId))
      .filter(Boolean);

    try {
      step.status = 'executing';
      const result = await executeStep(step, context);

      step.result = result;
      step.status = 'completed';
      completedSteps.set(step.id, result);

      results.push(step);

      // Callback for progress updates
      if (onStepComplete) {
        onStepComplete(step, result);
      }
    } catch (error: any) {
      console.error('[Executor] Step failed:', step.title, error);
      step.status = 'failed';
      results.push(step);
      // Continue with other steps even if one fails
    }
  }

  console.log('[Executor] Completed', results.filter(s => s.status === 'completed').length, 'steps');
  return results;
}

function topologicalSort(steps: PlanStep[]): string[] {
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Build graph
  steps.forEach(step => {
    graph.set(step.id, step.dependencies);
    inDegree.set(step.id, step.dependencies.length);
  });

  // Find steps with no dependencies
  const queue: string[] = [];
  steps.forEach(step => {
    if (step.dependencies.length === 0) {
      queue.push(step.id);
    }
  });

  const sorted: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    // Find steps that depend on current
    steps.forEach(step => {
      if (step.dependencies.includes(current)) {
        const degree = inDegree.get(step.id)! - 1;
        inDegree.set(step.id, degree);

        if (degree === 0) {
          queue.push(step.id);
        }
      }
    });
  }

  // If not all steps are sorted, there's a cycle or isolated nodes
  if (sorted.length !== steps.length) {
    console.warn('[Executor] Could not sort all steps, using original order');
    return steps.map(s => s.id);
  }

  return sorted;
}
