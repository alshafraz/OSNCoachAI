'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1 w-full text-xs sm:text-sm font-semibold">
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-2xl border border-neutral-350 bg-neutral-50/50 dark:bg-neutral-950/50 px-3.5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error ? 'border-red-500 focus-visible:ring-red-500' : 'focus:border-primary',
            className
          )}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-wide">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full text-xs sm:text-sm font-semibold">
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-2xl border border-neutral-350 bg-neutral-50/50 dark:bg-neutral-950/50 px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-semibold',
            error ? 'border-red-500 focus-visible:ring-red-500' : 'focus:border-primary',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-wide">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
}

export function Progress({ value, max = 100, className, colorClass = 'bg-primary' }: ProgressProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('h-2.5 w-full bg-neutral-100 dark:bg-neutral-950 rounded-full overflow-hidden border border-border/40', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', colorClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  className,
  colorClass = 'stroke-primary',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const pct = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center select-none font-bold text-xs', className)} style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          className="stroke-neutral-100 dark:stroke-neutral-950 fill-none"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className={cn('fill-none transition-all duration-500 ease-out-back', colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
      </svg>
      <div className="absolute text-center flex flex-col justify-center leading-none">
        <span className="text-[10px] text-neutral-800 dark:text-neutral-200">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
