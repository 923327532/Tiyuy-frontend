'use client';

import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import type { FunnelStageConfig } from './StagesConfig';

interface FunnelStageProps {
  stage: FunnelStageConfig;
  index: number;
  value: number;
  rate: number;
}

export function FunnelStage({ stage, index, value, rate }: FunnelStageProps) {
  const Icon = stage.icon;

  const visualWidth = Math.max(rate, value > 0 ? 2 : 0);

  return (
    <li
      className="
        group animate-funnel-entry
        rounded-xl p-3
        transition-colors duration-200
        hover:bg-[#F8FAFC]
      "
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {/* Stage information */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stage.background}`}>
            <Icon className={`h-[18px] w-[18px] ${stage.text}`} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                {stage.label}
              </span>
              <span className="text-[10px] font-medium text-slate-300">
                0{index + 1}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-slate-400">
              {stage.description}
            </p>
          </div>
        </div>

        {/* Value */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold tracking-tight text-[#164E63] tabular-nums">
            {formatNumber(value)}
          </p>
          {index > 0 && (
            <p className="text-[10px] font-medium text-slate-400 tabular-nums">
              {rate.toLocaleString('es-PE', { maximumFractionDigits: 1 })}%
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[#EAF0F4]"
        role="progressbar"
        aria-label={`${stage.label} respecto a la etapa anterior`}
        aria-valuenow={Number(rate.toFixed(1))}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-out ${stage.bar} funnel-progress`}
          style={{ width: `${visualWidth}%`, animationDelay: `${index * 140}ms` }}
        />
      </div>
    </li>
  );
}