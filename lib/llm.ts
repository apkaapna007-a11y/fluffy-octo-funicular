import OpenAI from 'openai';
import { MODEL_ROUTING, OPENROUTER_CONFIG } from './config';

// Initialize OpenAI client with OpenRouter configuration
export const createLLMClient = () => {
  return new OpenAI({
    apiKey: OPENROUTER_CONFIG.apiKey,
    baseURL: OPENROUTER_CONFIG.baseURL,
    defaultHeaders: OPENROUTER_CONFIG.defaultHeaders,
  });
};

// Type for model roles
type ModelRole = keyof typeof MODEL_ROUTING;

// Generic LLM call function
export async function callLLM(
  role: ModelRole,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const client = createLLMClient();
  const model = MODEL_ROUTING[role];

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: false,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error(`LLM call failed for ${role}:`, error);
    throw new Error(`Failed to call ${model}: ${error.message}`);
  }
}

// Streaming LLM call
export async function* streamLLM(
  role: ModelRole,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) {
  const client = createLLMClient();
  const model = MODEL_ROUTING[role];

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error: any) {
    console.error(`LLM streaming failed for ${role}:`, error);
    throw new Error(`Failed to stream ${model}: ${error.message}`);
  }
}

// Specialized LLM functions
export const llm = {
  // Call planner model
  async plan(prompt: string) {
    return callLLM('planner', [
      {
        role: 'system',
        content: 'You are a research planning expert. Create detailed, structured research plans.',
      },
      { role: 'user', content: prompt },
    ]);
  },

  // Call verifier model
  async verify(prompt: string) {
    return callLLM('verifier', [
      {
        role: 'system',
        content: 'You are a verification expert. Validate plans and identify issues.',
      },
      { role: 'user', content: prompt },
    ], { temperature: 0.3 });
  },

  // Call executor model
  async execute(prompt: string) {
    return callLLM('executor', [
      {
        role: 'system',
        content: 'You are a task execution expert. Execute research tasks accurately.',
      },
      { role: 'user', content: prompt },
    ]);
  },

  // Call synthesizer model
  async synthesize(prompt: string) {
    return callLLM('synthesizer', [
      {
        role: 'system',
        content: 'You are a synthesis expert. Combine information into coherent, well-sourced reports.',
      },
      { role: 'user', content: prompt },
    ]);
  },

  // Stream synthesizer output
  async* streamSynthesize(prompt: string) {
    yield* streamLLM('synthesizer', [
      {
        role: 'system',
        content: 'You are a synthesis expert. Combine information into coherent, well-sourced reports.',
      },
      { role: 'user', content: prompt },
    ]);
  },
};
