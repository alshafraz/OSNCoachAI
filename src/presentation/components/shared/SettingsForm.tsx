'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { updateProfileAction } from '../../actions/profileActions';
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsFormProps {
  initialName: string;
  initialEmail: string;
}

export function SettingsForm({ initialName, initialEmail }: SettingsFormProps) {
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [newPassword, setNewPassword] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await updateProfileAction({
        name,
        email,
        currentPassword,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        setStatus({ type: 'success', message: 'Your profile has been updated successfully!' });
        setNewPassword('');
        setCurrentPassword('');
      } else {
        setStatus({
          type: 'error',
          message: res.error?.message || 'Failed to update profile. Please verify your current password.',
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <CardTitle className="text-xl font-bold font-heading">Account Information</CardTitle>
        <CardDescription className="text-xs text-neutral-400">
          Update your profile name, email, or change your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-4">
          {status && (
            <div className={`p-4 rounded-xl flex items-start gap-3 border text-xs sm:text-sm ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span className="font-semibold">{status.message}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Display Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 focus-visible:ring-indigo-600 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 focus-visible:ring-indigo-600 text-sm"
              />
            </div>
          </div>

          <span className="block border-t border-neutral-100 dark:border-neutral-800 my-4" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">New Password (Optional)</label>
              <Input
                type="password"
                placeholder="Leave blank to keep current"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 focus-visible:ring-indigo-600 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Confirm Current Password (Required)</label>
              <Input
                type="password"
                placeholder="Required to save changes"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 focus-visible:ring-indigo-600 text-sm"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-6 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-5 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
