'use client';

import * as React from 'react';

interface QuestionTableProps {
  headers?: string[];
  rows: string[][];
  caption?: string;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  headers,
  rows,
  caption,
}) => {
  return (
    <div className="my-5 space-y-2">
      <div className="w-full overflow-x-auto border border-neutral-200/70 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/50 shadow-sm scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-850">
        <table className="w-full text-left border-collapse text-xs">
          {headers && headers.length > 0 && (
            <thead>
              <tr className="bg-neutral-50/80 dark:bg-neutral-850 border-b border-neutral-200/60 dark:border-neutral-800 font-bold text-neutral-600 dark:text-neutral-300">
                {headers.map((h, i) => (
                  <th
                    key={`th-${i}`}
                    className="p-3 font-semibold select-none first:rounded-tl-2xl last:rounded-tr-2xl"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
            {rows.map((row, rIdx) => (
              <tr
                key={`tr-${rIdx}`}
                className="hover:bg-neutral-55/30 dark:hover:bg-neutral-850/20 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={`td-${rIdx}-${cIdx}`}
                    className="p-3 text-neutral-800 dark:text-neutral-200 leading-normal"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="text-center text-[10px] text-neutral-450 italic mt-1.5">
          Tabel: {caption}
        </p>
      )}
    </div>
  );
};
