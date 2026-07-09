// src/application/ai-governance/domain/models/AIResponse.ts

/**
 * Capture metadata and outcomes of an LLM generation call.
 */
export interface AIResponse {
  responseId: string;
  requestId: string;
  providerId: string; // e.g. 'openai/gpt-4o'
  rawContent: string;
  parsedData?: any;
  isValid: boolean;
  validationReason?: string;
  isSafe: boolean;
  safetyReason?: string;
  qualityScore: number; // 0-100 evaluation score
  latencyMs: number;
  retryCount: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  timestamp: Date;
}
