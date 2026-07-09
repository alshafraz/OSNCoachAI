'use client';

import * as React from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  return useNextTheme();
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>('lg');

  React.useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setBreakpoint('xs');
      else if (w < 768) setBreakpoint('sm');
      else if (w < 1024) setBreakpoint('md');
      else if (w < 1280) setBreakpoint('lg');
      else if (w < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export function useResponsive() {
  const breakpoint = useBreakpoint();
  return {
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    breakpoint,
  };
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
}

type ToastCallback = (toasts: Toast[]) => void;
const listeners = new Set<ToastCallback>();
let toastQueue: Toast[] = [];

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>(toastQueue);

  React.useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toast = React.useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, title, description, variant };
    toastQueue = [...toastQueue, newToast];
    listeners.forEach((listener) => listener(toastQueue));

    setTimeout(() => {
      toastQueue = toastQueue.filter((t) => t.id !== id);
      listeners.forEach((listener) => listener(toastQueue));
    }, 4000);
  }, []);

  return { toasts, toast };
}
