// src/application/content-generation/domain/models/GenerationRequest.ts
import type { AcgpContentType, AcgpDifficulty, AcgpGrade } from '../../config/acgpConfig';

/**
 * Describes a single generation request submitted to the ACGP.
 */
export interface GenerationRequest {
  /** Unique request ID (UUID) */
  id: string;

  /** Who submitted this request */
  requestedBy: string;

  /** ISO timestamp */
  requestedAt: Date;

  /** What type of content to generate */
  contentType: AcgpContentType;

  /** --- Question / Content Specification --- */
  topic?: string;
  subtopic?: string;
  difficulty?: AcgpDifficulty;
  targetGrade?: AcgpGrade;
  count?: number;
  learningObjective?: string;
  olympiadCategory?: string;
  requiredSkills?: string[];
  reasoningStrategy?: string;

  /** Optional: Student context for personalisation */
  studentId?: string;
  weakTopics?: string[];
  recentMistakeConceptIds?: string[];

  /** Variation configuration */
  sourceContentId?: string;
  variationAspects?: Array<'numbers' | 'context' | 'story' | 'diagram' | 'difficulty' | 'reasoningPath'>;

  /** Practice Set / Mock Exam specific */
  topicMix?: 'single' | 'mixed' | 'weakFocus' | 'difficultyProgression' | 'competitionPrep' | 'review';

  /** Any additional metadata */
  metadata?: Record<string, unknown>;
}
