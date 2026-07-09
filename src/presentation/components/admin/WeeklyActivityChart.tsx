'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface DailyData {
  day: string;
  xp: number;
}

export function WeeklyActivityChart() {
  const data: DailyData[] = [
    { day: 'Mon', xp: 40 },
    { day: 'Tue', xp: 75 },
    { day: 'Wed', xp: 30 },
    { day: 'Thu', xp: 90 },
    { day: 'Fri', xp: 120 },
    { day: 'Sat', xp: 60 },
    { day: 'Sun', xp: 150 },
  ];

  const maxVal = Math.max(...data.map(d => d.xp));
  const height = 180;
  const width = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.xp / maxVal) * chartHeight;
    return { x, y, xp: d.xp, day: d.day };
  });

  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const [hoveredPoint, setHoveredPoint] = React.useState<typeof points[0] | null>(null);

  return (
    <Card className="border border-neutral-200/60 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold font-heading">Weekly Practice Activity</CardTitle>
        <CardDescription className="text-xs text-neutral-400">Daily XP points earned by student this week.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="relative w-full h-[180px]">
          {hoveredPoint && (
            <div
              className="absolute bg-neutral-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100 - 8}%`,
              }}
            >
              {hoveredPoint.xp} XP
            </div>
          )}

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            aria-label="Weekly Activity Chart"
          >
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = paddingTop + chartHeight * ratio;
              const val = Math.round(maxVal * (1 - ratio));
              return (
                <g key={index} className="opacity-40">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800 stroke-[1]"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[9px] fill-neutral-400 font-bold"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {areaD && <path d={areaD} fill="url(#xpGradient)" />}

            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="stroke-indigo-600 dark:stroke-indigo-400"
              />
            )}

            {points.map((p, index) => (
              <text
                key={index}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-neutral-400 font-semibold"
              >
                {p.day}
              </text>
            ))}

            {points.map((p, index) => (
              <circle
                key={index}
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.day === p.day ? 6 : 3.5}
                fill={hoveredPoint?.day === p.day ? '#4f46e5' : '#ffffff'}
                stroke="#4f46e5"
                strokeWidth={hoveredPoint?.day === p.day ? 2.5 : 1.5}
                className="cursor-pointer transition-all duration-100 ease-out fill-white dark:fill-neutral-900"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
