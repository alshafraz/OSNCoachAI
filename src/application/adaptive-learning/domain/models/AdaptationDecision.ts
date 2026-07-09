// src/application/adaptive-learning/domain/models/AdaptationDecision.ts
import { AdaptationAction } from '../../config/paleConfig';

/**
 * A single explainable adaptation decision produced by the PALE engine.
 * Every decision carries the evidence that drove it, the reasoning used,
 * the expected benefit, and a confidence score.
 *
 * Decisions are persisted so they can be audited, replayed, and compared
 * against actual outcomes.
 */
export interface AdaptationDecision {
  id: string;
  studentId: string;
  topicId: string;
  action: AdaptationAction;

  // ─── Explainability ───────────────────────────────────────────────────────────
  /** Human-readable summary of the decision */
  decisionSummary: string;
  /** The evidence signals that triggered this decision */
  evidenceUsed: EvidenceSignal[];
  /** Natural-language reasoning chain */
  reasoning: string;
  /** Expected benefit to learning outcome */
  expectedBenefit: string;
  /** Estimated improvement percentage (0-100) */
  estimatedImprovement: number;
  /** Confidence in this decision (0-1) */
  confidence: number;

  // ─── Metadata ─────────────────────────────────────────────────────────────────
  modelVersion: string;
  createdAt: Date;
  appliedAt?: Date;
  outcome?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'; // filled after outcome observed
}

export interface EvidenceSignal {
  metric: string;       // e.g. 'accuracy', 'hintUsageRate'
  value: number | string;
  threshold?: number;
  direction: 'ABOVE' | 'BELOW' | 'EQUAL';
}
