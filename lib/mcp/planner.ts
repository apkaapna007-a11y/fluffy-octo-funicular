import { llm } from '../llm';
import { prompts } from './promptBuilder';
import { ResearchPlan, PlanStep } from '../types';

export async function createPlan(query: string): Promise<ResearchPlan> {
  console.log('[Planner] Creating research plan for:', query);

  const prompt = prompts.buildPlanPrompt(query);
  const response = await llm.plan(prompt);

  // Parse XML response to extract plan steps
  const steps = parsePlanXML(response);

  const plan: ResearchPlan = {
    id: generateId(),
    query,
    steps,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  console.log('[Planner] Created plan with', steps.length, 'steps');
  return plan;
}

function parsePlanXML(xml: string): PlanStep[] {
  const steps: PlanStep[] = [];

  // Extract all <step> blocks
  const stepRegex = /<step[^>]*id="(\d+)"[^>]*>([\s\S]*?)<\/step>/g;
  let match;

  while ((match = stepRegex.exec(xml)) !== null) {
    const stepId = match[1];
    const stepContent = match[2];

    // Extract fields
    const title = extractTag(stepContent, 'title');
    const description = extractTag(stepContent, 'description');
    const toolsStr = extractTag(stepContent, 'tools');
    const depsStr = extractTag(stepContent, 'dependencies');

    const tools = toolsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const dependencies = depsStr
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    steps.push({
      id: stepId,
      title,
      description,
      dependencies,
      tools,
      status: 'pending',
    });
  }

  return steps;
}

function extractTag(content: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function generateId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
