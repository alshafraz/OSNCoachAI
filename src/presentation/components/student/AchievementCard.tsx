'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AchievementProps {
  title: string;
  description: string;
  category: string;
  xpReward: number;
  unlockedAt: string | null;
  isLocked: boolean;
}

export function AchievementCard({
  title,
  description,
  category,
  xpReward,
  unlockedAt,
  isLocked,
}: AchievementProps) {
  return (
    <Card className={`border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden transition-all duration-200 ${
      isLocked ? 'opacity-55 dark:opacity-40 select-none grayscale' : 'hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
    }`}>
      <CardContent className="p-5 flex items-start gap-4 text-xs sm:text-sm">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
          isLocked
            ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-850 dark:text-neutral-600'
            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
        }`}>
          {isLocked ? <Lock className="h-5 w-5" /> : <Award className="h-6 w-6 animate-in zoom-in duration-200" />}
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-extrabold text-neutral-800 dark:text-neutral-200 truncate">{title}</h4>
            <Badge className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-none rounded-full px-2 py-0.5 text-[9px] shrink-0 font-extrabold uppercase">
              +{xpReward} XP
            </Badge>
          </div>
          <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">{description}</p>
          <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold">
            <span className="text-neutral-400 uppercase tracking-wider">{category}</span>
            <span className="text-neutral-300">•</span>
            {isLocked ? (
              <span className="text-amber-600 dark:text-amber-500 uppercase tracking-wider">Locked</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">Unlocked: {unlockedAt}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
