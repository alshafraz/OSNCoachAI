'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface TopicData {
  topic: string;
  count: number;
  color: string;
}

export function TopicDonutChart() {
  const data: TopicData[] = [
    { topic: 'Number Theory', count: 15, color: '#4f46e5' },
    { topic: 'Geometry', count: 10, color: '#10b981' },
    { topic: 'Combinatorics', count: 5, color: '#8b5cf6' },
  ];

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 14;

  let accumulatedOffset = 0;

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold font-heading">Question Bank Topics</CardTitle>
        <CardDescription className="text-xs text-neutral-400">Distribution of active Olympiad questions.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6 flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="relative w-[130px] h-[130px] shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = item.count / total;
              const strokeLength = percentage * circumference;
              const strokeOffset = circumference - strokeLength + accumulatedOffset;
              accumulatedOffset -= strokeLength;

              return (
                <circle
                  key={index}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold font-heading text-neutral-800 dark:text-neutral-100">{total}</span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total</span>
          </div>
        </div>

        <div className="space-y-2.5 w-full">
          {data.map((item, index) => {
            const percentage = Math.round((item.count / total) * 100);
            return (
              <div key={index} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-neutral-600 dark:text-neutral-300">{item.topic}</span>
                </div>
                <div className="text-neutral-400">
                  <span className="text-neutral-700 dark:text-neutral-200 font-bold mr-1">{item.count}</span>
                  ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
