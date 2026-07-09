import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, History, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function StudentHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const filter = params.filter || '';

  let attempts = [
    { id: '1', date: '2026-07-08', topic: 'Geometry', count: 5, correct: 4, wrong: 1, accuracy: 80, duration: '12m 45s', score: 40 },
    { id: '2', date: '2026-07-07', topic: 'Number System', count: 10, correct: 9, wrong: 1, accuracy: 90, duration: '20m 10s', score: 90 },
    { id: '3', date: '2026-07-06', topic: 'Algebra', count: 8, correct: 5, wrong: 3, accuracy: 62, duration: '18m 30s', score: 50 },
    { id: '4', date: '2026-07-05', topic: 'Combinatorics', count: 5, correct: 5, wrong: 0, accuracy: 100, duration: '8m 15s', score: 50 },
    { id: '5', date: '2026-07-04', topic: 'Logic', count: 6, correct: 3, wrong: 3, accuracy: 50, duration: '15m 00s', score: 30 },
  ];

  if (search) {
    const q = search.toLowerCase();
    attempts = attempts.filter(a => a.topic.toLowerCase().includes(q));
  }
  if (filter === 'perfect') {
    attempts = attempts.filter(a => a.accuracy === 100);
  } else if (filter === 'review') {
    attempts = attempts.filter(a => a.accuracy < 70);
  }

  const limit = 4;
  const total = attempts.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedAttempts = attempts.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 text-xs sm:text-sm">
      <div className="flex items-center gap-4">
        <Link href="/student">
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Practice History</h1>
          <p className="text-neutral-500 text-sm">Review details of your completed math practice sessions.</p>
        </div>
      </div>

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="p-5">
          <form method="GET" className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                name="search"
                defaultValue={search}
                placeholder="Search practice by topic name..."
                className="pl-9 rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 text-sm"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto shrink-0 justify-end">
              <select
                name="filter"
                defaultValue={filter}
                className="flex h-9 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-3 py-1.5 text-xs font-semibold focus-visible:outline-none"
              >
                <option value="">All Attempts</option>
                <option value="perfect">Perfect Scores (100%)</option>
                <option value="review">Needs Review (&lt;70%)</option>
              </select>
              <Button type="submit" className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer h-9 px-4">
                Apply
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950/50">
              <TableRow>
                <TableHead className="font-semibold text-xs text-neutral-500 pl-6">Date</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Topic</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500 text-center">Solves</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500 text-center">Correct/Wrong</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Accuracy</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500">Duration</TableHead>
                <TableHead className="font-semibold text-xs text-neutral-500 pr-6 text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAttempts.length > 0 ? (
                paginatedAttempts.map((attempt) => (
                  <TableRow key={attempt.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                    <TableCell className="pl-6 py-4 font-semibold text-neutral-500">{attempt.date}</TableCell>
                    <TableCell className="font-bold text-neutral-800 dark:text-neutral-200">{attempt.topic}</TableCell>
                    <TableCell className="text-center font-bold text-neutral-600 dark:text-neutral-350">{attempt.count}</TableCell>
                    <TableCell className="text-center font-semibold">
                      <span className="text-emerald-600">{attempt.correct}</span>
                      <span className="text-neutral-300 dark:text-neutral-700 mx-1">/</span>
                      <span className="text-rose-600">{attempt.wrong}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-none rounded-full text-[9px] font-extrabold px-2.5 py-0.5 ${
                        attempt.accuracy >= 90
                          ? 'bg-emerald-100 text-emerald-700'
                          : attempt.accuracy >= 70
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {attempt.accuracy}% Accuracy
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-500">{attempt.duration}</TableCell>
                    <TableCell className="pr-6 text-right font-extrabold text-indigo-600 dark:text-indigo-400">+{attempt.score} XP</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-neutral-400 italic">
                    <History className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                    No practice history found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/student/history?page=${page - 1}&search=${search}&filter=${filter}`}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 cursor-pointer text-xs"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>
                </Link>
                <Link
                  href={`/student/history?page=${page + 1}&search=${search}&filter=${filter}`}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    className="rounded-xl font-bold border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 cursor-pointer text-xs"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
