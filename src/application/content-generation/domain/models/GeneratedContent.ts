// src/application/content-generation/domain/models/GeneratedContent.ts
import type { AcgpContentType, AcgpDifficulty } from '../../config/acgpConfig';

/** State machine for a piece of generated content */
export type GenerationState = 'PENDING' | 'GENERATING' | 'GENERATED' | 'FAILED';
export type ValidationState = 'PENDING' | 'VALIDATING' | 'PASSED' | 'FAILED';
export type ReviewState = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EDIT_REQUESTED' | 'REGENERATION_REQUESTED';
export type PublicationState = 'UNPUBLISHED' | 'PUBLISHED' | 'ARCHIVED';

/**
 * A single piece of generated content with its full lifecycle states.
 */
export interface GeneratedContent {
  id: string;
  requestId: string;

  contentType: AcgpContentType;

  /** The actual generated payload – structure depends on contentType */
  body: ContentBody;

  /** State machine fields */
  generationState: GenerationState;
  validationState: ValidationState;
  reviewState: ReviewState;
  publicationState: PublicationState;

  /** Quality scores from validation */
  qualityScore?: number;
  qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';

  /** Difficulty calibration */
  estimatedDifficulty?: AcgpDifficulty;
  difficultyConfidence?: number;

  /** LLM metadata */
  promptVersion?: string;
  modelUsed?: string;
  tokensUsed?: number;
  estimatedCostUsd?: number;
  generationTimeMs?: number;
  regenerationCount: number;

  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/** Flexible content body — different shapes per contentType */
export interface ContentBody {
  /** For questions */
  questionBody?: string;
  questionType?: string;
  choices?: Array<{ id: string; text: string }>;
  correctAnswer?: string;
  explanation?: string;
  hints?: ProgressiveHint[];
  alternativeSolutions?: AlternativeSolution[];
  misconceptions?: MisconceptionNote[];
  solvingSteps?: SolvingStep[];

  /** For concept content */
  conceptId?: string;
  title?: string;
  definition?: string;
  examples?: string[];
  counterexamples?: string[];
  visualAnalogy?: string;
  everydayApplication?: string;
  olympiadInsight?: string;
  formulaExplanation?: string;

  /** For practice sets / exams */
  contentItems?: GeneratedContent[];
  setTitle?: string;
  setDescription?: string;
  difficultyDistribution?: Record<string, number>;

  /** For visual descriptions */
  visualDescription?: string;
  diagramType?: 'geometry' | 'table' | 'chart' | 'illustration' | 'model';

  /** Raw LLM output (stored for audit, not exposed to students) */
  rawLlmOutput?: string;
}

export interface ProgressiveHint {
  level: 1 | 2 | 3 | 4 | 5;
  type: 'observation' | 'concept' | 'formula' | 'partialReasoning' | 'nearComplete';
  text: string;
}

export interface AlternativeSolution {
  method: 'standard' | 'olympiad' | 'alternative' | 'fast' | 'visual';
  steps: SolvingStep[];
  whenPreferred: string;
}

export interface SolvingStep {
  stepNumber: number;
  description: string;
  formula?: string;
  calculation?: string;
}

export interface MisconceptionNote {
  incorrectReasoning: string;
  whyItHappens: string;
  howToAvoid: string;
  correctThinking: string;
}
