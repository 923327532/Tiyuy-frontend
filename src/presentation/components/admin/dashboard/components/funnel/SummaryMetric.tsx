'use client';

import type { LucideIcon } from 'lucide-react';

interface SummaryMetricProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export function SummaryMetric({ label, value, icon: Icon, color }: SummaryMetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium text-slate-400">{label}</p>
        <p className="text-sm font-bold text-[#164E63] tabular-nums">{value}</p>
      </div>
    </div>
  );
}