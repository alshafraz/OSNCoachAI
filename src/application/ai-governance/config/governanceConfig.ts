// src/application/ai-governance/config/governanceConfig.ts

/**
 * Central configuration for AI Governance & Operations (AIOps).
 * Manages defaults, cost coefficients, safety rules, and validation thresholds.
 */
export const governanceConfig = {
  /** Default temperature parameters */
  defaultTemperature: 0.3,
  
  /** Default max completion token budget */
  defaultMaxTokens: 2048,

  /** Max retry attempts before triggering fallback router */
  maxRetryAttempts: 3,

  /** Request timeouts in milliseconds */
  requestTimeoutMs: 15000,

  /** Safety score threshold below which outputs are blocked */
  minSafetyScore: 0.85,

  /** Quality score threshold (0-100) below which outputs are rejected */
  minQualityScore: 70,

  /** Providers pricing per million tokens in USD [prompt, completion] */
  pricing: {
    'openai/gpt-4o': [5.0, 15.0] as [number, number],
    'openai/gpt-4o-mini': [0.15, 0.60] as [number, number],
    'anthropic/claude-3-5-sonnet': [3.0, 15.0] as [number, number],
    'google/gemini-1.5-pro': [1.25, 3.75] as [number, number],
    'azure/gpt-4o': [5.0, 15.0] as [number, number],
    'local/llama-3': [0.0, 0.0] as [number, number],
    'mock/mock-gpt-4': [0.1, 0.1] as [number, number],
  },

  /** Fallback route order for routing engine */
  fallbacks: {
    'gpt-4o': ['openai/gpt-4o', 'anthropic/claude-3-5-sonnet', 'azure/gpt-4o', 'local/llama-3', 'mock/mock-gpt-4'],
    'gpt-4o-mini': ['openai/gpt-4o-mini', 'google/gemini-1.5-pro', 'local/llama-3', 'mock/mock-gpt-4'],
  },

  /** Injection & safety keywords to flag during guardrail scanning */
  safetyKeywords: [
    'ignore previous instructions',
    'system prompt bypass',
    'you are now an administrator',
    'instruction injection',
    'ignore all rules',
    'override safety filters',
    'leak prompt instructions',
  ],

  /** Observability & monitoring configurations */
  observability: {
    enablePrometheus: true,
    metricPrefix: 'aiops_',
  },
} as const;

export type AIOpsTaskType = 'OCR' | 'VALIDATION' | 'CLASSIFICATION' | 'TUTOR' | 'COACH' | 'CONTENT_GEN' | 'ADAPTIVE' | 'PEER_REVIEW';
export type AIOpsModelProvider = 'openai' | 'anthropic' | 'google' | 'azure' | 'local' | 'mock';
export type AIOpsReleaseStatus = 'DRAFT' | 'RELEASED' | 'DEPRECATED';
export type AIOpsRolloutStatus = 'CONTROL' | 'TREATMENT' | 'CANARY';
