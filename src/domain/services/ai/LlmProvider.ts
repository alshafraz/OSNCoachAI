export interface LlmRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
  jsonSchema?: Record<string, any>;
}

export interface LlmResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
}

export interface LlmProvider {
  id: string;
  name: string;
  generate(request: LlmRequest): Promise<LlmResponse>;
}
