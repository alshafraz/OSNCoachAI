import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AchievementCard } from '@/presentation/components/student/AchievementCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function StudentAchievementsPage() {
  const achievements = [
    { title: 'First Question', description: 'Solve your first Mathematics Olympiad question.', category: 'GENERAL', xpReward: 50, unlockedAt: '2026-06-15', isLocked: false },
    { title: '7-Day Streak', description: 'Maintain a daily solving streak for 7 consecutive days.', category: 'STREAK', xpReward: 150, unlockedAt: '2026-06-22', isLocked: false },
    { title: '100 Questions', description: 'Correctly solve 100 questions in total.', category: 'MILESTONE', xpReward: 250, unlockedAt: '2026-07-02', isLocked: false },
    { title: '1000 XP Club', description: 'Accumulate a total of 1,000 experience points.', category: 'XP', xpReward: 200, unlockedAt: '2026-06-30', isLocked: false },
    { title: 'Geometry Master', description: 'Earn 80%+ accuracy across 20 Geometry problems.', category: 'TOPIC', xpReward: 300, unlockedAt: null, isLocked: true },
    { title: 'Logic Genius', description: 'Complete a Mini Challenge in under 15 seconds.', category: 'SPEED', xpReward: 300, unlockedAt: null, isLocked: true },
    { title: 'Perfect Score', description: 'Achieve 100% accuracy on a Mock Exam paper.', category: 'ACCURACY', xpReward: 400, unlockedAt: null, isLocked: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/student">
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Achievements & Medals</h1>
          <p className="text-neutral-500 text-sm">Earn medals, unlock special badges, and collect bonus XP.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((ach, idx) => (
          <AchievementCard
            key={idx}
            title={ach.title}
            description={ach.description}
            category={ach.category}
            xpReward={ach.xpReward}
            unlockedAt={ach.unlockedAt}
            isLocked={ach.isLocked}
          />
        ))}
      </div>
    </div>
  );
}
