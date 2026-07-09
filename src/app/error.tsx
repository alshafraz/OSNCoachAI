'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-center p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 font-sans">
      <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-extrabold tracking-tight">Something went wrong!</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          We encountered an unexpected error. You can try reloading or return to the landing page.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
