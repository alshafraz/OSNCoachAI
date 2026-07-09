'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'play';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center font-bold rounded-2xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/95',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
          variant === 'accent' && 'bg-accent text-accent-foreground hover:bg-accent/90',
          variant === 'outline' && 'border-2 border-border bg-transparent hover:bg-accent/5 text-foreground',
          variant === 'ghost' && 'bg-transparent hover:bg-accent/5 text-foreground active:scale-100',
          variant === 'play' && 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-play hover:shadow-play-hover active:translate-y-[4px] active:shadow-play-active active:scale-100 border-b-4 border-indigo-850',
          size === 'sm' && 'h-8 px-3 text-xs rounded-xl',
          size === 'md' && 'h-10 px-5 text-sm',
          size === 'lg' && 'h-12 px-6 text-base rounded-3xl',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2 shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'none' | 'shadow' | 'hover' | 'play';
}

export function Card({ className, elevation = 'shadow', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-card text-card-foreground',
        elevation === 'shadow' && 'shadow-elevation-1',
        elevation === 'hover' && 'shadow-elevation-1 hover:shadow-elevation-2 hover:scale-[1.005] transition-all duration-200',
        elevation === 'play' && 'shadow-play border-b-4',
        className
      )}
      {...props}
    />
  );
}

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'xp'
  | 'streak'
  | 'ai'
  | 'completed'
  | 'locked'
  | 'new';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border-none',
        variant === 'primary' && 'bg-primary/10 text-primary',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        variant === 'easy' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450',
        variant === 'medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450',
        variant === 'hard' && 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-455',
        variant === 'xp' && 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-450',
        variant === 'streak' && 'bg-amber-400 text-indigo-950',
        variant === 'ai' && 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
        variant === 'completed' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450',
        variant === 'locked' && 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
        variant === 'new' && 'bg-rose-500 text-white',
        className
      )}
      {...props}
    />
  );
}

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  onDismiss?: () => void;
}

export function Chip({ className, children, onDismiss, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-3 py-1 text-xs font-bold border border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full p-0.5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden shrink-0 bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center border border-white dark:border-neutral-900 shadow-sm select-none',
        size === 'sm' && 'h-8 w-8 text-xs',
        size === 'md' && 'h-12 w-12 text-sm',
        size === 'lg' && 'h-16 w-16 text-base',
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
