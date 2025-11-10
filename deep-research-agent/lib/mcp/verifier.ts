import { llm } from '../llm';
import { prompts } from './promptBuilder';
import { PlanStep, VerificationResult } from '../types';
import { AVAILABLE_TOOLS } from '../config';

export async function verifyPlan(steps: PlanStep[]): Promise<VerificationResult> {
  console.log('[Verifier] Verifying plan with', steps.length, 'steps');

  // First, do deterministic checks
  const deterministicIssues = performDeterministicVerification(steps);

  // Then, use LLM for deeper validation
  const availableToolNames = AVAILABLE_TOOLS.map(t => t.name);
  const prompt = prompts.buildVerifyPrompt(steps, availableToolNames);
  const response = await llm.verify(prompt);

  let llmResult: VerificationResult;
  try {
    llmResult = JSON.parse(response);
  } catch (error) {
    console.error('[Verifier] Failed to parse LLM response:', error);
    llmResult = {
      isValid: false,
      issues: ['Failed to parse verification response'],
      suggestions: [],
    };
  }

  // Combine deterministic and LLM issues
  const allIssues = [...deterministicIssues, ...llmResult.issues];
  const isValid = allIssues.length === 0;

  const result: VerificationResult = {
    isValid,
    issues: allIssues,
    suggestions: llmResult.suggestions,
  };

  console.log('[Verifier] Verification result:', isValid ? 'VALID' : 'INVALID');
  if (!isValid) {
    console.log('[Verifier] Issues:', allIssues);
  }

  return result;
}

function performDeterministicVerification(steps: PlanStep[]): string[] {
  const issues: string[] = [];
  const availableToolNames = AVAILABLE_TOOLS.map(t => t.name);
  const stepIds = new Set(steps.map(s => s.id));

  steps.forEach((step, idx) => {
    // Check if step has required fields
    if (!step.title || step.title.trim() === '') {
      issues.push(`Step ${idx + 1}: Missing title`);
    }

    if (!step.description || step.description.trim() === '') {
      issues.push(`Step ${idx + 1}: Missing description`);
    }

    // Check if tools exist
    step.tools.forEach(tool => {
      if (!availableToolNames.includes(tool)) {
        issues.push(`Step ${idx + 1}: Unknown tool "${tool}"`);
      }
    });

    // Check if dependencies exist
    step.dependencies.forEach(depId => {
      if (!stepIds.has(depId)) {
        issues.push(`Step ${idx + 1}: Unknown dependency step "${depId}"`);
      }
    });

    // Check for circular dependencies
    if (hasCyclicDependency(step, steps)) {
      issues.push(`Step ${idx + 1}: Circular dependency detected`);
    }
  });

  return issues;
}

function hasCyclicDependency(step: PlanStep, allSteps: PlanStep[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(currentId: string): boolean {
    if (recursionStack.has(currentId)) {
      return true; // Cycle detected
    }

    if (visited.has(currentId)) {
      return false;
    }

    visited.add(currentId);
    recursionStack.add(currentId);

    const currentStep = allSteps.find(s => s.id === currentId);
    if (!currentStep) {
      recursionStack.delete(currentId);
      return false;
    }

    for (const depId of currentStep.dependencies) {
      if (dfs(depId)) {
        return true;
      }
    }

    recursionStack.delete(currentId);
    return false;
  }

  return dfs(step.id);
}
