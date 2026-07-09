'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PracticeSessionServiceImpl } from '@/infrastructure/services/practice/PracticeSessionServiceImpl';
import { TimerServiceImpl } from '@/infrastructure/services/practice/TimerServiceImpl';
import type {
  PracticeSession,
  PracticeSessionSummary,
  ConfidenceLevel,
  BookmarkReason,
} from '@/domain/entities/practice/PracticeEntities';
import {
  QuestionRenderer,
  QuestionSkeleton,
  QuestionNavigation,
  QuestionErrorState,
} from '@/components/uqre';
import {
  Clock, Lightbulb, Edit3, Bookmark, Save, CheckCircle2,
  AlertCircle, ChevronRight, Award, Compass, RefreshCw, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const sessionService = new PracticeSessionServiceImpl();
const timerService = new TimerServiceImpl();

export default function ActivePracticePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = React.useState<PracticeSession | null>(null);
  const [summary, setSummary] = React.useState<PracticeSessionSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // States
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [remainingTime, setRemainingTime] = React.useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = React.useState<string | undefined>(undefined);
  const [answerValue, setAnswerValue] = React.useState<string>('');
  
  // Modals / Panels
  const [showConfidenceModal, setShowConfidenceModal] = React.useState(false);
  const [activeHint, setActiveHint] = React.useState<string | null>(null);
  const [hintLevel, setHintLevel] = React.useState(0);
  const [scratchpadText, setScratchpadText] = React.useState('');
  const [questionNote, setQuestionNote] = React.useState('');

  // 1. Fetch Session on Mount
  React.useEffect(() => {
    async function load() {
      try {
        const data = await sessionService.getSession(sessionId);
        if (!data) {
          setError('Sesi latihan tidak ditemukan.');
          return;
        }
        setSession(data);
        if (data.status === 'COMPLETED') {
          const sum = await sessionService.completeSession(sessionId);
          setSummary(sum);
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat sesi.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  // 2. Timer Loop
  React.useEffect(() => {
    if (!session || session.status !== 'RUNNING') return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      if (session.config.timeLimitSeconds) {
        const remaining = timerService.calculateRemainingSeconds(
          new Date(session.startedAt),
          session.config.timeLimitSeconds
        );
        setRemainingTime(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          handleTimeExpired();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Sync current question index states
  React.useEffect(() => {
    if (!session) return;
    const currentQ = session.questionSet[currentIndex];
    if (!currentQ) return;

    const attempt = session.progress.attempts[currentQ.id];
    setSelectedChoiceId(attempt?.selectedChoiceId);
    setAnswerValue(attempt?.studentAnswerValue || '');

    const note = session.progress.notes[currentQ.id];
    setQuestionNote(note?.noteText || '');

    const hint = session.progress.hints[currentQ.id];
    setHintLevel(hint?.highestLevelUnlocked || 0);
    setActiveHint(null);
  }, [currentIndex, session]);

  const handleTimeExpired = async () => {
    if (!session) return;
    const sum = await sessionService.completeSession(session.id);
    setSummary(sum);
    const updated = await sessionService.getSession(session.id);
    setSession(updated);
  };

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setAnswerValue(choiceId);
    // Show confidence rating modal on answer submission
    setShowConfidenceModal(true);
  };

  const handleTextAnswerSubmit = (val: string) => {
    setAnswerValue(val);
    setShowConfidenceModal(true);
  };

  const submitConfidenceAndAnswer = async (conf: ConfidenceLevel) => {
    if (!session) return;
    const currentQ = session.questionSet[currentIndex];
    if (!currentQ) return;

    const attemptUpdate = {
      questionId: currentQ.id,
      selectedChoiceId,
      studentAnswerValue: answerValue,
      confidence: conf,
      timeSpentSeconds: 15, // Stub duration
    };

    const updated = await sessionService.submitAnswer(session.id, currentQ.id, attemptUpdate);
    setSession(updated);
    setShowConfidenceModal(false);

    // Auto-advance if immediate feedback is on
    if (session.config.immediateFeedback && currentIndex < session.questionSet.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    }
  };

  const handleRequestHint = async () => {
    if (!session) return;
    const currentQ = session.questionSet[currentIndex];
    if (!currentQ) return;

    const { hintText, level, session: updated } = await sessionService.requestNextHint(session.id, currentQ.id);
    setSession(updated);
    setHintLevel(level);
    setActiveHint(hintText);
  };

  const handleToggleBookmark = async (reason: BookmarkReason) => {
    if (!session) return;
    const currentQ = session.questionSet[currentIndex];
    if (!currentQ) return;

    const updated = await sessionService.toggleBookmark(session.id, currentQ.id, reason);
    setSession(updated);
  };

  const handleSaveNote = async () => {
    if (!session) return;
    const currentQ = session.questionSet[currentIndex];
    if (!currentQ) return;

    const updated = await sessionService.saveQuestionNote(session.id, currentQ.id, questionNote);
    setSession(updated);
  };

  const handleSaveScratchpad = async () => {
    if (!session) return;
    const updated = await sessionService.saveScratchpad(session.id, {
      sessionId: session.id,
      notesText: scratchpadText,
    });
    setSession(updated);
  };

  const handleFinishPractice = async () => {
    if (!session) return;
    const sum = await sessionService.completeSession(session.id);
    setSummary(sum);
    const updated = await sessionService.getSession(session.id);
    setSession(updated);
  };

  if (loading) return <QuestionSkeleton />;
  if (error || !session) return <QuestionErrorState message={error || undefined} onRetry={() => router.refresh()} />;

  const currentQ = session.questionSet[currentIndex];
  const isBookmarked = currentQ ? !!session.progress.bookmarks[currentQ.id] : false;

  // ─── SESSION SUMMARY VIEW ──────────────────────────────────────────────────
  if (session.status === 'COMPLETED' && summary) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-xs">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-extrabold">Latihan Selesai!</h1>
            <p className="text-neutral-500 text-xs">Mari kita lihat pencapaian dan konsep materi yang kamu pelajari.</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-4 bg-white dark:bg-neutral-900 text-center">
            <p className="font-bold text-neutral-450 uppercase tracking-wider text-[9px]">Akurasi</p>
            <h2 className="text-2xl font-extrabold font-heading text-indigo-600 mt-1">{summary.accuracyPct}%</h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">{summary.correctCount} dari {session.questionSet.length} Benar</p>
          </Card>
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-4 bg-white dark:bg-neutral-900 text-center">
            <p className="font-bold text-neutral-450 uppercase tracking-wider text-[9px]">Total Waktu</p>
            <h2 className="text-2xl font-extrabold font-heading text-indigo-600 mt-1">{Math.round(summary.totalTimeSeconds)}s</h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">Rata-rata: {Math.round(summary.averageTimePerQuestion)}s/soal</p>
          </Card>
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-4 bg-white dark:bg-neutral-900 text-center">
            <p className="font-bold text-neutral-450 uppercase tracking-wider text-[9px]">Petunjuk Digunakan</p>
            <h2 className="text-2xl font-extrabold font-heading text-indigo-600 mt-1">{summary.hintsUsedCount}</h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">Progressive hints</p>
          </Card>
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-4 bg-white dark:bg-neutral-900 text-center">
            <p className="font-bold text-neutral-450 uppercase tracking-wider text-[9px]">Penanda Soal</p>
            <h2 className="text-2xl font-extrabold font-heading text-indigo-600 mt-1">{summary.bookmarksCount}</h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">Bookmarks untuk diulas</p>
          </Card>
        </div>

        {/* Strong/Weak Concepts Analysis */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-5 bg-white dark:bg-neutral-900">
            <h3 className="font-bold text-sm mb-3 text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Topik Kuat
            </h3>
            {summary.strongConcepts.length === 0 ? (
              <p className="text-neutral-500 italic">Selesaikan latihan dengan benar untuk memetakan kekuatan materi.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.strongConcepts.map((c) => (
                  <span key={c} className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-350 px-2.5 py-1 rounded-xl font-bold border border-emerald-100/50">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </Card>
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-5 bg-white dark:bg-neutral-900">
            <h3 className="font-bold text-sm mb-3 text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Topik Lemah
            </h3>
            {summary.weakConcepts.length === 0 ? (
              <p className="text-neutral-500 italic">Tidak ada topik lemah yang terdeteksi. Pertahankan prestasimu!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.weakConcepts.map((c) => (
                  <span key={c} className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-350 px-2.5 py-1 rounded-xl font-bold border border-rose-100/50">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/student/practice')}
            className="rounded-2xl h-10 px-6 bg-indigo-600 hover:bg-indigo-755 text-white font-extrabold gap-2 transition-all active:scale-95"
          >
            Kembali ke Dashboard <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE SESSION WORKSPACE ──────────────────────────────────────────────
  const attempt = currentQ ? session.progress.attempts[currentQ.id] : undefined;
  
  const questionState = {
    isAnswered: !!(attempt?.selectedChoiceId || attempt?.studentAnswerValue),
    selectedChoiceId: attempt?.selectedChoiceId,
    studentAnswerValue: attempt?.studentAnswerValue,
    isCorrect: attempt?.isCorrect,
    isSkipped: false,
    isMarkedForReview: false,
    isLocked: false,
    isDisabled: false,
    isFocused: true,
    timeExpired: session.status === 'TIMED_OUT',
    revealSolution: session.config.immediateFeedback,
  };

  const answeredIndices = session.questionSet
    .map((q, idx) => (session.progress.attempts[q.id] ? idx : -1))
    .filter((idx) => idx !== -1);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 text-xs">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-850 pb-4">
        <div>
          <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wider">Practice Session</span>
          <h1 className="text-xl font-heading font-extrabold">Active Workstation</h1>
        </div>

        {/* Timer Panel */}
        <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 px-4 py-2 rounded-2xl">
          <Clock className="h-4 w-4 text-indigo-500" />
          <div className="font-mono text-xs font-bold">
            {remainingTime !== null ? (
              <span>Remaining: {Math.floor(remainingTime / 60)}m {remainingTime % 60}s</span>
            ) : (
              <span>Elapsed: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleFinishPractice}
            className="rounded-xl h-8 px-4 bg-red-600 hover:bg-red-750 text-white font-extrabold text-xs"
          >
            Selesaikan
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Core Rendering Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {currentQ && (
            <QuestionRenderer
              question={currentQ}
              state={questionState}
              onChoiceSelect={handleChoiceSelect}
              onAnswerSubmit={handleTextAnswerSubmit}
            />
          )}

          {/* Navigation Controls */}
          <QuestionNavigation
            currentIndex={currentIndex}
            totalQuestions={session.questionSet.length}
            answeredIndices={answeredIndices}
            onNavigate={(idx) => setCurrentIndex(idx)}
          />
        </div>

        {/* Sidebar Workspace: Hints, Notes, Scratchpad */}
        <div className="lg:col-span-4 space-y-4">
          {/* Progressive Hint Box */}
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-4">
            <h3 className="font-bold text-sm text-neutral-850 dark:text-neutral-200 flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" /> Socratic Hints
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestHint}
                className="w-full text-xs h-8 border-neutral-200 dark:border-neutral-800 rounded-xl font-bold"
              >
                Minta Hint {hintLevel > 0 ? `(Level ${hintLevel}/5)` : ''}
              </Button>

              {activeHint && (
                <div className="p-3 bg-amber-500/[0.02] border border-amber-300/20 rounded-2xl text-neutral-600 dark:text-neutral-350 leading-relaxed text-[11px]">
                  <p className="font-bold text-amber-600 text-[10px] uppercase tracking-wider mb-1">Hint Level {hintLevel}</p>
                  {activeHint}
                </div>
              )}
            </div>
          </Card>

          {/* Question Note Box */}
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-4">
            <h3 className="font-bold text-sm text-neutral-850 dark:text-neutral-200 flex items-center gap-2 mb-3">
              <Edit3 className="h-4 w-4 text-indigo-500" /> Catatan Pertanyaan
            </h3>
            <textarea
              value={questionNote}
              onChange={(e) => setQuestionNote(e.target.value)}
              placeholder="Tulis catatan pengerjaan soal..."
              rows={3}
              className="w-full text-xs p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 focus:outline-none focus:border-indigo-500 leading-normal resize-none"
            />
            <Button
              onClick={handleSaveNote}
              size="sm"
              className="w-full h-8 text-xs rounded-xl bg-neutral-900 text-white font-bold gap-1 mt-2"
            >
              <Save className="h-3.5 w-3.5" /> Simpan Catatan
            </Button>
          </Card>

          {/* Drawing Scratchpad Box */}
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-4">
            <h3 className="font-bold text-sm text-neutral-850 dark:text-neutral-200 flex items-center gap-2 mb-3">
              <Edit3 className="h-4 w-4 text-emerald-500" /> Sketchpad Coretan
            </h3>
            <textarea
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              placeholder="Coret-coret perhitungan atau diagram di sini..."
              rows={4}
              className="w-full text-xs p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 focus:outline-none focus:border-indigo-500 leading-normal resize-none"
            />
            <Button
              onClick={handleSaveScratchpad}
              size="sm"
              className="w-full h-8 text-xs rounded-xl bg-neutral-900 text-white font-bold gap-1 mt-2"
            >
              <Save className="h-3.5 w-3.5" /> Simpan Coretan
            </Button>
          </Card>
        </div>
      </div>

      {/* ── CONFIDENCE RATING MODAL ────────────────────────────────────────── */}
      {showConfidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/70 dark:border-neutral-800 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading">Tingkat Keyakinan</h3>
                <p className="text-neutral-500 text-[10px] mt-0.5">Seberapa yakin kamu dengan jawaban ini?</p>
              </div>
              <button onClick={() => setShowConfidenceModal(false)} className="text-neutral-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { level: 'VERY_CONFIDENT', label: 'Sangat Yakin', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-500 hover:text-white' },
                { level: 'CONFIDENT', label: 'Yakin', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-500 hover:text-white' },
                { level: 'UNSURE', label: 'Ragu-ragu', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-500 hover:text-white' },
                { level: 'GUESSING', label: 'Menebak', color: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-500 hover:text-white' },
              ].map(({ level, label, color }) => (
                <button
                  key={level}
                  onClick={() => submitConfidenceAndAnswer(level as ConfidenceLevel)}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
