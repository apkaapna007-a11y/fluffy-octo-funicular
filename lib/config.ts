import { ModelConfig } from './types';

// Model routing configuration
export const MODEL_ROUTING: ModelConfig = {
  planner: "anthropic/claude-3.5-sonnet",
  verifier: "openai/gpt-4o-mini",
  executor: "mistralai/mixtral-8x7b-instruct",
  synthesizer: "openai/gpt-4o",
};

// OpenRouter configuration
export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://deep-research-agent.vercel.app',
    'X-Title': 'Deep Research Agent',
  },
};

// Orchestration limits
export const ORCHESTRATION_LIMITS = {
  maxSteps: 10,
  maxRetries: 3,
  stepTimeout: 60000, // 60 seconds
  totalTimeout: 300000, // 5 minutes
  maxTokens: 4096,
};

// Available MCP tools (can be extended)
export const AVAILABLE_TOOLS = [
  {
    name: 'web_search',
    description: 'Search the web for information using a search query',
    parameters: {
      query: 'string',
      max_results: 'number',
    },
  },
  {
    name: 'fetch_url',
    description: 'Fetch and extract content from a specific URL',
    parameters: {
      url: 'string',
    },
  },
  {
    name: 'extract_data',
    description: 'Extract structured data from text',
    parameters: {
      text: 'string',
      schema: 'object',
    },
  },
  {
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      expression: 'string',
    },
  },
];
