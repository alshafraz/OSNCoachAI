'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, BookOpen, Award, CheckCircle2, Flame, Compass } from 'lucide-react';

interface ActivityItem {
  title: string;
  description: string;
  time: string;
  type: 'quiz' | 'badge' | 'exam' | 'level' | 'practice';
}

const icons = {
  quiz: Compass,
  badge: Award,
  exam: BookOpen,
  level: Flame,
  practice: CheckCircle2,
};

const colors = {
  quiz: 'bg-indigo-500/10 text-indigo-600',
  badge: 'bg-amber-500/10 text-amber-600',
  exam: 'bg-violet-500/10 text-violet-600',
  level: 'bg-rose-500/10 text-rose-600',
  practice: 'bg-emerald-500/10 text-emerald-600',
};

export function RecentActivity() {
  const activities: ActivityItem[] = [
    { title: 'Solved Geometry Quiz', description: 'Got 4 out of 5 questions correct', time: '10 mins ago', type: 'quiz' },
    { title: 'Earned Bronze Badge', description: 'Unlocked: "Fast Learner" medal', time: '2 hours ago', type: 'badge' },
    { title: 'Completed Mock Exam', description: 'Scored 85% on Algebra Mock 1', time: 'Yesterday', type: 'exam' },
    { title: 'Reached Level 5', description: 'Gained +100 bonus XP points', time: '3 days ago', type: 'level' },
    { title: 'Practice Session Finished', description: 'Spent 25 minutes on Number Systems', time: '4 days ago', type: 'practice' },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between flex-row">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600 animate-spin-slow" />
          Recent Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {activities.length > 0 ? (
          <div className="relative border-l border-neutral-100 dark:border-neutral-800 pl-6 ml-3 space-y-5 text-xs sm:text-sm font-semibold">
            {activities.map((act, idx) => {
              const Icon = icons[act.type];
              return (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[37px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 ${colors[act.type]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-neutral-800 dark:text-neutral-250 font-bold">{act.title}</span>
                      <span className="text-[10px] text-neutral-400 font-semibold shrink-0">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-450 font-semibold">{act.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-400 italic">No recent activities found.</div>
        )}
      </CardContent>
    </Card>
  );
}
