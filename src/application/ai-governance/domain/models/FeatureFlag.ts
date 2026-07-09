// src/application/ai-governance/domain/models/FeatureFlag.ts

/**
 * AI-specific feature flags to orchestrate promt rollouts, canary deployments, or model swaps.
 */
export interface FeatureFlag {
  flagKey: string; // e.g. 'new-tutor-prompt'
  description: string;
  isActive: boolean;
  /** Canary allocation weight (0-1), e.g. 0.20 for 20% of traffic */
  canaryWeight: number;
  /** Target value if active (e.g. secondary prompt version or model ID) */
  targetValue: string;
  createdAt: Date;
  updatedAt: Date;
}
