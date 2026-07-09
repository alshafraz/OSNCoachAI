'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function StrongTopicCard() {
  const strongTopics = [
    { name: 'Number System', accuracy: 88, solved: 34 },
    { name: 'Combinatorics', accuracy: 82, solved: 25 },
    { name: 'Algebra', accuracy: 78, solved: 20 },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between flex-row">
        <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Strong Topics
        </CardTitle>
        <Badge className="bg-emerald-100 text-emerald-700 font-bold border-none rounded-full px-2.5 py-0.5 text-[10px]">
          Proficient
        </Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-4 text-xs sm:text-sm">
        {strongTopics.map((topic, idx) => (
          <div key={idx} className="space-y-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-none last:pb-0">
            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-800 dark:text-neutral-200">{topic.name}</span>
              <span className="text-[10px] text-neutral-400 font-bold">Solved: {topic.solved}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={topic.accuracy} className="h-1.5 bg-neutral-100 dark:bg-neutral-950" />
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-xs">{topic.accuracy}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
