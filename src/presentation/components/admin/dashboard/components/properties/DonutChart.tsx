'use client';

import { Building2 } from 'lucide-react';

import type { CSSProperties } from 'react';

import type { DonutSegment } from './Config';
import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { RADIUS, CIRCUMFERENCE } from './Config';

interface DonutChartProps {
  segments: DonutSegment[];
  total: number;
}

export function DonutChart({ segments, total }: DonutChartProps) {
  const chartDescription = segments
    .map((segment) => `${formatNumber(segment.value)} ${segment.label.toLowerCase()}`)
    .join(', ');

  return (
    <div className="relative shrink-0" style={{ width: '100%', maxWidth: '220px', aspectRatio: '1 / 1' }}>
      <svg
        viewBox="0 0 180 180"
        className="h-full w-full"
        role="img"
        aria-label={`${formatNumber(total)} propiedades: ${chartDescription}`}
      >
        <g transform="rotate(-90 90 90)">
          {/* Fondo del gráfico */}
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="#EDF2F5"
            strokeWidth="17"
          />

          {/* Segmentos */}
          {total > 0 &&
            segments.map((segment, index) => {
              if (segment.value <= 0) return null;

              const dashArray = `${segment.length} ${CIRCUMFERENCE - segment.length}`;

              return (
                <circle
                  key={segment.id}
                  cx="90"
                  cy="90"
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="17"
                  strokeLinecap="butt"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-segment.offset}
                  className="properties-donut-segment"
                  style={{
                    '--segment-dasharray': dashArray,
                    '--segment-circumference': CIRCUMFERENCE,
                    animationDelay: `${index * 100}ms`,
                  } as CSSProperties}
                ></circle>
              );
            })}
        </g>
      </svg>

      {/* Información central */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4">
        <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F0F3]">
          <Building2 className="h-4 w-4 text-[#164E63]" aria-hidden="true" />
        </span>

        <p className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums text-[#164E63]">
          {formatNumber(total)}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-500">
          propiedades
        </p>
      </div>
    </div>
  );
}