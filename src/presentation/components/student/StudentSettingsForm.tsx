'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfileAction } from '@/presentation/actions/profileActions';
import { Loader2, Bell, Volume2, Sparkles, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';

interface StudentSettingsFormProps {
  initialName: string;
  initialEmail: string;
}

export function StudentSettingsForm({ initialName, initialEmail }: StudentSettingsFormProps) {
  const { theme, setTheme } = useTheme();

  const [name, setName] = React.useState(initialName);
  const [email] = React.useState(initialEmail);

  const [sound, setSound] = React.useState(true);
  const [animations, setAnimations] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('en');

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatus({ success: false, message: 'New passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      const res = await updateProfileAction({
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        setStatus({ success: true, message: 'Settings saved successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatus({ success: false, message: res.error?.message || 'Failed to save settings.' });
      }
    } catch (err) {
      setStatus({ success: false, message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm font-semibold">
      {status && (
        <div className={`p-4 rounded-xl border font-bold text-xs ${
          status.success
            ? 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-950/20 dark:bg-emerald-950/20 dark:text-emerald-400 animate-in fade-in duration-100'
            : 'border-red-100 bg-red-50 text-red-700 dark:border-red-950/20 dark:bg-red-950/20 dark:text-red-400 animate-in fade-in duration-100'
        }`}>
          {status.message}
        </div>
      )}

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold font-heading">Profile Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-500">Student Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-500">Email Address (Read-only)</label>
            <Input
              value={email}
              disabled
              className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 opacity-60 cursor-not-allowed"
            />
          </div>
        </div>
      </Card>

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold font-heading">Learning Preferences</h3>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="font-bold block">Sound Effects</span>
                <span className="text-[10px] text-neutral-400 font-medium">Chimes for correct answers</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sound}
              onChange={(e) => setSound(e.target.checked)}
              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-neutral-350 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="font-bold block">Animations</span>
                <span className="text-[10px] text-neutral-400 font-medium">Confetti & level highlights</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={animations}
              onChange={(e) => setAnimations(e.target.checked)}
              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-neutral-350 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="font-bold block">Daily Reminders</span>
                <span className="text-[10px] text-neutral-400 font-medium">Streak safeguard notifications</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-neutral-350 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="font-bold block">App Language</span>
                <span className="text-[10px] text-neutral-400 font-medium">Preferred language setting</span>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-8 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-2.5 text-xs focus-visible:outline-none font-bold cursor-pointer"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 flex items-center justify-center font-bold text-neutral-400">☼</span>
              <div>
                <span className="font-bold block">Dark Mode Theme</span>
                <span className="text-[10px] text-neutral-400 font-medium">Use dark interface colors</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-neutral-350 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold font-heading">Change Password (Optional)</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-500">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-6 h-10 transition-transform active:scale-[0.98]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}
