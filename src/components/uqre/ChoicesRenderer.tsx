'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { MathExpression } from './MathRenderer';
import type { UqreChoice } from './dto/QuestionDto';

interface ChoicesRendererProps {
  choices: UqreChoice[];
  selectedId?: string;
  correctAnswerId?: string; // Visible only in review mode
  revealSolution?: boolean; // Toggles whether correct/incorrect indicators display
  disabled?: boolean;
  onSelect: (choiceId: string) => void;
}

export const ChoicesRenderer: React.FC<ChoicesRendererProps> = ({
  choices,
  selectedId,
  correctAnswerId,
  revealSolution = false,
  disabled = false,
  onSelect,
}) => {
  // Automatically choose grid layout layout direction: single column for long text, two columns for short choices
  const isAllShort = React.useMemo(() => {
    return choices.every((c) => c.text.length < 10);
  }, [choices]);

  const gridClass = isAllShort && choices.length <= 4
    ? 'grid grid-cols-2 gap-3'
    : 'grid grid-cols-1 gap-2.5';

  return (
    <div className={gridClass} role="radiogroup" aria-label="Question choices">
      {choices.map((choice) => {
        const isSelected = selectedId === choice.id;
        const isCorrectChoice = correctAnswerId === choice.id;
        
        // Color states:
        // REVIEW/SOLUTION MODES:
        // - Green if correct
        // - Red if selected and incorrect
        // - Default styling otherwise
        let borderClass = 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-700 bg-white dark:bg-neutral-900/60';
        let badgeClass = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300';
        let IndicatorIcon = null;

        if (revealSolution) {
          if (isCorrectChoice) {
            borderClass = 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300';
            badgeClass = 'bg-emerald-500 text-white';
            IndicatorIcon = Check;
          } else if (isSelected) {
            borderClass = 'border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-900 dark:text-red-300';
            badgeClass = 'bg-red-500 text-white';
            IndicatorIcon = X;
          }
        } else if (isSelected) {
          borderClass = 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/15 text-indigo-900 dark:text-indigo-200';
          badgeClass = 'bg-indigo-600 text-white';
        }

        if (disabled) {
          borderClass = 'opacity-65 cursor-not-allowed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30';
        }

        return (
          <motion.button
            key={choice.id}
            whileTap={disabled ? {} : { scale: 0.985 }}
            onClick={() => {
              if (!disabled) onSelect(choice.id);
            }}
            disabled={disabled}
            className={`flex items-center justify-between p-3.5 w-full text-left rounded-2xl border transition-all text-xs outline-none focus:ring-2 focus:ring-indigo-500/25 ${borderClass}`}
            role="radio"
            aria-checked={isSelected}
          >
            <div className="flex items-center gap-3 pr-2">
              {/* Option label indicator (e.g. A, B, C...) */}
              <span className={`h-6 w-6 rounded-xl flex items-center justify-center text-[11px] font-extrabold font-heading shrink-0 ${badgeClass}`}>
                {choice.id}
              </span>
              <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                <MathExpression text={choice.text} />
              </div>
            </div>
            {IndicatorIcon && (
              <span className="shrink-0 pl-2">
                <IndicatorIcon className={`h-4 w-4 ${isCorrectChoice ? 'text-emerald-600 dark:text-emerald-450' : 'text-red-600 dark:text-red-450'}`} />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
