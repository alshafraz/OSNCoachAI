// src/application/ai-governance/domain/models/AuditLog.ts
import { AIOpsTaskType } from '../../config/governanceConfig';

/**
 * Enterprise audit logging containing the end-to-end details of an AI execution.
 */
export interface AuditLog {
  id: string;
  requestId: string;
  timestamp: Date;
  studentId?: string;
  engine: AIOpsTaskType;
  promptId: string;
  promptVersion: string;
  providerId: string;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs: number;
  retryCount: number;
  success: boolean;
  isValid: boolean;
  isSafe: boolean;
  qualityScore: number;
  errorDetails?: {
    code: string;
    message: string;
  };
}
