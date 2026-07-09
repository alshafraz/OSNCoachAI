// src/application/adaptive-learning/domain/models/LearningSession.ts
import { PaleDifficulty, PaceRecommendation } from '../../config/paleConfig';

/**
 * A concrete, structured learning session built by LearningSessionPlanner.
 * Represents exactly what the student should do in one study sitting.
 */
export interface LearningSession {
  id: string;
  studentId: string;
  scheduledDate: Date;
  estimatedDurationMinutes: number;
  /** Pace recommendation for this session */
  paceRecommendation: PaceRecommendation;
  phases: SessionPhase[];
  /** Adaptation decisions that shaped this session */
  appliedDecisionIds: string[];
  createdAt: Date;
}

export interface SessionPhase {
  type: SessionPhaseType;
  label: string;
  durationMinutes: number;
  items: SessionItem[];
}

export type SessionPhaseType =
  | 'WARM_UP'
  | 'CORE_PRACTICE'
  | 'CHALLENGE'
  | 'REVIEW'
  | 'AI_TUTOR'
  | 'REFLECTION'
  | 'COOLDOWN';

export interface SessionItem {
  type: 'QUESTION' | 'REVIEW_QUESTION' | 'AI_TUTOR_TOPIC' | 'REFLECTION_PROMPT';
  topicId: string;
  difficulty?: PaleDifficulty;
  questionId?: string;
  prompt?: string;
  isReview?: boolean;
}
