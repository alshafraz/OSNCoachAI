// src/application/ai-governance/domain/models/CostTracking.ts
import { AIOpsTaskType } from '../../config/governanceConfig';

/**
 * Historical snapshot log of token billing metrics.
 */
export interface CostTracking {
  id: string;
  requestId: string;
  engine: AIOpsTaskType;
  studentId?: string;
  providerId: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  timestamp: Date;
}
