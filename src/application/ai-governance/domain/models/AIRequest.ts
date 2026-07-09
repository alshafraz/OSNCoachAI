// src/application/ai-governance/domain/models/AIRequest.ts
import { AIOpsTaskType } from '../../config/governanceConfig';

/**
 * Capture metadata context of incoming AI request.
 */
export interface AIRequest {
  requestId: string;
  engine: AIOpsTaskType;
  studentId?: string;
  promptId: string;
  promptVersion: string;
  variables: Record<string, string>;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  timestamp: Date;
}
