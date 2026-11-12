'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { FinanceStats, MarketingStats } from '@/core/domain/entities/Admin';
import { CARD, FOCUS_RING } from './dashboardStyles';
import type { RevenueSeriesPoint } from './dashboardTypes';
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from './dashboardUtils';

interface DashboardRevenueCardProps {
  finance?: FinanceStats;
  marketing?: MarketingStats;
  canViewMarketing: boolean;
  financeUnavailable: boolean;
  financeLoading?: boolean;
  /** Historial mensual de ingresos. Si no llega, se muestra un estado vacío. */
  series?: RevenueSeriesPoint[];
}

export function DashboardRevenueCard({
  finance,
  marketing,
  canViewMarketing,
  financeUnavailable,
  financeLoading,
  series,
}: DashboardRevenueCardProps) {
  if (financeLoading) {
    return (
      <section className={`${CARD} animate-pulse p-6`} aria-busy="true">
        <div className="h-4 w-24 rounded bg-slate-100" />
        <div className="mt-4 h-10 w-48 rounded bg-slate-100" />
        <div className="mt-6 h-28 rounded-xl bg-slate-50" />
      </section>
    );
  }

  const bigNumber = financeUnavailable ? '—' : formatCurrency(finance?.revenueThisMonth);

  return (
    <section className={`${CARD} p-6`} aria-labelledby="revenue-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="revenue-title" className="text-base font-semibold text-slate-900">
            Ingresos
          </h2>
          <p className="text-xs text-slate-500">Mes en curso</p>
        </div>
        <Link
          href="/admin/finance"
          className={`inline-flex items-center gap-0.5 rounded text-sm font-medium text-[#0f2e3a] hover:underline ${FOCUS_RING}`}
        >
          Ver finanzas
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end">
        <div>
          <p className="text-xs text-slate-500">Ingresos del mes</p>
          <p
            className={`mt-1 text-4xl font-semibold tabular-nums tracking-tight ${
              financeUnavailable ? 'text-slate-300' : 'text-slate-900'
            }`}
          >
            {bigNumber}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {financeUnavailable
              ? 'No se pudo cargar la información financiera.'
              : `${formatCurrency(finance?.revenueToday)} generados hoy`}
          </p>
        </div>

        <RevenueBars series={series} />
      </div>

      <dl className="mt-6 grid divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Metric
          label="Cobrado hoy"
          value={financeUnavailable ? '—' : formatCurrency(finance?.revenueToday)}
        />
        <Metric
          label="Suscripciones activas"
          value={financeUnavailable ? '—' : formatNumber(finance?.activeSubscriptions)}
          hint={
            financeUnavailable
              ? undefined
              : `de ${formatNumber(finance?.totalSubscriptions)} registradas`
          }
        />
        <Metric
          label="Leads de campañas"
          value={canViewMarketing ? formatNumber(marketing?.totalLeads) : '—'}
          hint={canViewMarketing ? undefined : 'Requiere rol administrador'}
        />
      </dl>
    </section>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="px-0 py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function RevenueBars({ series }: { series?: RevenueSeriesPoint[] }) {
  if (!series || series.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center">
        <p className="text-xs text-slate-500">
          Cuando haya historial mensual, aquí verás cómo evolucionan tus ingresos.
        </p>
      </div>
    );
  }

  const max = Math.max(...series.map((point) => point.value), 1);
  const lastIndex = series.length - 1;

  return (
    <div
      role="img"
      aria-label={`Ingresos por mes: ${series
        .map((point) => `${point.label} ${formatCompactCurrency(point.value)}`)
        .join(', ')}`}
      className="flex h-32 items-end justify-between gap-2 sm:gap-3"
    >
      {series.map((point, index) => {
        const isLast = index === lastIndex;
        const height = Math.max(8, Math.round((point.value / max) * 100));

        return (
          <div key={point.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            {isLast && (
              <span className="rounded-md bg-[#0f2e3a] px-2 py-0.5 text-[11px] font-medium tabular-nums text-white">
                {formatCompactCurrency(point.value)}
              </span>
            )}
            <div
              className={`w-full max-w-9 rounded-t-md ${isLast ? 'bg-[#0f2e3a]' : 'bg-slate-200'}`}
              style={{ height: `${height}%` }}
            />
            <span className="text-[11px] text-slate-500">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}