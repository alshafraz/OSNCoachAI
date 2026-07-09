'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// 1. SOUND INTERFACES
export interface SoundController {
  playEvent(event: 'click' | 'correct' | 'wrong' | 'xp' | 'achievement' | 'mission'): void;
}

export const soundManager: SoundController = {
  playEvent(event) {
    console.log(`[Sound Event Fired]: ${event} (interface only, no actual audio loaded)`);
  }
};

// 2. MOTION TOKENS
export const transitionDurations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
};

export const transitionEasings = {
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  bounce: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
};

// Spring and Elastic dynamics
export const springTransition = { type: 'spring', stiffness: 300, damping: 20 };
export const elasticTransition = { type: 'spring', stiffness: 450, damping: 12 };

// 3. ANIMATION VARIANTS
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: transitionDurations.normal,
      ease: transitionEasings.easeOut,
    },
  },
};

export const hoverLift = {
  hover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
  tap: { scale: 0.98 },
};

export const hoverGlow = {
  hover: { scale: 1.01, boxShadow: '0 0 12px var(--primary)', transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export const cardTilt = {
  hover: { scale: 1.01, rotate: 0.5, transition: { duration: 0.15 } },
  tap: { scale: 0.99 },
};

export const iconBounce = {
  animate: {
    y: [0, -3, 0],
    transition: {
      repeat: Infinity,
      duration: 1.2,
      ease: 'easeInOut',
    },
  },
};

export const iconRotate = {
  hover: { rotate: 20, transition: { type: 'spring', stiffness: 200 } },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: transitionEasings.bounce },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
};

export const toastVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15 },
  },
};

// 4. MOTION WIDGETS
interface XPCounterProps {
  fromValue: number;
  toValue: number;
  duration?: number;
  className?: string;
}

export function XPCounter({ fromValue, toValue, duration = 1, className }: XPCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(fromValue);

  React.useEffect(() => {
    let start = fromValue;
    if (start === toValue) return;

    const diff = toValue - start;
    const stepTime = Math.max(Math.floor((duration * 1000) / Math.abs(diff)), 15);
    const stepAmount = diff > 0 ? 1 : -1;

    const timer = setInterval(() => {
      start += stepAmount;
      setDisplayValue(start);
      if (start === toValue) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [fromValue, toValue, duration]);

  return <span className={className}>{displayValue}</span>;
}

interface XPProgressFillProps {
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
}

export function XPProgressFill({ value, max = 100, className, colorClass = 'bg-primary' }: XPProgressFillProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-950 rounded-full overflow-hidden border border-border/40">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: '0%' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export function StreakFlame({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, -1, 1, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      }}
    >
      <path
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        fill="var(--hard)"
      />
      <path
        d="M15 11a3 3 0 11-6 0c0-1.657 1.343-3 3-3s3 1.343 3 3z"
        fill="var(--medium)"
      />
    </motion.svg>
  );
}

export function TypingIndicator() {
  const dotVariants: any = {
    animate: (i: number) => ({
      y: ['0%', '-50%', '0%'],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className="flex gap-1.5 items-center justify-start p-3 bg-neutral-100 dark:bg-neutral-850 rounded-2xl max-w-[80px]">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-500"
          custom={i}
          variants={dotVariants}
          animate="animate"
        />
      ))}
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-850 border border-border/30 rounded-2xl max-w-xs text-xs font-bold text-neutral-500">
      <motion.div
        className="h-4 w-4 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <span>Thinking...</span>
    </div>
  );
}

export function triggerConfetti() {
  soundManager.playEvent('achievement');
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// 5. PAGE TRANSITION WRAPPER
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: transitionDurations.normal, ease: transitionEasings.easeOut }}
    >
      {children}
    </motion.div>
  );
}
