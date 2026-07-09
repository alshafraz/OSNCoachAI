import * as React from 'react';
import { getStudentDashboardUseCase } from '@/infrastructure/config/container';
import { auth } from '@/auth';
import { StudentHeader } from '@/presentation/components/student/StudentHeader';
import { MotivationCard } from '@/presentation/components/student/MotivationCard';
import { QuickActionCard } from '@/presentation/components/student/QuickActionCard';
import { MissionCard } from '@/presentation/components/student/MissionCard';
import { TopicProgress } from '@/presentation/components/student/TopicProgress';
import { StreakCard } from '@/presentation/components/student/StreakCard';
import { WeakTopicCard } from '@/presentation/components/student/WeakTopicCard';
import { StrongTopicCard } from '@/presentation/components/student/StrongTopicCard';
import { RecentActivity } from '@/presentation/components/student/RecentActivity';
import { LeaderboardPersonal } from '@/presentation/components/student/LeaderboardPersonal';

export default async function StudentDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id || 'student-user-id';

  let profile = {
    points: 2350,
    level: 5,
    currentStreak: 18,
  };

  try {
    const result = await getStudentDashboardUseCase.execute(userId);
    if (result && result.profile) {
      profile = {
        points: result.profile.points || 2350,
        level: result.profile.level || 5,
        currentStreak: result.profile.currentStreak || 18,
      };
    }
  } catch (error) {
    // Database connection issues
  }

  const studentName = session?.user?.name || 'Al';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <StudentHeader
        name={studentName}
        level="Silver Explorer"
        levelNum={profile.level}
        streak={profile.currentStreak}
        xp={profile.points}
        todayGoal="Solve 20 Questions"
        todaySolvedCount={12}
      />

      <MotivationCard />

      <div className="space-y-3">
        <h2 className="text-lg font-bold font-heading text-neutral-800 dark:text-neutral-200">Quick Actions</h2>
        <QuickActionCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MissionCard />
          <TopicProgress />
          <RecentActivity />
        </div>

        <div className="space-y-6">
          <StreakCard />
          <WeakTopicCard />
          <StrongTopicCard />
          <LeaderboardPersonal />
        </div>
      </div>
    </div>
  );
}
