'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle } from 'lucide-react';

interface UploadItem {
  id: string;
  fileName: string;
  questionCount: number;
  uploadDate: string;
  status: 'EXTRACTED' | 'PROCESSING' | 'FAILED';
}

export function RecentUploadsList() {
  const uploads: UploadItem[] = [
    { id: '1', fileName: 'number_theory_primer.pdf', questionCount: 5, uploadDate: '2026-07-08', status: 'EXTRACTED' },
    { id: '2', fileName: 'geometry_challenging_angles.pdf', questionCount: 3, uploadDate: '2026-07-07', status: 'EXTRACTED' },
    { id: '3', fileName: 'combinatorics_combinatorial_games.pdf', questionCount: 0, uploadDate: '2026-07-08', status: 'PROCESSING' },
    { id: '4', fileName: 'algebra_inequalities_unsupported.pdf', questionCount: 0, uploadDate: '2026-07-05', status: 'FAILED' },
  ];

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold font-heading">Worksheet OCR Tracking</CardTitle>
        <CardDescription className="text-xs text-neutral-400">PDF worksheets uploaded for AI parsing and extraction.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-950/50">
            <TableRow>
              <TableHead className="font-semibold text-xs text-neutral-500 pl-6">Worksheet</TableHead>
              <TableHead className="font-semibold text-xs text-neutral-500">Date</TableHead>
              <TableHead className="font-semibold text-xs text-neutral-500">Extracted</TableHead>
              <TableHead className="font-semibold text-xs text-neutral-500 pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {uploads.map((upload) => (
              <TableRow key={upload.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                <TableCell className="pl-6 font-semibold py-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="truncate max-w-[150px] sm:max-w-[200px]" title={upload.fileName}>
                    {upload.fileName}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-400">{upload.uploadDate}</TableCell>
                <TableCell className="text-neutral-600 dark:text-neutral-300 font-bold">
                  {upload.status === 'EXTRACTED' ? `${upload.questionCount} Questions` : '-'}
                </TableCell>
                <TableCell className="pr-6 text-right py-3">
                  {upload.status === 'EXTRACTED' && (
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-none rounded-full font-bold">
                      Extracted
                    </Badge>
                  )}
                  {upload.status === 'PROCESSING' && (
                    <Badge className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-none rounded-full font-bold">
                      Processing
                    </Badge>
                  )}
                  {upload.status === 'FAILED' && (
                    <Badge className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-none rounded-full font-bold inline-flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Failed
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
