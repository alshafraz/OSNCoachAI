'use client';

import * as React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MathExpression } from './MathRenderer';
import { QuestionImage } from './MediaRenderer';
import { ChoicesRenderer } from './ChoicesRenderer';
import { QuestionErrorState } from './StateRenderers';
import type { QuestionDto, UqreQuestionState } from './dto/QuestionDto';

const DIFFICULTY_BADGES = {
  EASY: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200/50',
  MEDIUM: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300 border-amber-200/50',
  HARD: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-300 border-rose-200/50',
  OLYMPIAD: 'bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-300 border-violet-200/50',
  EXPERT: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300 border-indigo-200/50',
};

interface QuestionRendererProps {
  question: QuestionDto;
  state: UqreQuestionState;
  onChoiceSelect?: (choiceId: string) => void;
  onAnswerSubmit?: (value: string) => void;
  onToggleMark?: () => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  state,
  onChoiceSelect,
  onAnswerSubmit,
  onToggleMark,
}) => {
  const [showHint, setShowHint] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [answerInput, setAnswerInput] = React.useState(state.studentAnswerValue || '');

  // Keep answer input synchronized with state changes
  React.useEffect(() => {
    setAnswerInput(state.studentAnswerValue || '');
  }, [state.studentAnswerValue]);

  // Layout logic: if has image, use a side-by-side or stacked grid depending on width
  const hasImage = question.media && question.media.length > 0;
  const containerClass = hasImage
    ? 'grid lg:grid-cols-12 gap-6 items-start'
    : 'space-y-6';

  const bodyClass = hasImage ? 'lg:col-span-7 space-y-5' : 'space-y-5';
  const mediaColClass = hasImage ? 'lg:col-span-5 space-y-4' : 'hidden';

  // Format validations
  const isMcq = question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE';
  const isShortAnswer = question.type === 'SHORT_ANSWER' || question.type === 'FILL_IN_BLANK';

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAnswerSubmit && answerInput.trim() && !state.isDisabled) {
      onAnswerSubmit(answerInput.trim());
    }
  };

  return (
    <article 
      className={`w-full max-w-4xl mx-auto p-5 md:p-6 border border-neutral-100 dark:border-neutral-850 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 ${
        state.isMarkedForReview ? 'ring-2 ring-amber-400/50 bg-amber-500/[0.01]' : ''
      }`}
      aria-label={`Pertanyaan ${question.sequenceNumber || ''}`}
    >
      {/* ── QUESTION HEADER ─────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-850 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-neutral-450 uppercase tracking-wider font-heading">
            Soal {question.sequenceNumber ? `#${question.sequenceNumber}` : ''}
          </span>
          {question.metadata?.difficulty && (
            <Badge variant="outline" className={`text-[9px] px-2 py-0.5 rounded-full font-bold border-none uppercase ${
              DIFFICULTY_BADGES[question.metadata.difficulty]
            }`}>
              {question.metadata.difficulty}
            </Badge>
          )}
        </div>
        
        {onToggleMark && (
          <button
            onClick={onToggleMark}
            className={`p-1.5 rounded-xl border transition-all ${
              state.isMarkedForReview
                ? 'bg-amber-100/50 text-amber-600 border-amber-250 dark:bg-amber-950/20'
                : 'text-neutral-400 border-neutral-200 hover:border-amber-300 hover:text-amber-500 dark:border-neutral-800'
            }`}
            aria-label="Mark for review"
          >
            <Bookmark className={`h-4 w-4 ${state.isMarkedForReview ? 'fill-current' : ''}`} />
          </button>
        )}
      </header>

      {/* ── INTERACTION GRID (LAYOUT ENGINE) ─────────────────────────────────── */}
      <div className={containerClass}>
        {/* Left/Main Column: Title, Question text, and Interactive input */}
        <section className={bodyClass}>
          {question.title && (
            <h2 className="text-sm font-heading font-extrabold text-neutral-800 dark:text-neutral-200">
              {question.title}
            </h2>
          )}

          {/* Question Text with inline/block LaTeX formatting */}
          <div className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed space-y-3">
            <MathExpression text={question.body} />
          </div>

          {/* ── MULTIPLE CHOICE RENDERER ──────────────────────────────────────── */}
          {isMcq && question.choices && (
            <div className="pt-2">
              <ChoicesRenderer
                choices={question.choices}
                selectedId={state.selectedChoiceId}
                correctAnswerId={question.correctAnswer}
                revealSolution={state.revealSolution}
                disabled={state.isDisabled || state.isLocked}
                onSelect={(id) => onChoiceSelect?.(id)}
              />
            </div>
          )}

          {/* ── SHORT ANSWER RENDERER ─────────────────────────────────────────── */}
          {isShortAnswer && (
            <form onSubmit={handleTextSubmit} className="pt-2 flex flex-col gap-2 max-w-sm">
              <label htmlFor={`ans-input-${question.id}`} className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Jawaban Kamu
              </label>
              <div className="flex gap-2.5">
                <input
                  id={`ans-input-${question.id}`}
                  type="text"
                  value={answerInput}
                  disabled={state.isDisabled || state.isLocked || state.revealSolution}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Ketik jawaban..."
                  className="h-9 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-60 w-full"
                />
                {onAnswerSubmit && !state.revealSolution && (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={state.isDisabled || state.isLocked || !answerInput.trim()}
                    className="h-9 rounded-xl bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 text-white font-bold px-4"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Post-submission correct/incorrect banners */}
          {state.revealSolution && state.isAnswered && (
            <div className={`p-3 rounded-2xl border text-xs font-bold ${
              state.isCorrect
                ? 'bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-500/[0.03] border-rose-500/20 text-rose-700 dark:text-rose-400'
            }`}>
              {state.isCorrect ? '✓ Jawaban Benar!' : `✗ Jawaban Salah. Kunci: ${question.correctAnswer || '-'}`}
            </div>
          )}
        </section>

        {/* Right Column: Images, Charts, Diagrams (if present) */}
        {hasImage && (
          <aside className={mediaColClass}>
            {question.media!.map((med) => (
              <QuestionImage
                key={med.id}
                url={med.url}
                altText={med.altText}
                caption={med.caption}
                width={med.width}
                height={med.height}
              />
            ))}
          </aside>
        )}
      </div>

      {/* ── QUESTION FOOTER (HINTS & EXPLANATIONS) ─────────────────────────── */}
      <footer className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-850 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Hint button */}
          {question.hint && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="h-8 px-3 text-xs gap-1.5 rounded-xl border-neutral-200 dark:border-neutral-800 font-semibold"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              {showHint ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk'}
            </Button>
          )}

          {/* Solution Explanation button (visible in review or when solution revealed) */}
          {question.explanation && (state.revealSolution || state.isCorrect !== undefined) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="h-8 px-3 text-xs gap-1.5 rounded-xl border-neutral-200 dark:border-neutral-800 font-semibold"
            >
              <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
              {showExplanation ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan'}
            </Button>
          )}
        </div>

        {/* Hint text card */}
        {showHint && question.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-500/[0.02] border border-amber-300/25 text-xs text-neutral-650 dark:text-neutral-350 leading-relaxed">
            <h4 className="font-extrabold font-heading text-amber-600 mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
              <Lightbulb className="h-3.5 w-3.5" /> Petunjuk Soal
            </h4>
            <MathExpression text={question.hint} />
          </div>
        )}

        {/* Explanation text card */}
        {showExplanation && question.explanation && (
          <div className="p-3.5 rounded-2xl bg-indigo-500/[0.02] border border-indigo-300/25 text-xs text-neutral-650 dark:text-neutral-350 leading-relaxed">
            <h4 className="font-extrabold font-heading text-indigo-600 mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> Pembahasan Detail
            </h4>
            <MathExpression text={question.explanation} />
          </div>
        )}
      </footer>
    </article>
  );
};
