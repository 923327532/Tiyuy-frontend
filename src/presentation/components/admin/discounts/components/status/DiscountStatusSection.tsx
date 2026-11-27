'use client';

import { BarChart3 } from 'lucide-react';

import { useCentralDiscountSummary } from '@/presentation/hooks/useAdmin';

const STATUS_ITEMS = [
  {
    key: 'active',
    label: 'Activos',
    dot: 'bg-emerald-500 ring-emerald-500/15',
    badge: 'bg-emerald-50 text-emerald-700',
    bar: 'bg-emerald-500',
  },
  {
    key: 'inactive',
    label: 'Inactivos',
    dot: 'bg-slate-400 ring-slate-400/15',
    badge: 'bg-slate-100 text-slate-600',
    bar: 'bg-slate-400',
  },
  {
    key: 'expired',
    label: 'Vencidos',
    dot: 'bg-amber-500 ring-amber-500/15',
    badge: 'bg-amber-50 text-amber-700',
    bar: 'bg-amber-500',
  },
] as const;

function LoadingState() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="mb-3.5 flex items-center gap-2.5 border-b border-slate-200/70 pb-2">
        <div className="h-7 w-7 rounded-lg bg-slate-100" />
        <div className="h-4 w-40 rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-32 rounded-xl bg-slate-100/70" />
        ))}
      </div>
    </div>
  );
}

/** Estados de descuentos con la misma densidad visual que las cards del aplicador. */
export function DiscountStatusSection() {
  const { data: summary, isLoading } = useCentralDiscountSummary();

  if (isLoading) return <LoadingState />;

  const total = (summary?.active ?? 0) + (summary?.inactive ?? 0) + (summary?.expired ?? 0) || 1;

  return (
    <section aria-label="Estados de descuentos">
      <div className="mb-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">Estados de Descuentos</h3>
        </div>
        <span className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] tabular-nums">
          {summary?.total ?? 0} total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUS_ITEMS.map((item) => {
          const value = summary?.[item.key] ?? 0;
          const percentage = Math.round((value / total) * 100);

          return (
            <article
              key={item.key}
              className="rounded-xl border border-slate-200/85 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300/90 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ring-4 ${item.dot}`} aria-hidden="true" />
                  <span className="text-xs font-medium text-slate-500">{item.label}</span>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums ${item.badge}`}>
                  {percentage}%
                </span>
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums text-slate-900">{value}</p>

              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
