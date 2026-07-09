'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Compass, Award, ShieldAlert, Trophy, ClipboardList, Sparkles } from 'lucide-react';

interface ActionItem {
  title: string;
  description: string;
  href: string;
  iconName: 'continue' | 'topics' | 'challenge' | 'mock' | 'mistakes' | 'achievements';
  color: string;
}

const icons = {
  continue: BookOpen,
  topics: Compass,
  challenge: Sparkles,
  mock: ClipboardList,
  mistakes: ShieldAlert,
  achievements: Trophy,
};

export function QuickActionCard() {
  const items: ActionItem[] = [
    {
      title: 'Continue Learning',
      description: 'Resume your active curriculum roadmap.',
      href: '/student/practice',
      iconName: 'continue',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500',
    },
    {
      title: 'Practice by Topic',
      description: 'Target specific Olympiad study areas.',
      href: '/student/practice?tab=topics',
      iconName: 'topics',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500',
    },
    {
      title: 'Mini Challenge',
      description: 'Quick math puzzle to test your speed.',
      href: '/student/practice?tab=challenge',
      iconName: 'challenge',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:border-amber-500',
    },
    {
      title: 'Mock Exam',
      description: 'Full exam simulations with strict timers.',
      href: '/student/practice?tab=mock',
      iconName: 'mock',
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:border-violet-500',
    },
    {
      title: 'Review Mistakes',
      description: 'Reinforce concepts with your failed answers.',
      href: '/student/history?filter=failed',
      iconName: 'mistakes',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:border-rose-500',
    },
    {
      title: 'My Achievements',
      description: 'View unlocked medals and XP rewards.',
      href: '/student/achievements',
      iconName: 'achievements',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:border-cyan-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, idx) => {
        const Icon = icons[item.iconName];
        return (
          <Link key={idx} href={item.href} className="group">
            <Card className={`border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98] duration-200 ${item.color.split(' ').pop()}`}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${item.color.split(' ')[0]} ${item.color.split(' ')[1]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
