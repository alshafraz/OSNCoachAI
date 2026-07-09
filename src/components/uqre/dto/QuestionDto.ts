/**
 * Universal Question Rendering Engine (UQRE) — DTO Specification
 * Consumed by all UQRE components to remain database-agnostic.
 */

export type UqreQuestionType =
  | 'MULTIPLE_CHOICE'
  | 'SHORT_ANSWER'
  | 'FILL_IN_BLANK'
  | 'TRUE_FALSE'
  | 'MATCHING'
  | 'ORDERING'
  | 'ESSAY';

export type UqreDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'OLYMPIAD' | 'EXPERT';

export interface UqreChoice {
  id: string;
  text: string; // May contain mathematical LaTeX notation
  imageUrl?: string;
  isCorrect?: boolean; // Visible only in review/solution preview mode
}

export interface UqreMedia {
  id: string;
  type: 'IMAGE' | 'DIAGRAM' | 'CHART' | 'GRAPH';
  url: string;
  caption?: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface UqreMetadata {
  difficulty: UqreDifficulty;
  topic: string;
  subtopic?: string;
  estimatedSolveMinutes?: number;
  skills?: string[];
  cognitiveLevel?: string;
  points?: number;
}

export interface QuestionDto {
  id: string;
  type: UqreQuestionType;
  sequenceNumber?: number;
  title?: string;
  body: string; // Supporting inline and block LaTeX expressions
  choices?: UqreChoice[];
  correctAnswer?: string; // Standardized string representation
  explanation?: string;
  hint?: string;
  media?: UqreMedia[];
  metadata?: UqreMetadata;
  subQuestions?: Omit<QuestionDto, 'subQuestions'>[]; // Multi-part questions
}

/**
 * Question State model representing client-side interactive rendering options.
 */
export interface UqreQuestionState {
  isAnswered: boolean;
  selectedChoiceId?: string;
  studentAnswerValue?: string;
  isCorrect?: boolean; // For post-submission/review rendering mode
  isSkipped: boolean;
  isMarkedForReview: boolean;
  isLocked: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  timeExpired: boolean;
  revealSolution: boolean;
}

/**
 * Helper mapper to convert the database/general Question model structure into Uqre DTO.
 */
export function mapToQuestionDto(rawQuestion: any): QuestionDto {
  if (!rawQuestion) throw new Error('Cannot map null or undefined question');

  return {
    id: rawQuestion.id || '',
    type: rawQuestion.type === 'MULTIPLE_CHOICE' ? 'MULTIPLE_CHOICE' : 'SHORT_ANSWER',
    title: rawQuestion.title || undefined,
    sequenceNumber: rawQuestion.sequenceNumber || undefined,
    body: rawQuestion.body || '',
    choices: rawQuestion.options
      ? rawQuestion.options.map((opt: string, index: number) => {
          const choiceId = String.fromCharCode(65 + index); // A, B, C, D...
          return {
            id: choiceId,
            text: opt,
            isCorrect: rawQuestion.correctAnswer === choiceId,
          };
        })
      : undefined,
    correctAnswer: rawQuestion.correctAnswer || undefined,
    explanation: rawQuestion.explanation || undefined,
    hint: rawQuestion.hint || undefined,
    media: rawQuestion.imageUrl
      ? [
          {
            id: 'img-1',
            type: 'IMAGE',
            url: rawQuestion.imageUrl,
            altText: rawQuestion.title || 'Question illustration',
          },
        ]
      : [],
    metadata: {
      difficulty: (rawQuestion.difficulty || 'MEDIUM') as UqreDifficulty,
      topic: rawQuestion.topic || 'General',
      skills: rawQuestion.tags || [],
    },
  };
}
