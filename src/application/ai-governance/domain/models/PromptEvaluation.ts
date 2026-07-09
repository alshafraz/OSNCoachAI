// src/application/ai-governance/domain/models/PromptEvaluation.ts

/**
 * Metric analysis generated after testing prompts against baseline inputs.
 */
export interface PromptEvaluation {
  id: string;
  promptId: string;
  promptVersion: string;
  evaluatedAt: Date;
  overallScore: number; // 0-100
  correctness: number;
  consistency: number;
  completeness: number;
  pedagogicalQuality: number;
  mathematicalAccuracy: number;
  explanationQuality: number;
  hintQuality: number;
  sampleCount: number;
  notes?: string;
}
