import { LoginForm } from '@/presentation/components/shared/LoginForm';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative p-4 bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <ThemeToggle />
      </div>
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-heading font-extrabold text-sm hover:opacity-85 transition-opacity">
          <Brain className="h-5 w-5" />
          <span>MathOSN Coach</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
