'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToast } from './hooks';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-border shadow-elevation-2 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-250 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1.5 pr-6">
          <h3 className="text-lg font-bold font-heading leading-none text-neutral-800 dark:text-neutral-200">{title}</h3>
          {description && <p className="text-xs text-neutral-400 font-semibold">{description}</p>}
        </div>

        <div className="text-xs sm:text-sm font-semibold">{children}</div>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  const icons = {
    default: Info,
    success: CheckCircle,
    destructive: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    default: 'border-neutral-200 bg-white text-neutral-800 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200',
    success: 'border-emerald-100 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450',
    destructive: 'border-red-100 bg-red-50 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400',
    warning: 'border-amber-100 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400',
    info: 'border-indigo-100 bg-indigo-50 text-indigo-855 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => {
        const Icon = icons[t.variant || 'default'];
        return (
          <div
            key={t.id}
            className={cn(
              'border rounded-2xl p-4 shadow-elevation-1 flex items-start gap-3 animate-in slide-in-from-bottom duration-300 font-semibold text-xs sm:text-sm',
              colors[t.variant || 'default']
            )}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <span className="font-bold block leading-none">{t.title}</span>
              {t.description && <span className="text-[11px] opacity-80 block">{t.description}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50">
        {content}
      </div>
    </div>
  );
}

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function Popover({ trigger, children }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-neutral-900 border border-border rounded-2xl shadow-elevation-2 p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150 min-w-48 text-xs sm:text-sm font-semibold">
          {children}
        </div>
      )}
    </div>
  );
}
