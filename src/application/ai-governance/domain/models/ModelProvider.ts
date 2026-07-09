// src/application/ai-governance/domain/models/ModelProvider.ts
import { AIOpsModelProvider } from '../../config/governanceConfig';

/**
 * Configuration and metadata details for one AI model provider target.
 */
export interface ModelProvider {
  id: string; // e.g. 'openai/gpt-4o'
  providerType: AIOpsModelProvider;
  modelName: string; // e.g. 'gpt-4o'
  avgLatencyMs: number;
  qualityScore: number; // relative benchmark ranking (0-100)
  isAvailable: boolean;
  costPerMillionPrompt: number;
  costPerMillionCompletion: number;
  fallbackModelId?: string;
  consecutiveFailures: number;
  lastTestedAt: Date;
}
