import * as React from 'react';

export type IllustrationType =
  | 'ai-coach'
  | 'achievement'
  | 'learning'
  | 'practice'
  | 'empty'
  | 'offline'
  | 'success'
  | 'error';

interface IllustrationProps {
  type: IllustrationType;
  className?: string;
  size?: number;
}

export function Illustration({ type, className, size = 120 }: IllustrationProps) {
  switch (type) {
    case 'ai-coach':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--ai-coach)" fillOpacity="0.1" />
          <rect x="30" y="35" width="40" height="30" rx="10" fill="var(--ai-coach)" />
          <circle cx="42" cy="48" r="4" fill="white" />
          <circle cx="58" cy="48" r="4" fill="white" />
          <path d="M45 57h10" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 20v15" stroke="var(--ai-coach)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="18" r="6" fill="var(--accent)" />
        </svg>
      );
    case 'achievement':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--achievement)" fillOpacity="0.1" />
          <path d="M35 30h30v25c0 8.284-6.716 15-15 15s-15-6.716-15-15V30z" fill="var(--achievement)" />
          <path d="M50 70v15M40 85h20" stroke="var(--achievement)" strokeWidth="5" strokeLinecap="round" />
          <path d="M25 35h10v15H25c-4 0-7-3-7-7.5s3-7.5 7-7.5zm50 0H65v15h10c4 0 7-3 7-7.5s-3-7.5-7-7.5z" fill="var(--achievement)" fillOpacity="0.6" />
        </svg>
      );
    case 'learning':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--olympiad)" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="25" stroke="var(--olympiad)" strokeWidth="6" />
          <path d="M50 32v18M50 50l12 12" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'practice':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--primary)" fillOpacity="0.1" />
          <rect x="30" y="25" width="40" height="50" rx="6" fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="4" />
          <path d="M40 40h20M40 50h20M40 60h15" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'empty':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--muted-foreground)" fillOpacity="0.08" />
          <circle cx="50" cy="45" r="18" stroke="var(--muted-foreground)" strokeWidth="4" strokeDasharray="6 6" />
          <path d="M50 68v8M45 76h10" stroke="var(--muted-foreground)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'offline':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--locked)" fillOpacity="0.1" />
          <path d="M30 65c5-15 35-15 40 0M38 52c3-8 21-8 24 0M45 42c1-3 9-3 10 0" stroke="var(--locked)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="72" r="3" fill="var(--locked)" />
        </svg>
      );
    case 'success':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--completed)" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="30" fill="var(--completed)" />
          <path d="M40 50l7 7 13-14" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="40" fill="var(--destructive)" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="30" fill="var(--destructive)" />
          <path d="M38 38l24 24M62 38l-24 24" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
  }
}
