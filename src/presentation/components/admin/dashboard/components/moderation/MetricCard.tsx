'use client';

import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  children?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  iconBackground,
  iconColor,
  children,
}: MetricCardProps) {
  return (
    <div className="min-w-0 p-4 sm:p-5 rounded-2xl bg-white/60 border border-slate-100/50 hover:border-slate-200/50 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs font-semibold text-slate-600 truncate">{label}</dt>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 truncate">{description}</p>
          </div>
        </div>
        <dd className="flex items-baseline gap-2 shrink-0 w-full sm:w-auto sm:ml-4 sm:justify-end">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[#164E63]">{value}</span>
          {children && <span className="flex-shrink-0">{children}</span>}
        </dd>
      </div>
    </div>
  );
}