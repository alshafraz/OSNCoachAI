'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TabsProps {
  tabs: { label: string; value: string }[];
  activeValue: string;
  onChange: (val: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeValue, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-border gap-2 pb-px text-xs sm:text-sm font-semibold', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2 border-b-2 border-transparent hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors',
            activeValue === tab.value
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
              : 'text-neutral-500'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ title, children, className }: AccordionProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('border border-border rounded-2xl overflow-hidden bg-card text-xs sm:text-sm font-semibold', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="p-4 border-t border-border bg-neutral-50/20 dark:bg-neutral-900/10 leading-relaxed">{children}</div>}
    </div>
  );
}

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase tracking-wider">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-neutral-600 dark:text-neutral-350' : ''}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 text-neutral-350" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function Navbar({ logoName = 'MathOSN', children }: { logoName?: string; children?: React.ReactNode }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-neutral-900 border-b border-border shadow-sm">
      <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
        <span>{logoName}</span>
      </div>
      <div className="flex items-center gap-4 text-xs font-semibold">{children}</div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="py-6 border-t border-border text-center text-xs text-neutral-400 font-semibold bg-neutral-50/30 dark:bg-neutral-950/20">
      <span>© 2026 MathOSN Coach. Built with love for Mathematics Olympiad champions.</span>
    </footer>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="w-64 border-r border-border bg-white dark:bg-neutral-900 flex flex-col h-full shrink-0">
      {children}
    </aside>
  );
}
