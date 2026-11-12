'use client';

import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { AttentionItem, AttentionSeverity } from './dashboardTypes';

interface DashboardAttentionProps {
  items: AttentionItem[];
  /** Pendientes de menor prioridad que quedaron fuera del recorte. */
  overflow?: number;
  isLoading: boolean;
}

const SEVERITY_STYLES: Record<
  AttentionSeverity,
  { dot: string; badge: string; label: string }
> = {
  critical: {
    dot: 'bg-rose-500',
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    label: 'Urgente',
  },
  warning: {
    dot: 'bg-amber-500',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    label: 'Pendiente',
  },
  info: {
    dot: 'bg-slate-400',
    badge: 'border-slate-200 bg-slate-50 text-slate-600',
    label: 'Aviso',
  },
};

const SEVERITY_ORDER: AttentionSeverity[] = ['critical', 'warning', 'info'];

export function DashboardAttention({
  items,
  overflow = 0,
  isLoading,
}: DashboardAttentionProps) {
  const summary = SEVERITY_ORDER.map((severity) => ({
    severity,
    count: items.filter((item) => item.severity === severity).length,
  })).filter((entry) => entry.count > 0);

  return (
    <section
      className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,46,58,0.04)]"
      aria-labelledby="dashboard-attention-title"
    >
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 id="dashboard-attention-title" className="text-sm font-semibold text-slate-900">
            Requiere atención
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Moderación, campañas, descuentos y avisos, del más urgente al menos.
          </p>
        </div>

        {!isLoading && summary.length > 0 && (
          <ul className="flex shrink-0 flex-wrap justify-end gap-1.5">
            {summary.map(({ severity, count }) => (
              <li
                key={severity}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${SEVERITY_STYLES[severity].badge}`}
              >
                {count} {SEVERITY_STYLES[severity].label.toLowerCase()}
                {count > 1 && severity !== 'info' ? 's' : ''}
              </li>
            ))}
          </ul>
        )}
      </header>

      {isLoading ? (
        <div className="space-y-4 p-5" aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 animate-pulse rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-50" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-slate-700">Todo al día</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            No hay moderaciones, campañas ni descuentos que requieran acción inmediata.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            {items.map((item) => {
              const styles = SEVERITY_STYLES[item.severity];

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 px-5 py-4 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0f2e3a]/20"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${styles.dot}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${styles.badge}`}
                        >
                          {item.count}
                          <span className="sr-only"> · {styles.label}</span>
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1 text-xs font-medium text-slate-500 sm:flex">
                      {item.actionLabel}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {overflow > 0 && (
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              {overflow} pendiente(s) más de menor prioridad no se muestran aquí.
            </p>
          )}
        </>
      )}
    </section>
  );
}