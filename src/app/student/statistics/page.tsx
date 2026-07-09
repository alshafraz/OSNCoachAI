import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, LineChart, TrendingUp, CheckCircle, Flame, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function StudentStatisticsPage() {
  const stats = [
    { label: 'Overall Accuracy', value: '78%', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Questions Solved', value: '112 Solves', icon: BarChart3, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Practice Time', value: '240 mins', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Average Time', value: '45s / solve', icon: Clock, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Current Streak', value: '18 Days', icon: Flame, color: 'text-rose-500 bg-rose-500/10' },
    { label: 'Longest Streak', value: '24 Days', icon: Calendar, color: 'text-cyan-500 bg-cyan-500/10' },
  ];

  const weeklyData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 10 },
    { day: 'Sat', count: 30 },
    { day: 'Sun', count: 22 },
  ];

  const topicAccuracy = [
    { name: 'Number System', accuracy: 88, color: 'bg-indigo-600' },
    { name: 'Algebra', accuracy: 62, color: 'bg-amber-600' },
    { name: 'Geometry', accuracy: 45, color: 'bg-rose-600' },
    { name: 'Combinatorics', accuracy: 82, color: 'bg-emerald-600' },
    { name: 'Logic', accuracy: 58, color: 'bg-violet-600' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 text-xs sm:text-sm">
      <div className="flex items-center gap-4">
        <Link href="/student">
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Performance Analytics</h1>
          <p className="text-neutral-500 text-sm">Visualize your daily progress, topic strengths, and accuracy rate metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4 text-center">
              <CardContent className="p-0 space-y-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mx-auto ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{s.label}</p>
                  <h4 className="text-sm font-extrabold font-heading text-neutral-800 dark:text-neutral-250">{s.value}</h4>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Weekly Questions Solved
            </CardTitle>
            <CardDescription className="text-xs">Counter of questions solved over the past 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex items-end justify-between h-48 pt-10">
            {weeklyData.map((d, idx) => {
              const heightPct = (d.count / 30) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[9px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">{d.count}</span>
                  <div className="w-6 sm:w-8 bg-indigo-500/10 dark:bg-indigo-950/40 rounded-t-lg h-32 flex items-end overflow-hidden border border-neutral-100 dark:border-neutral-800">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-550 group-hover:scale-y-105 origin-bottom"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500">{d.day}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 pb-4 border-b border-neutral-100 dark:border-neutral-850">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <LineChart className="h-5 w-5 text-emerald-600" />
              Accuracy Percentage by Topic
            </CardTitle>
            <CardDescription className="text-xs">Your correct answer ratio in each mathematical branch.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {topicAccuracy.map((t, idx) => (
              <div key={idx} className="space-y-1.5 font-semibold">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">{t.name}</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{t.accuracy}%</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-950 rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-550 ${
                      t.accuracy >= 80
                        ? 'bg-emerald-500'
                        : t.accuracy >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${t.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
