'use client';

import * as React from 'react';
import { AlertCircle, HelpCircle, FileQuestion, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────

export const QuestionSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-xl mx-auto p-6 border border-neutral-100 dark:border-neutral-850 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-850">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-28" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-16" />
      </div>

      {/* Body lines */}
      <div className="space-y-2.5">
        <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-full" />
        <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-[92%]" />
        <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-3/4" />
      </div>

      {/* Image box placeholder (middle sizes) */}
      <div className="h-36 bg-neutral-100 dark:bg-neutral-850 rounded-2xl w-full" />

      {/* Choices Skeleton */}
      <div className="space-y-2.5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`choice-sk-${idx}`}
            className="h-10 border border-neutral-150 dark:border-neutral-850 rounded-2xl w-full"
          />
        ))}
      </div>
    </div>
  );
};

// ─── ERROR FALLBACK ──────────────────────────────────────────────────────────

interface QuestionErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const QuestionErrorState: React.FC<QuestionErrorStateProps> = ({
  message = 'Gagal memuat pertanyaan.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-neutral-50/40 dark:bg-neutral-900/30 max-w-md mx-auto my-6">
      <div className="h-11 w-11 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center text-red-600 mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Error Rendering</h3>
      <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-normal">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 rounded-xl text-xs gap-1.5 border-neutral-200 dark:border-neutral-800 font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Muat Ulang
        </Button>
      )}
    </div>
  );
};

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

interface QuestionEmptyStateProps {
  message?: string;
}

export const QuestionEmptyState: React.FC<QuestionEmptyStateProps> = ({
  message = 'Pertanyaan tidak ditemukan atau telah dihapus.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-neutral-50/40 dark:bg-neutral-900/30 max-w-md mx-auto my-6">
      <div className="h-11 w-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 mb-3">
        <FileQuestion className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-350">Tidak Ada Pertanyaan</h3>
      <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-normal">{message}</p>
    </div>
  );
};
