'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileUp, UserPlus, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function QuickActionsCard() {
  const [copied, setCopied] = React.useState(false);

  const handleLinkStudent = () => {
    navigator.clipboard.writeText('MATH-STUDENT-ABC123XYZ');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold font-heading">Parent Admin Controls</CardTitle>
        <CardDescription className="text-xs text-neutral-400">Perform routine parent settings actions and AI tasks.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/parent/upload" className="group">
            <div className="p-4 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col items-center text-center transition-all duration-100 cursor-pointer h-full justify-center">
              <FileUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-indigo-950 dark:text-indigo-200">Upload PDF</span>
            </div>
          </Link>

          <button onClick={handleLinkStudent} className="group text-left w-full h-full cursor-pointer">
            <div className="p-4 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 flex flex-col items-center text-center transition-all duration-100 h-full justify-center w-full">
              {copied ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mb-2 scale-110 transition-transform" />
              ) : (
                <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-[11px] font-bold text-emerald-950 dark:text-emerald-200">
                {copied ? 'Link Token Copied!' : 'Link Student'}
              </span>
            </div>
          </button>

          <div className="group opacity-70 hover:opacity-100 transition-opacity">
            <div className="p-4 bg-violet-50/50 hover:bg-violet-50 dark:bg-violet-950/20 dark:hover:bg-violet-950/30 rounded-2xl border border-violet-100/50 dark:border-violet-900/30 flex flex-col items-center text-center transition-all duration-100 cursor-default h-full justify-center">
              <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400 mb-2" />
              <span className="text-[11px] font-bold text-violet-950 dark:text-violet-200">AI Gen Question</span>
            </div>
          </div>

          <div className="group opacity-70 hover:opacity-100 transition-opacity">
            <div className="p-4 bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 rounded-2xl border border-amber-100/50 dark:border-amber-900/30 flex flex-col items-center text-center transition-all duration-100 cursor-default h-full justify-center">
              <Download className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2" />
              <span className="text-[11px] font-bold text-amber-950 dark:text-amber-200">Export CSV</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
