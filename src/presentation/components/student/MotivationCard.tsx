'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function MotivationCard() {
  const quotes = [
    'Consistency beats intensity.',
    'One question today is better than none.',
    'Olympiad champions practice every day.',
    'Small steps everyday lead to big mathematical leaps.',
    'Mistakes are just proof that you are trying.',
    'Every math problem solved is an exercise for your brain.',
  ];

  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-950/10 dark:to-orange-950/10 p-5 shadow-sm animate-in fade-in duration-200">
      <CardContent className="p-0 flex items-center gap-4 text-xs sm:text-sm">
        <div className="h-10 w-10 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500/30" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-extrabold tracking-widest block">Daily Motivation</span>
          <p className="font-bold text-neutral-700 dark:text-neutral-300 italic">
            "{quote}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
