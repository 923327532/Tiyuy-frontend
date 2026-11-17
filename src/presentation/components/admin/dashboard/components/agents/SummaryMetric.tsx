'use client';

import type { LucideIcon } from 'lucide-react';

interface SummaryMetricProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  children?: React.ReactNode;
}

export function SummaryMetric({
  label,
  value,
  description,
  icon: Icon,
  iconBackground,
  iconColor,
  children,
}: SummaryMetricProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 transition-colors hover:border-slate-300/80 hover:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Izquierda: Ícono + Título + Descripción */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <dt className="text-xs font-semibold text-slate-700">{label}</dt>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{description}</p>
          </div>
        </div>

        {/* Derecha: Valor principal + Badge apilados */}
        <dd className="flex shrink-0 flex-col items-end text-right">
          <span className="text-2xl font-bold tracking-tight tabular-nums text-[#164E63]">
            {value}
          </span>
          {children && <div className="mt-0.5">{children}</div>}
        </dd>
      </div>
    </div>
  );
}