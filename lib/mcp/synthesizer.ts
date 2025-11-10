import { llm } from '../llm';
import { prompts } from './promptBuilder';
import { PlanStep, KnowledgeEntry } from '../types';

export async function synthesizeReport(
  query: string,
  steps: PlanStep[],
  knowledge: KnowledgeEntry[]
): Promise<string> {
  console.log('[Synthesizer] Creating research report');

  const prompt = prompts.buildSynthesizePrompt(query, steps, knowledge);
  const report = await llm.synthesize(prompt);

  console.log('[Synthesizer] Report generated,', report.length, 'characters');
  return report;
}

export async function* streamSynthesizeReport(
  query: string,
  steps: PlanStep[],
  knowledge: KnowledgeEntry[]
): AsyncGenerator<string> {
  console.log('[Synthesizer] Streaming research report');

  const prompt = prompts.buildSynthesizePrompt(query, steps, knowledge);

  let totalLength = 0;
  for await (const chunk of llm.streamSynthesize(prompt)) {
    totalLength += chunk.length;
    yield chunk;
  }

  console.log('[Synthesizer] Report streamed,', totalLength, 'characters');
}

export function extractKnowledge(steps: PlanStep[]): KnowledgeEntry[] {
  const knowledge: KnowledgeEntry[] = [];

  steps.forEach(step => {
    if (!step.result) return;

    // Extract meaningful content from step result
    const content = formatStepContent(step);

    if (content) {
      knowledge.push({
        id: `knowledge_${step.id}`,
        sessionId: '', // Will be set by caller
        content,
        sources: step.result.sources || [],
        timestamp: new Date().toISOString(),
        relevance: step.result.confidence || 0.7,
      });
    }
  });

  return knowledge;
}

function formatStepContent(step: PlanStep): string {
  if (!step.result) return '';

  const { data, sources } = step.result;

  let content = `**${step.title}**\n\n${step.description}\n\n`;

  // Format the data
  if (data.summary) {
    content += `${data.summary}\n\n`;
  } else if (typeof data === 'object') {
    content += `Findings: ${JSON.stringify(data, null, 2)}\n\n`;
  } else {
    content += `${data}\n\n`;
  }

  // Add sources
  if (sources && sources.length > 0) {
    content += 'Sources:\n';
    sources.forEach((source, idx) => {
      content += `${idx + 1}. ${source.title}`;
      if (source.url) {
        content += ` - ${source.url}`;
      }
      content += '\n';
    });
  }

  return content;
}
