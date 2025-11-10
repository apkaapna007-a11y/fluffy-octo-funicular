// Core types for the Deep Research Agent

export interface ResearchPlan {
  id: string;
  query: string;
  steps: PlanStep[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  createdAt: string;
}

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  tools: string[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: StepResult;
}

export interface StepResult {
  data: any;
  sources: Source[];
  confidence: number;
  executionTime: number;
}

export interface Source {
  title: string;
  url?: string;
  snippet: string;
  relevance: number;
}

export interface KnowledgeEntry {
  id: string;
  sessionId: string;
  content: string;
  sources: Source[];
  timestamp: string;
  relevance: number;
}

export interface OrchestrationResult {
  planId: string;
  query: string;
  steps: PlanStep[];
  finalReport: string;
  knowledge: KnowledgeEntry[];
  status: 'success' | 'partial' | 'failed';
  metadata: {
    totalTime: number;
    tokensUsed: number;
    stepsCompleted: number;
    stepsTotal: number;
  };
}

export interface ModelConfig {
  planner: string;
  verifier: string;
  executor: string;
  synthesizer: string;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface VerificationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export interface PolicyDecision {
  action: 'continue' | 'replan' | 'stop';
  reason: string;
  confidence: number;
}
