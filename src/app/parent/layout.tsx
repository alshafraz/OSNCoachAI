import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/auth';
import { Brain, LayoutDashboard, FileUp, Users, LogOut, Settings, BookOpen } from 'lucide-react';

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route protection
  if (!session) {
    redirect('/login');
  }

  if (session.user && (session.user as any).role !== 'PARENT') {
    redirect('/login');
  }

  const handleLogout = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  const username = session?.user?.name || 'Parent';

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-heading font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            MathOSN Parent
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/parent"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/parent/questions"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <BookOpen className="h-5 w-5" />
            Question Bank
          </Link>
          <Link
            href="/parent/upload"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <FileUp className="h-5 w-5" />
            Upload PDF OCR
          </Link>
          <Link
            href="/parent/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <form action={handleLogout}>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Brain className="h-4 w-4" />
            </div>
            <span className="font-heading font-extrabold text-sm">Parent Portal</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs sm:text-sm font-bold border border-indigo-200/50 dark:border-indigo-900/30">
              <Users className="h-4 w-4" />
              <span>1 Student Connected</span>
            </div>

            <span className="w-px h-6 bg-neutral-200 dark:bg-neutral-800" />
            <ThemeToggle />
            
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                <Users className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline font-semibold">{username}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-950 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
