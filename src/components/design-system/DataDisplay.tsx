'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './BaseUI';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto rounded-3xl border border-border bg-card">
      <table className={cn('w-full caption-bottom text-xs sm:text-sm font-semibold border-collapse', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-neutral-50/50 dark:bg-neutral-950/30 border-b border-border', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b border-border hover:bg-neutral-50/20 dark:hover:bg-neutral-900/10 transition-colors', className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('h-10 px-4 text-left align-middle font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-[10px]', className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('p-4 align-middle text-neutral-800 dark:text-neutral-250', className)} {...props} />;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  loading?: boolean;
}

export function Pagination({ page, totalPages, onPageChange, loading }: PaginationProps) {
  return (
    <div className="flex items-center justify-between p-4 border-t border-border bg-neutral-50/50 dark:bg-neutral-900/40 text-xs sm:text-sm">
      <span className="text-neutral-400 font-bold uppercase tracking-wider">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="rounded-xl"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="rounded-xl"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
