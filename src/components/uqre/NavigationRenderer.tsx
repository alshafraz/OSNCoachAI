'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  markedIndices?: number[];
  answeredIndices?: number[];
  onNavigate: (index: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentIndex,
  totalQuestions,
  markedIndices = [],
  answeredIndices = [],
  onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-between py-3 border-t border-neutral-100 dark:border-neutral-850 md:flex-row">
      {/* Question Counter/Dots */}
      <div className="flex flex-wrap items-center gap-1.5 justify-center">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answeredIndices.includes(idx);
          const isMarked = markedIndices.includes(idx);

          let itemClass = 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-850';
          if (isAnswered) {
            itemClass = 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200';
          }
          if (isMarked) {
            itemClass = 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900 text-amber-700 dark:text-amber-300';
          }
          if (isCurrent) {
            itemClass = 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700';
          }

          return (
            <button
              key={`nav-dot-${idx}`}
              onClick={() => onNavigate(idx)}
              className={`h-7 w-7 rounded-lg text-[10px] font-extrabold flex items-center justify-center border transition-all ${itemClass}`}
              aria-label={`Go to question ${idx + 1}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Prev/Next buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIndex === 0}
          onClick={() => onNavigate(currentIndex - 1)}
          className="rounded-xl h-8 px-3 font-semibold text-xs gap-1 border-neutral-200 dark:border-neutral-800"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={currentIndex === totalQuestions - 1}
          onClick={() => onNavigate(currentIndex + 1)}
          className="rounded-xl h-8 px-3 font-semibold text-xs gap-1 border-neutral-200 dark:border-neutral-800"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
