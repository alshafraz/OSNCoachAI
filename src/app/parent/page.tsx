import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getParentDashboardUseCase } from "@/infrastructure/config/container";
import { auth } from "@/auth";
import { Plus, Users, Brain, BookOpen, LineChart, FileUp } from "lucide-react";
import Link from "next/link";
import { WeeklyActivityChart } from "@/presentation/components/admin/WeeklyActivityChart";
import { TopicDonutChart } from "@/presentation/components/admin/TopicDonutChart";
import { RecentUploadsList } from "@/presentation/components/admin/RecentUploadsList";
import { QuickActionsCard } from "@/presentation/components/admin/QuickActionsCard";

export default async function ParentDashboardPage() {
  const session = await auth();
  const parentId = session?.user?.id || "parent-id";
  
  // Call structural Use Case
  const { students } = await getParentDashboardUseCase.execute(parentId);

  interface StudentDisplay {
    id: string;
    name: string;
    points: number;
    level: number;
    currentStreak: number;
    accuracy: number;
    completedPaths: string;
  }

  const displayStudents: StudentDisplay[] = students.map((s, idx) => ({
    id: s.id,
    name: "Student " + (idx + 1),
    points: s.points,
    level: s.level,
    currentStreak: s.currentStreak,
    accuracy: 75,
    completedPaths: "1/4",
  }));

  if (displayStudents.length === 0) {
    displayStudents.push({
      id: "student-1",
      name: "Toby Mercer",
      points: 120,
      level: 1,
      currentStreak: 3,
      accuracy: 75,
      completedPaths: "1/4",
    });
  }


  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Parent Dashboard</h1>
          <p className="text-neutral-500 text-sm">Monitor your child's learning journey and manage Olympiad questions.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/parent/upload">
            <Button className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
              <FileUp className="h-4 w-4 mr-2" /> Upload PDF OCR
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <Plus className="h-4 w-4 mr-2" /> Link Student
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Students Linked</p>
              <h3 className="text-2xl font-bold font-heading">{displayStudents.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Questions Solved</p>
              <h3 className="text-2xl font-bold font-heading">12</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <LineChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Avg Accuracy</p>
              <h3 className="text-2xl font-bold font-heading">75%</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Modules</p>
              <h3 className="text-2xl font-bold font-heading">Number Theory</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SVG Graphs Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>
        <div>
          <TopicDonutChart />
        </div>
      </div>

      {/* Uploads and Controls */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentUploadsList />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>

      {/* Linked Student Profiles */}
      <div>
        <h2 className="text-xl font-bold mb-4 font-heading">Linked Students</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {displayStudents.map((student) => (
            <Card key={student.id} className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
              <CardHeader className="bg-indigo-50/20 dark:bg-indigo-950/10 pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold font-heading">{student.name}</CardTitle>
                      <CardDescription className="text-xs">Level {student.level} • {student.points} XP</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50 font-bold">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Current Streak</span>
                    <span className="text-lg font-extrabold text-amber-500">{student.currentStreak} Days 🔥</span>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Accuracy</span>
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{student.accuracy}%</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-500">Olympiad Prep Route</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{student.completedPaths} Modules</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-heading">Recent Student Attempts</CardTitle>
          <CardDescription className="text-xs">Summary of math questions submitted by connected students.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950/50">
              <TableRow>
                <TableHead className="font-semibold text-xs text-neutral-500">Student</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Topic</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Question</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Submitted Answer</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              <TableRow>
                <TableCell className="font-semibold">Toby Mercer</TableCell>
                <TableCell>Number Theory</TableCell>
                <TableCell className="text-neutral-500">Find the smallest prime factor of...</TableCell>
                <TableCell className="font-mono text-neutral-600 dark:text-neutral-400">13</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-700 border-none dark:bg-emerald-950 dark:text-indigo-300 rounded-full font-bold">
                    Correct
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Toby Mercer</TableCell>
                <TableCell>Geometry</TableCell>
                <TableCell className="text-neutral-500">Calculate the area of a regular hexagon...</TableCell>
                <TableCell className="font-mono text-neutral-600 dark:text-neutral-400">24 sqrt(3)</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 hover:bg-red-100 text-red-700 border-none dark:bg-red-950/20 dark:text-red-400 rounded-full font-bold">
                    Incorrect
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
