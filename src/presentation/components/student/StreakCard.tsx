'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flame, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DayItem {
  label: string;
  isCompleted: boolean;
  isToday: boolean;
}

export function StreakCard() {
  const currentStreak = 18;
  const longestStreak = 24;

  const weekDays: DayItem[] = [
    { label: 'S', isCompleted: true, isToday: false },
    { label: 'M', isCompleted: true, isToday: false },
    { label: 'T', isCompleted: true, isToday: false },
    { label: 'W', isCompleted: true, isToday: true },
    { label: 'T', isCompleted: false, isToday: false },
    { label: 'F', isCompleted: false, isToday: false },
    { label: 'S', isCompleted: false, isToday: false },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
          Streak Calendar
        </CardTitle>
        <Badge className="bg-amber-400 hover:bg-amber-400 text-indigo-950 font-bold border-none rounded-full px-2.5 py-0.5 text-[10px]">
          {currentStreak} Days Current
        </Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block">Current Streak</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-heading text-neutral-800 dark:text-neutral-200">{currentStreak}</span>
              <span className="text-xs font-semibold text-neutral-400">days</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide block">Longest Streak</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-heading text-neutral-800 dark:text-neutral-200">{longestStreak}</span>
              <span className="text-xs font-semibold text-neutral-400">days</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest block mb-2">Weekly Activity</span>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-xs transition-all ${
                  day.isCompleted
                    ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold'
                    : day.isToday
                    ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-800 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 font-semibold'
                }`}
              >
                <span>{day.label}</span>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                  day.isCompleted
                    ? 'bg-amber-400 text-indigo-950 font-bold animate-pulse'
                    : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-300 dark:text-neutral-700'
                }`}>
                  {day.isCompleted ? <Flame className="h-4.5 w-4.5 fill-red-500 text-red-500" /> : <Calendar className="h-3 w-3" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
