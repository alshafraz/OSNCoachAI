export interface AgentContext {
  studentProfile?: Record<string, any>;
  learningHistory?: Record<string, any>[];
  questionMetadata?: Record<string, any>;
  sessionMemory?: Record<string, any>;
  [key: string]: any;
}

export interface AgentExecutionResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  confidenceScore: number;
  reasoning?: string;
  provider: string;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
  retryCount: number;
}

export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  supportedModels: string[];
  preferredModel: string;
  promptId: string;
  promptVersion: string;
  temperature?: number;
  maxTokens?: number;
  retryStrategy: {
    maxAttempts: number;
    initialDelayMs: number;
    backoffMultiplier: number;
    fallbackProvider?: string;
  };
}
