'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please use the quick accounts below.');
        setLoading(false);
      } else {
        if (email.includes('parent')) {
          router.push('/parent');
        } else {
          router.push('/student');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  const useQuickAccount = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <Card className="w-full max-w-md border border-neutral-200/80 dark:border-neutral-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-neutral-900">
      <CardHeader className="space-y-1 text-center bg-indigo-50/30 dark:bg-indigo-950/10 pb-8 pt-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-3">
          <Brain className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-heading font-extrabold tracking-tight">Welcome Back!</CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Enter your credentials to access your OSN workspace.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Email Address</label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 focus-visible:ring-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 focus-visible:ring-indigo-600"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 h-11 transition-all active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-400">Quick Sandbox Accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => useQuickAccount('parent@mathosn.com', 'password')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-left transition-colors cursor-pointer"
            >
              <Badge className="bg-indigo-100 hover:bg-indigo-100 text-indigo-700 border-none dark:bg-indigo-950 dark:text-indigo-300 text-[10px] mb-1 font-semibold">
                Parent (Admin)
              </Badge>
              <span className="text-[10px] text-neutral-400">parent@mathosn.com</span>
            </button>
            <button
              type="button"
              onClick={() => useQuickAccount('student@mathosn.com', 'password')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-left transition-colors cursor-pointer"
            >
              <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 border-none dark:bg-amber-950 dark:text-amber-300 text-[10px] mb-1 font-semibold">
                Student Portal
              </Badge>
              <span className="text-[10px] text-neutral-400">student@mathosn.com</span>
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
