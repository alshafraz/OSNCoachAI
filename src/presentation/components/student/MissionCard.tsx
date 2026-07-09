'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Star } from 'lucide-react';

interface MissionItem {
  text: string;
  isCompleted: boolean;
}

export function MissionCard() {
  const [missions, setMissions] = React.useState<MissionItem[]>([
    { text: 'Solve 10 Questions', isCompleted: true },
    { text: 'Earn 100 XP', isCompleted: true },
    { text: 'Practice Geometry', isCompleted: false },
    { text: 'Finish in under 30 minutes', isCompleted: false },
  ]);

  const toggleMission = (index: number) => {
    const updated = [...missions];
    updated[index].isCompleted = !updated[index].isCompleted;
    setMissions(updated);
  };

  const completedCount = missions.filter(m => m.isCompleted).length;
  const progressPct = Math.round((completedCount / missions.length) * 100);

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500 animate-spin-slow" />
          Today's Mission
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="space-y-3">
          {missions.map((m, idx) => (
            <div
              key={idx}
              onClick={() => toggleMission(idx)}
              className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 rounded-2xl cursor-pointer transition-all active:scale-[0.99]"
            >
              {m.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 animate-in zoom-in duration-100" />
              ) : (
                <Circle className="h-5 w-5 text-neutral-300 hover:text-indigo-500 shrink-0" />
              )}
              <span className={`text-xs font-semibold text-neutral-700 dark:text-neutral-300 ${m.isCompleted ? 'line-through text-neutral-400 dark:text-neutral-500' : ''}`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-neutral-500">
            <span>Progress Completed</span>
            <span className="text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2 bg-neutral-100 dark:bg-neutral-950" />
        </div>
      </CardContent>
    </Card>
  );
}
