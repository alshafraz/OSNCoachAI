'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

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
    <div className="h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-6 font-sans">
      <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-extrabold tracking-tight">Something went wrong!</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          We encountered an unexpected error in this parent admin workspace. Please try again.
        </p>
      </div>
      <Button onClick={() => reset()} className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
        Try Again
      </Button>
    </div>
  );
}
