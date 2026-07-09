'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudentHeaderProps {
  name: string;
  level: string;
  levelNum: number;
  streak: number;
  xp: number;
  todayGoal: string;
  todaySolvedCount: number;
}

export function StudentHeader({
  name,
  level,
  levelNum,
  streak,
  xp,
  todayGoal,
  todaySolvedCount,
}: StudentHeaderProps) {
  const xpInCurrentLevel = xp % 1000;
  const xpProgressPct = (xpInCurrentLevel / 1000) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white p-8 sm:p-10 shadow-lg shadow-indigo-500/20 animate-in fade-in slide-in-from-top duration-300">
      <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white/20 hover:bg-white/25 text-white border-none rounded-full px-3 py-1 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-sm">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              Level {levelNum}: {level}
            </Badge>
            <Badge className="bg-amber-400 text-indigo-950 border-none rounded-full px-3 py-1 font-extrabold text-xs uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <Flame className="h-3.5 w-3.5 text-red-600 fill-red-600 animate-pulse" />
              {streak} Day Streak
            </Badge>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
              Good day, {name}! 👋
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-lg">
              Ready to continue your Math Olympiad journey? Keep practicing and unlock new achievements!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-60 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-indigo-200">
                <span>XP Level Progress</span>
                <span>{xpInCurrentLevel} / 1000 XP</span>
              </div>
              <Progress value={xpProgressPct} className="h-2 bg-indigo-950/40" />
            </div>
            <div className="text-xs font-bold bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 shrink-0">
              Total XP: {xp.toLocaleString()}
            </div>
          </div>
        </div>

        <Card className="bg-white/10 border border-white/15 rounded-2xl shadow-inner text-white">
          <CardContent className="p-5 space-y-4">
            <span className="text-[10px] text-indigo-200 uppercase font-extrabold tracking-widest block">Daily Quest</span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold leading-none">{todayGoal}</h4>
              <p className="text-[11px] text-indigo-200">Solve problems to complete today's mission</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-indigo-200">
                <span>Completed</span>
                <span>{todaySolvedCount} / 20 Solves</span>
              </div>
              <Progress value={Math.min((todaySolvedCount / 20) * 100, 100)} className="h-2 bg-indigo-950/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 skew-x-12 -z-1" />
      <div className="absolute left-10 -bottom-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
    </div>
  );
}
