'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function WeakTopicCard() {
  const weakTopics = [
    { name: 'Geometry', accuracy: 45, review: 'Review triangle inequality & areas.' },
    { name: 'Logic', accuracy: 58, review: 'Practice truth tables & grid deductions.' },
    { name: 'Algebra', accuracy: 62, review: 'Revise linear equations and sequences.' },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between flex-row">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          Weak Topics
        </CardTitle>
        <Badge className="bg-rose-100 text-rose-700 font-bold border-none rounded-full px-2.5 py-0.5 text-[10px]">
          Needs Review
        </Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-4 text-xs sm:text-sm">
        {weakTopics.map((topic, idx) => (
          <div key={idx} className="space-y-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-none last:pb-0">
            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-800 dark:text-neutral-200">{topic.name}</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{topic.accuracy}% Accuracy</span>
            </div>
            <Progress value={topic.accuracy} className="h-1.5 bg-neutral-100 dark:bg-neutral-950" />
            <p className="text-[10px] text-neutral-400 font-semibold italic">{topic.review}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
