/**
 * LPE — Practice Session Service Implementation
 *
 * The orchestrator containing all business rules for student practice.
 * Integrates with the Universal Question Rendering Engine (UQRE) and
 * Mathematical Intelligence Layer (MIL).
 */

import type {
  PracticeSession,
  PracticeConfig,
  QuestionAttempt,
  PracticeProgress,
  PracticeSessionSummary,
  ConfidenceLevel,
  BookmarkReason,
  Scratchpad,
} from '@/domain/entities/practice/PracticeEntities';
import type { PracticeSessionService } from '@/domain/services/practice/PracticeServices';
import { lpeRepository } from './LpeRepository';
import { MIL } from '@/infrastructure/services/math/MathIntelligenceLayer';
import { mapToQuestionDto } from '@/components/uqre/dto/QuestionDto';

const SAMPLE_DATABASE_QUESTIONS = [
  {
    id: 'q-gcd-1',
    title: 'Mencari FPB Bilangan',
    body: 'Berapakah FPB (Faktor Persekutuan Terbesar) dari bilangan $48$ dan $72$?',
    type: 'SHORT_ANSWER',
    correctAnswer: '24',
    explanation: 'Faktorisasi prima:\n$48 = 2^4 \\times 3$\n$72 = 2^3 \\times 3^2$\nFPB diambil dari pangkat terkecil faktor prima persekutuan: $2^3 \\times 3 = 8 \\times 3 = 24$.',
    hint: 'Lakukan faktorisasi prima untuk kedua bilangan terlebih dahulu.',
    topic: 'Number Theory',
    difficulty: 'EASY',
    tags: ['gcd', 'factorization'],
  },
  {
    id: 'q-primes-1',
    title: 'Bilangan Prima',
    body: 'Berapakah bilangan prima terkecil yang lebih besar dari $20$?',
    type: 'MULTIPLE_CHOICE',
    options: ['21', '23', '27', '29'],
    correctAnswer: 'B',
    explanation: 'Bilangan ganjil setelah 20:\n- 21 (habis dibagi 3)\n- 23 (prima, hanya memiliki faktor 1 dan 23).',
    hint: 'Ingat kembali definisi bilangan prima.',
    topic: 'Number Theory',
    difficulty: 'EASY',
    tags: ['primes'],
  },
  {
    id: 'q-fractions-1',
    title: 'Penjumlahan Pecahan',
    body: 'Hitunglah nilai dari $\\frac{1}{2} + \\frac{1}{3}$.',
    type: 'MULTIPLE_CHOICE',
    options: ['\\frac{2}{5}', '\\frac{5}{6}', '\\frac{2}{6}', '\\frac{1}{5}'],
    correctAnswer: 'B',
    explanation: 'Samakan penyebut menjadi 6:\n$\\frac{1}{2} = \\frac{3}{6}$\n$\\frac{1}{3} = \\frac{2}{6}$\nHasil: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.',
    hint: 'Cari KPK dari penyebut pecahan (2 dan 3).',
    topic: 'Arithmetic',
    difficulty: 'EASY',
    tags: ['fractions'],
  },
  {
    id: 'q-area-1',
    title: 'Luas Segitiga',
    body: 'Sebuah segitiga memiliki alas sepanjang $12\\text{ cm}$ dan tinggi $8\\text{ cm}$. Berapakah luas segitiga tersebut?',
    type: 'SHORT_ANSWER',
    correctAnswer: '48',
    explanation: 'Rumus luas segitiga: $L = \\frac{1}{2} \\times a \\times t$\n$L = \\frac{1}{2} \\times 12 \\times 8 = 6 \\times 8 = 48\\text{ cm}^2$.',
    hint: 'Gunakan rumus luas segitiga umum.',
    topic: 'Geometry',
    difficulty: 'MEDIUM',
    tags: ['area'],
  },
  {
    id: 'q-combinatorics-1',
    title: 'Kombinasi Pakaian',
    body: 'Budi memiliki $3$ baju berbeda dan $4$ celana berbeda. Ada berapa banyak cara Budi memasangkan pakaian tersebut?',
    type: 'SHORT_ANSWER',
    correctAnswer: '12',
    explanation: 'Aturan perkalian: $3 \\times 4 = 12$ cara.',
    hint: 'Gunakan aturan perkalian dasar.',
    topic: 'Combinatorics',
    difficulty: 'EASY',
    tags: ['combinatorics'],
  },
];

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class PracticeSessionServiceImpl implements PracticeSessionService {
  async createSession(studentId: string, config: PracticeConfig): Promise<PracticeSession> {
    // 1. Fetch matching questions from mock DB
    let questions = [...SAMPLE_DATABASE_QUESTIONS];

    if (config.topic) {
      questions = questions.filter((q) => q.topic.toLowerCase() === config.topic!.toLowerCase());
    }
    if (config.difficulty) {
      questions = questions.filter((q) => q.difficulty === config.difficulty);
    }

    // Fallback if filter returns empty
    if (questions.length === 0) {
      questions = [...SAMPLE_DATABASE_QUESTIONS];
    }

    // Shuffle questions if configured
    if (config.shuffleQuestions) {
      questions.sort(() => Math.random() - 0.5);
    }

    // Slice to count
    questions = questions.slice(0, config.questionCount);

    // Map questions to UQRE DTOs
    const questionSet = questions.map((q) => {
      const dto = mapToQuestionDto(q);
      // Shuffle choices if configured
      if (config.shuffleChoices && dto.choices) {
        dto.choices = [...dto.choices].sort(() => Math.random() - 0.5);
      }
      return dto;
    });

    const progress: PracticeProgress = {
      currentQuestionIndex: 0,
      elapsedSeconds: 0,
      attempts: {},
      hints: {},
      bookmarks: {},
      notes: {},
    };

    const session: PracticeSession = {
      id: generateSessionId(),
      studentId,
      config,
      questionSet,
      status: 'RUNNING',
      progress,
      startedAt: new Date(),
    };

    return lpeRepository.save(session);
  }

  async getSession(sessionId: string): Promise<PracticeSession | null> {
    return lpeRepository.get(sessionId);
  }

  async saveProgress(sessionId: string, updates: Partial<PracticeProgress>): Promise<PracticeSession> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.progress = { ...session.progress, ...updates };
    return lpeRepository.save(session);
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    attemptUpdate: Omit<QuestionAttempt, 'solvedAt' | 'hintsUsedCount'>
  ): Promise<PracticeSession> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const qDto = session.questionSet.find((q) => q.id === questionId);
    if (!qDto) throw new Error(`Question not found in session: ${questionId}`);

    // Check correctness:
    // If MCQ: check match directly. If Short Answer: clean whitespace and compare
    const isCorrect = qDto.correctAnswer?.trim().toLowerCase() ===
      (attemptUpdate.selectedChoiceId || attemptUpdate.studentAnswerValue)?.trim().toLowerCase();

    const previousAttempt = session.progress.attempts[questionId];
    const hintsUsed = session.progress.hints[questionId]?.highestLevelUnlocked ?? 0;

    const fullAttempt: QuestionAttempt = {
      ...attemptUpdate,
      isCorrect,
      hintsUsedCount: hintsUsed,
      solvedAt: new Date(),
    };

    session.progress.attempts[questionId] = fullAttempt;

    // Check if all questions are answered, and complete if auto-submit or mixed
    const allAnswered = session.questionSet.every((q) => session.progress.attempts[q.id]?.studentAnswerValue || session.progress.attempts[q.id]?.selectedChoiceId);
    if (allAnswered && session.config.immediateFeedback === false) {
      session.status = 'COMPLETED';
      session.completedAt = new Date();
    }

    return lpeRepository.save(session);
  }

  async requestNextHint(
    sessionId: string,
    questionId: string
  ): Promise<{ hintText: string; level: number; session: PracticeSession }> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const qDto = session.questionSet.find((q) => q.id === questionId);
    if (!qDto) throw new Error(`Question not found in session: ${questionId}`);

    // Fetch primary concept from tags or default to factorization
    const primaryConcept = qDto.metadata?.skills?.[0] || 'primes';

    // Get progressive hint level
    const currentUsage = session.progress.hints[questionId] || {
      questionId,
      highestLevelUnlocked: 0,
      timestamps: [],
    };

    const nextLevel = Math.min(5, currentUsage.highestLevelUnlocked + 1);
    
    // Fetch template from MIL hint engine
    const hintTemplate = MIL.hints.getHint(primaryConcept, nextLevel as any);
    
    // Build text
    const hintText = hintTemplate
      ? MIL.hints.buildHintText(hintTemplate, { number1: '48', number2: '72' }) // Stub variables
      : 'Coba perhatikan langkah penyelesaian sebelumnya.';

    currentUsage.highestLevelUnlocked = nextLevel;
    currentUsage.timestamps.push(new Date());

    session.progress.hints[questionId] = currentUsage;
    lpeRepository.save(session);

    return { hintText, level: nextLevel, session };
  }

  async completeSession(sessionId: string): Promise<PracticeSessionSummary> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.status = 'COMPLETED';
    session.completedAt = new Date();
    lpeRepository.save(session);

    // Calculate metrics
    const questionSet = session.questionSet;
    const attempts = Object.values(session.progress.attempts);

    const questionsSolved = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect === true).length;
    const incorrectCount = attempts.filter((a) => a.isCorrect === false).length;
    const skippedCount = questionSet.length - questionsSolved;

    const totalTimeSeconds = attempts.reduce((acc, a) => acc + a.timeSpentSeconds, 0);
    const averageTimePerQuestion = questionsSolved > 0 ? totalTimeSeconds / questionsSolved : 0;
    const hintsUsedCount = Object.values(session.progress.hints).reduce((acc, h) => acc + h.highestLevelUnlocked, 0);
    const bookmarksCount = Object.keys(session.progress.bookmarks).length;

    // Confidence distribution
    const confidenceDistribution: Record<ConfidenceLevel, number> = {
      VERY_CONFIDENT: 0,
      CONFIDENT: 0,
      UNSURE: 0,
      GUESSING: 0,
    };
    for (const att of attempts) {
      if (att.confidence) {
        confidenceDistribution[att.confidence]++;
      }
    }

    // Strong / Weak concepts from MIL Concept Graph
    const strongConcepts: string[] = [];
    const weakConcepts: string[] = [];

    // Group correct/incorrect counts by concept tag
    const conceptScores = new Map<string, { correct: number; total: number }>();
    for (const q of questionSet) {
      const isCorrect = session.progress.attempts[q.id]?.isCorrect === true;
      const conceptId = q.metadata?.skills?.[0] || 'primes';
      
      const curr = conceptScores.get(conceptId) || { correct: 0, total: 0 };
      curr.total++;
      if (isCorrect) curr.correct++;
      conceptScores.set(conceptId, curr);
    }

    for (const [cid, score] of conceptScores.entries()) {
      const ratio = score.correct / score.total;
      const conceptName = MIL.concepts.getById(cid)?.name || cid;
      if (ratio >= 0.8) {
        strongConcepts.push(conceptName);
      } else {
        weakConcepts.push(conceptName);
      }
    }

    return {
      sessionId,
      questionsSolved,
      correctCount,
      incorrectCount,
      skippedCount,
      accuracyPct: questionSet.length > 0 ? Math.round((correctCount / questionSet.length) * 100) : 0,
      totalTimeSeconds,
      averageTimePerQuestion,
      hintsUsedCount,
      bookmarksCount,
      confidenceDistribution,
      strongConcepts,
      weakConcepts,
    };
  }

  async toggleBookmark(
    sessionId: string,
    questionId: string,
    reason?: BookmarkReason
  ): Promise<PracticeSession> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const existing = session.progress.bookmarks[questionId];
    if (existing) {
      delete session.progress.bookmarks[questionId];
    } else if (reason) {
      session.progress.bookmarks[questionId] = {
        questionId,
        reason,
        createdAt: new Date(),
      };
    }

    return lpeRepository.save(session);
  }

  async saveQuestionNote(sessionId: string, questionId: string, noteText: string): Promise<PracticeSession> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.progress.notes[questionId] = {
      questionId,
      noteText,
      updatedAt: new Date(),
    };

    return lpeRepository.save(session);
  }

  async saveScratchpad(sessionId: string, updates: Partial<Scratchpad>): Promise<PracticeSession> {
    const session = lpeRepository.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const currentScratch = session.scratchpad || {
      sessionId,
      notesText: '',
      updatedAt: new Date(),
    };

    session.scratchpad = { ...currentScratch, ...updates, updatedAt: new Date() };
    return lpeRepository.save(session);
  }
}
