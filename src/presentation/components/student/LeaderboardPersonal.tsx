'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, Compass, Sparkles, Timer, Zap } from 'lucide-react';

export function LeaderboardPersonal() {
  const stats = [
    { label: 'Personal Best (Daily XP)', value: '350 XP', icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Previous Week XP', value: '1,450 XP', icon: Award, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Current Week XP', value: '820 XP', icon: Sparkles, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Best Accuracy Rate', value: '94%', icon: Compass, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Fastest Solve Time', value: '14.5s', icon: Timer, color: 'text-rose-500 bg-rose-500/10' },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500 animate-bounce" />
          Personal Records & Bests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-none last:pb-0 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-neutral-500 dark:text-neutral-450">{s.label}</span>
              </div>
              <span className="font-extrabold text-neutral-800 dark:text-neutral-250 text-right">{s.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
