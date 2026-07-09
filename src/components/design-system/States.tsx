'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './BaseUI';
import { Illustration, IllustrationType } from './Illustration';
import { AlertCircle, RotateCcw, ShieldAlert, WifiOff } from 'lucide-react';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800', className)} {...props} />;
}

export function CardSkeleton() {
  return (
    <div className="border border-border rounded-3xl p-5 space-y-4 bg-card">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-3xl" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="border border-border rounded-3xl overflow-hidden space-y-4 p-4 bg-card">
      <div className="flex justify-between items-center pb-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/6" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function QuestionSkeleton() {
  return (
    <div className="border border-border rounded-3xl p-6 bg-card space-y-5">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-12" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="border border-border rounded-3xl p-6 text-center space-y-4 bg-card">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
      <div className="md:col-span-2 space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

interface EmptyStateProps {
  illustrationType: IllustrationType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  illustrationType,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto text-xs sm:text-sm font-semibold">
      <Illustration type={illustrationType} size={100} className="mb-2 animate-bounce-slow" />
      <div className="space-y-1">
        <h4 className="text-base font-bold font-heading text-neutral-800 dark:text-neutral-255 leading-tight">{title}</h4>
        <p className="text-neutral-450 text-xs leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} className="rounded-xl px-5 h-9 text-xs">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export type ErrorType = '404' | '500' | 'offline' | 'retry' | 'permission-denied' | 'upload-failed';

interface ErrorStateProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ type, message, onRetry }: ErrorStateProps) {
  const errorDetails = {
    '404': {
      title: 'Page Not Found',
      description: "Oops! We searched everywhere but couldn't find this page.",
      icon: AlertCircle,
      color: 'text-amber-500 bg-amber-500/10',
    },
    '500': {
      title: 'Internal Server Error',
      description: 'Something went wrong inside our server dashboard. We are fixing it!',
      icon: AlertCircle,
      color: 'text-red-500 bg-red-500/10',
    },
    'offline': {
      title: 'You are Offline',
      description: 'Please check your internet connection and try reloading the page.',
      icon: WifiOff,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    'retry': {
      title: 'Operation Failed',
      description: message || 'An unexpected runtime error occurred.',
      icon: RotateCcw,
      color: 'text-rose-500 bg-rose-500/10',
    },
    'permission-denied': {
      title: 'Permission Denied',
      description: 'You do not have access rights to view this administration panel.',
      icon: ShieldAlert,
      color: 'text-red-650 bg-red-650/10',
    },
    'upload-failed': {
      title: 'Upload Failed',
      description: 'Failed to process file layout or stream data to storage buckets.',
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-600/10',
    },
  };

  const details = errorDetails[type];
  const Icon = details.icon;

  return (
    <div className="border border-border rounded-3xl bg-card p-8 text-center max-w-sm mx-auto space-y-5 shadow-elevation-1 text-xs sm:text-sm font-semibold">
      <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center mx-auto shrink-0', details.color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold font-heading text-neutral-800 dark:text-neutral-255 leading-tight">{details.title}</h4>
        <p className="text-neutral-450 text-xs leading-relaxed">{details.description}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="rounded-xl px-5 h-9 text-xs">
          Try Again
        </Button>
      )}
    </div>
  );
}
