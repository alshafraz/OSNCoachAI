'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PracticeSessionServiceImpl } from '@/infrastructure/services/practice/PracticeSessionServiceImpl';
import {
  Compass, Play, Clock, BookOpen, BarChart3,
  Award, ShieldCheck, Zap, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MIL } from '@/infrastructure/services/math/MathIntelligenceLayer';

const sessionService = new PracticeSessionServiceImpl();

export default function PracticeSelectionPage() {
  const router = useRouter();
  const [questionCount, setQuestionCount] = React.useState(5);
  const [selectedTopic, setSelectedTopic] = React.useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('');
  const [timeLimit, setTimeLimit] = React.useState<number>(0); // 0 means untimed
  const [immediateFeedback, setImmediateFeedback] = React.useState(true);
  const [isCreating, setIsCreating] = React.useState(false);

  const topics = React.useMemo(() => {
    return [...new Set(MIL.concepts.getAll().map((c) => c.topic))];
  }, []);

  const handleStart = async () => {
    setIsCreating(true);
    try {
      const config = {
        questionCount,
        mode: selectedTopic ? 'TOPIC_PRACTICE' : 'QUICK_PRACTICE' as any,
        topic: selectedTopic || undefined,
        difficulty: (selectedDifficulty || undefined) as any,
        timeLimitSeconds: timeLimit > 0 ? timeLimit * 60 : undefined,
        shuffleQuestions: true,
        shuffleChoices: true,
        hintAvailability: true,
        explanationAvailability: true,
        immediateFeedback,
      };

      const session = await sessionService.createSession('student-1', config);
      router.push(`/student/practice/${session.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight">Practice Arena</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Asah kemampuan matematikamu dengan latihan yang interaktif dan adaptif.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Configurations Panel */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold font-heading">Lengkapi Pengaturan Latihan</CardTitle>
              <CardDescription className="text-xs">Atur parameter sesuai kebutuhan belajarmu hari ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Question Count */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Jumlah Soal</label>
                <div className="flex gap-2">
                  {[3, 5, 10, 15].map((c) => (
                    <button
                      key={c}
                      onClick={() => setQuestionCount(c)}
                      className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all ${
                        questionCount === c
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      {c} Soal
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Select */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Topik Materi</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTopic('')}
                    className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all ${
                      selectedTopic === ''
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    Semua Topik
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all ${
                        selectedTopic === t
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Select */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Tingkat Kesulitan</label>
                <div className="flex gap-2">
                  {['', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDifficulty(d)}
                      className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all uppercase ${
                        selectedDifficulty === d
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      {d || 'Semua'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Settings */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Durasi Waktu</label>
                <div className="flex gap-2">
                  {[0, 5, 10, 20].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeLimit(t)}
                      className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all ${
                        timeLimit === t
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      {t === 0 ? 'Tanpa Waktu' : `${t} Menit`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Mode */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Mode Penilaian</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImmediateFeedback(true)}
                    className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all ${
                      immediateFeedback
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    Feedback Instan (Belajar)
                  </button>
                  <button
                    onClick={() => setImmediateFeedback(false)}
                    className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all ${
                      !immediateFeedback
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    Kumpulkan Akhir (Simulasi Ujian)
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start / Side panel */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-neutral-900 text-white shadow-sm p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">MathOSN Coach LPE</span>
              <h3 className="text-base font-bold font-heading">Siap Mulai Latihan?</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Platform latihan kami mengutamakan proses pemahaman konsep. Gunakan Petunjuk Socratic jika menemui kesulitan.
              </p>
            </div>
            
            <div className="pt-2 border-t border-neutral-800 space-y-2 text-[11px] text-neutral-400">
              <div className="flex items-center justify-between">
                <span>Total Soal:</span>
                <span className="font-bold text-white">{questionCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Waktu Pengerjaan:</span>
                <span className="font-bold text-white">{timeLimit > 0 ? `${timeLimit} menit` : 'Tak Terbatas'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Materi:</span>
                <span className="font-bold text-white">{selectedTopic || 'Campuran'}</span>
              </div>
            </div>

            <Button
              onClick={handleStart}
              disabled={isCreating}
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold gap-2 transition-all"
            >
              {isCreating ? 'Membuat Sesi...' : <><Play className="h-4 w-4 fill-current" /> Mulai Sekarang</>}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
