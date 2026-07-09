/**
 * Learning Practice Engine (LPE) — Domain Entities
 *
 * Modeled for learning-first practice sessions.
 * Independent of database types and fully reusable.
 */

import type { QuestionDto } from '@/components/uqre/dto/QuestionDto';

export type PracticeMode =
  | 'QUICK_PRACTICE'
  | 'TOPIC_PRACTICE'
  | 'DIFFICULTY_PRACTICE'
  | 'MIXED_PRACTICE'
  | 'WEAK_TOPIC_PRACTICE'
  | 'REVIEW_INCORRECT'
  | 'FAVORITE_QUESTIONS';

export type PracticeStatus = 'RUNNING' | 'COMPLETED' | 'PAUSED' | 'TIMED_OUT';

export type ConfidenceLevel = 'VERY_CONFIDENT' | 'CONFIDENT' | 'UNSURE' | 'GUESSING';

export type BookmarkReason = 'INTERESTING' | 'REVIEW_LATER' | 'TOO_DIFFICULT' | 'FAVORITE';

export interface PracticeConfig {
  questionCount: number;
  mode: PracticeMode;
  topic?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'OLYMPIAD' | 'EXPERT';
  timeLimitSeconds?: number;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  hintAvailability: boolean;
  explanationAvailability: boolean;
  immediateFeedback: boolean;
}

export interface HintUsage {
  questionId: string;
  highestLevelUnlocked: number;
  timestamps: Date[];
}

export interface LpeBookmark {
  questionId: string;
  reason: BookmarkReason;
  createdAt: Date;
}

export interface StudentNote {
  questionId: string;
  noteText: string;
  updatedAt: Date;
}

export interface Scratchpad {
  sessionId: string;
  notesText: string;
  drawingDataUrl?: string;
  updatedAt: Date;
}

export interface QuestionAttempt {
  questionId: string;
  selectedChoiceId?: string;
  studentAnswerValue?: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
  confidence?: ConfidenceLevel;
  hintsUsedCount: number;
  solvedAt: Date;
}

export interface PracticeProgress {
  currentQuestionIndex: number;
  elapsedSeconds: number;
  attempts: Record<string, QuestionAttempt>; // Keyed by questionId
  hints: Record<string, HintUsage>; // Keyed by questionId
  bookmarks: Record<string, LpeBookmark>; // Keyed by questionId
  notes: Record<string, StudentNote>; // Keyed by questionId
}

export interface PracticeSession {
  id: string;
  studentId: string;
  config: PracticeConfig;
  questionSet: QuestionDto[];
  status: PracticeStatus;
  progress: PracticeProgress;
  scratchpad?: Scratchpad;
  startedAt: Date;
  completedAt?: Date;
}

export interface PracticeSessionSummary {
  sessionId: string;
  questionsSolved: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracyPct: number;
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
  hintsUsedCount: number;
  bookmarksCount: number;
  confidenceDistribution: Record<ConfidenceLevel, number>;
  weakConcepts: string[];
  strongConcepts: string[];
}
