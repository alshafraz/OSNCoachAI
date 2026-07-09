import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/auth';
import { Camera, Mail, Shield, Award, Timer, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function StudentProfilePage() {
  const session = await auth();
  const studentName = session?.user?.name || 'Al';
  const email = session?.user?.email || 'student@mathosn.com';

  const stats = {
    grade: 'Grade 5',
    age: 10,
    level: 'Silver Explorer',
    levelNum: 5,
    xp: 2350,
    totalQuestions: 112,
    accuracy: '78.5%',
    studyTime: '240 mins',
    favoriteTopic: 'Number System',
    weakestTopic: 'Geometry',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/student">
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Student Profile</h1>
          <p className="text-neutral-500 text-sm">View your personal achievements, stats, and metadata.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm text-center p-6 space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-3xl font-bold font-heading border-4 border-white dark:border-neutral-950 shadow-md">
              {studentName.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border-2 border-white dark:border-neutral-900 cursor-pointer transition-transform hover:scale-105 active:scale-95">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold font-heading text-neutral-800 dark:text-neutral-200">{studentName}</h3>
            <Badge className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-none rounded-full px-3 py-1 font-bold text-xs uppercase tracking-wide">
              {stats.level} (Level {stats.levelNum})
            </Badge>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5 text-xs text-neutral-500 font-semibold text-left">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-400" />
              <span>{stats.grade} • {stats.age} Years Old</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-neutral-400" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-neutral-400" />
              <span>Student Account</span>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
              <Award className="h-5 w-5" />
              <h4 className="font-extrabold text-sm">Experience Metrics</h4>
            </div>
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between font-bold border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <span className="text-neutral-400">Total Experience</span>
                <span>{stats.xp} XP</span>
              </div>
              <div className="flex justify-between font-bold border-b border-neutral-100 dark:border-neutral-800 py-2">
                <span className="text-neutral-400">Questions Solved</span>
                <span>{stats.totalQuestions} Solves</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span className="text-neutral-400">Average Accuracy</span>
                <span className="text-emerald-600">{stats.accuracy}</span>
              </div>
            </div>
          </Card>

          <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
              <Timer className="h-5 w-5" />
              <h4 className="font-extrabold text-sm">Performance Analysis</h4>
            </div>
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between font-bold border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <span className="text-neutral-400">Practice Time</span>
                <span>{stats.studyTime}</span>
              </div>
              <div className="flex justify-between font-bold border-b border-neutral-100 dark:border-neutral-800 py-2">
                <span className="text-neutral-400">Favorite Topic</span>
                <span className="text-indigo-600 dark:text-indigo-400">{stats.favoriteTopic}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span className="text-neutral-400">Weakest Topic</span>
                <span className="text-rose-600">{stats.weakestTopic}</span>
              </div>
            </div>
          </Card>

          <Card className="sm:col-span-2 border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-5 space-y-3 text-xs sm:text-sm">
            <h4 className="font-extrabold">Next Learning Milestones</h4>
            <p className="text-neutral-400 text-xs">Complete your roadmap to unlock level 6 badge.</p>
            <div className="flex flex-wrap gap-2 pt-1.5">
              <Link href="/student/practice">
                <Button className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer h-9 text-xs">
                  Continue Learning
                </Button>
              </Link>
              <Link href="/student/achievements">
                <Button variant="outline" className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 h-9 text-xs">
                  View Medals
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
