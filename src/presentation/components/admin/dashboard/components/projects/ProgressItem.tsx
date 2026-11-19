'use client';

import type { LucideIcon } from 'lucide-react';
import { clamp, safeNumber } from './Config';

interface ProgressItemProps {
  label: string;
  value?: number;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  description: string;
  index?: number;
}

export function ProgressItem({ label, value, icon: Icon, iconBackground, iconColor, description, index = 0 }: ProgressItemProps) {
  const safeValue = safeNumber(value);
  const pct = Math.round(clamp(safeValue));

  return (
    <div className="projects-progress-item" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700">{label}</p>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-[#164E63]">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${label}: ${pct}%`}
        className="h-2 overflow-hidden rounded-full bg-[#E8F0F3]"
      >
        <div className="projects-progress-bar h-full rounded-full bg-[#164E63]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}