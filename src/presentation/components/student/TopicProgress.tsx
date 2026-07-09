'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface TopicItem {
  name: string;
  progress: number;
  accuracy: number;
  solved: number;
  lastPractice: string;
  status: 'Weak' | 'Normal' | 'Strong';
}

export function TopicProgress() {
  const topics: TopicItem[] = [
    {
      name: 'Number System',
      progress: 75,
      accuracy: 88,
      solved: 34,
      lastPractice: '2 hours ago',
      status: 'Strong',
    },
    {
      name: 'Algebra',
      progress: 45,
      accuracy: 62,
      solved: 18,
      lastPractice: 'Yesterday',
      status: 'Normal',
    },
    {
      name: 'Geometry',
      progress: 25,
      accuracy: 45,
      solved: 12,
      lastPractice: '3 days ago',
      status: 'Weak',
    },
    {
      name: 'Combinatorics',
      progress: 60,
      accuracy: 82,
      solved: 25,
      lastPractice: 'Last week',
      status: 'Strong',
    },
    {
      name: 'Logic',
      progress: 30,
      accuracy: 58,
      solved: 8,
      lastPractice: '2 weeks ago',
      status: 'Normal',
    },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-255">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          Learning Progress by Topic
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {topics.map((t, idx) => (
          <div key={idx} className="space-y-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-none last:pb-0 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{t.name}</span>
                <Badge className={`border-none rounded-full text-[9px] font-bold px-2 py-0.5 ${
                  t.status === 'Strong'
                    ? 'bg-emerald-100 text-emerald-700'
                    : t.status === 'Normal'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {t.status}
                </Badge>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold">Solved: {t.solved} • Acc: {t.accuracy}%</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={t.progress} className="h-1.5 bg-neutral-100 dark:bg-neutral-950" />
              </div>
              <span className="text-[10px] font-semibold text-neutral-400 w-16 text-right shrink-0">{t.lastPractice}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
