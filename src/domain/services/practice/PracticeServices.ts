/**
 * Learning Practice Engine (LPE) — Service Interfaces
 *
 * Establishes core contracts for session management, tracking, timer, progressive hints, and recovery.
 */

import type {
  PracticeSession,
  PracticeConfig,
  QuestionAttempt,
  HintUsage,
  LpeBookmark,
  StudentNote,
  Scratchpad,
  PracticeSessionSummary,
} from '../../entities/practice/PracticeEntities';
import type { QuestionDto } from '@/components/uqre/dto/QuestionDto';

export interface PracticeSessionService {
  /** Creates a new session, picks questions matching config, and saves it. */
  createSession(studentId: string, config: PracticeConfig): Promise<PracticeSession>;

  /** Retrieves an active or completed session. */
  getSession(sessionId: string): Promise<PracticeSession | null>;

  /** Saves progress updates (selected answers, timers, flags). */
  saveProgress(sessionId: string, updates: Partial<import('../../entities/practice/PracticeEntities').PracticeProgress>): Promise<PracticeSession>;

  /** Records a question answer attempt with confidence ratings. */
  submitAnswer(
    sessionId: string,
    questionId: string,
    attempt: Omit<QuestionAttempt, 'solvedAt' | 'hintsUsedCount'>
  ): Promise<PracticeSession>;

  /** Unlocks the next Socratic hint level from MIL for the given question. */
  requestNextHint(sessionId: string, questionId: string): Promise<{ hintText: string; level: number; session: PracticeSession }>;

  /** Marks a session as complete, locks inputs, and computes a detailed summary report. */
  completeSession(sessionId: string): Promise<PracticeSessionSummary>;

  /** Submits bookmark/unbookmark reason for a question. */
  toggleBookmark(sessionId: string, questionId: string, reason?: import('../../entities/practice/PracticeEntities').BookmarkReason): Promise<PracticeSession>;

  /** Saves or updates note text for a question. */
  saveQuestionNote(sessionId: string, questionId: string, noteText: string): Promise<PracticeSession>;

  /** Saves sketchpad drawing/text updates. */
  saveScratchpad(sessionId: string, updates: Partial<Scratchpad>): Promise<PracticeSession>;
}

export interface SessionRecoveryService {
  /** Automatically saves session checkpoint. */
  checkpoint(session: PracticeSession): Promise<void>;

  /** Recovers and resumes a session from storage after disconnection or page refresh. */
  recover(sessionId: string): Promise<PracticeSession | null>;

  /** Returns list of uncompleted sessions for a student. */
  getActiveSessions(studentId: string): Promise<PracticeSession[]>;
}

export interface PracticeHistoryService {
  /** Returns history summaries of all practice sessions completed by a student. */
  getCompletedSummaries(studentId: string): Promise<PracticeSessionSummary[]>;

  /** Maps strong and weak concept IDs based on accuracy performance. */
  getConceptPerformance(studentId: string): Promise<{ strongConcepts: string[]; weakConcepts: string[] }>;
}
