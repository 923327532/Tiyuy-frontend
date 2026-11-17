'use client';

import type { DonutSegment } from './Config';
import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';

interface DonutLegendProps {
  segments: DonutSegment[];
}

export function DonutLegend({ segments }: DonutLegendProps) {
  return (
    <dl className="w-full min-w-0 divide-y divide-[#E2EAF0]">
      {segments.map((segment, index) => {
        const Icon = segment.icon;

        return (
          <div
            key={segment.id}
            className="properties-donut-legend flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3 first:pt-0 last:pb-0"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 w-full">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${segment.iconBackground}`}
              >
                <Icon className={`h-4 w-4 ${segment.iconColor}`} aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <dt className="text-sm font-semibold text-slate-800 truncate">
                  {segment.label}
                </dt>
                <p className="truncate text-xs text-slate-500">
                  {segment.hint}
                </p>
              </div>
            </div>

            <dd className="shrink-0 text-right tabular-nums w-full sm:w-auto mt-1 sm:mt-0">
              <p className="text-sm font-semibold text-[#164E63]">
                {formatNumber(segment.value)}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {segment.percentage}%
              </p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}