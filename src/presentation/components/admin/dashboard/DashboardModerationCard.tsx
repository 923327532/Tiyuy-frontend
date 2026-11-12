'use client';

import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';
import type { DashboardStats } from '@/core/domain/entities/Admin';
import { CARD, FOCUS_RING } from './dashboardStyles';
import { formatNumber } from './dashboardUtils';

interface DashboardModerationCardProps {
  stats?: DashboardStats;
  expiredFeatured?: number;
  propertyUnavailable: boolean;
}

interface QueueRow {
  id: string;
  title: string;
  detail: string;
  count: number | undefined;
  href: string;
  /** Clases del indicador cuando hay pendientes. */
  badge: string;
}

export function DashboardModerationCard({
  stats,
  expiredFeatured,
  propertyUnavailable,
}: DashboardModerationCardProps) {
  const rows: QueueRow[] = [
    {
      id: 'pending',
      title: 'Publicaciones por moderar',
      detail: 'Esperan aprobación para salir al mercado',
      count: stats?.pendingProperties,
      href: '/admin/properties',
      badge: 'bg-amber-50 text-amber-800 ring-amber-200',
    },
    {
      id: 'reports',
      title: 'Reportes de usuarios',
      detail: 'Avisos denunciados por datos falsos o duplicados',
      count: stats?.pendingReports,
      href: '/admin/properties',
      badge: 'bg-rose-50 text-rose-800 ring-rose-200',
    },
    {
      id: 'featured',
      title: 'Destacados vencidos',
      detail: 'Siguen ocupando un cupo que podrías vender',
      count: propertyUnavailable ? undefined : expiredFeatured,
      href: '/admin/properties',
      badge: 'bg-slate-100 text-slate-700 ring-slate-200',
    },
  ];

  const total = stats?.totalProperties ?? 0;
  const published = stats?.publishedProperties ?? 0;
  const publishedPct = total > 0 ? Math.min(100, Math.round((published / total) * 100)) : 0;
  const open = rows.reduce((sum, row) => sum + (row.count ?? 0), 0);

  return (
    <section className={`${CARD} flex flex-col overflow-hidden`} aria-labelledby="moderation-title">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <h2 id="moderation-title" className="text-base font-semibold text-slate-900">
            Cola de revisión
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Publicaciones y reportes sin resolver</p>
        </div>
        {open > 0 && (
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium tabular-nums text-white">
            {formatNumber(open)} abiertos
          </span>
        )}
      </header>

      <ul className="divide-y divide-slate-100">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={row.href}
              className={`group flex items-center justify-between gap-4 px-6 py-3.5 transition hover:bg-slate-50 ${FOCUS_RING}`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{row.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{row.detail}</p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {row.count === undefined ? (
                  <span className="text-sm text-slate-300" aria-label="Sin datos">
                    —
                  </span>
                ) : row.count > 0 ? (
                  <span
                    className={`min-w-9 rounded-md px-2 py-1 text-center text-sm font-semibold tabular-nums ring-1 ring-inset ${row.badge}`}
                  >
                    {formatNumber(row.count)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Al día
                  </span>
                )}
                <ChevronRight
                  className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-auto border-t border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between gap-3 text-xs">
          <span className="text-slate-500">Propiedades publicadas</span>
          <span className="tabular-nums text-slate-700">
            <span className="font-semibold text-slate-900">{publishedPct}%</span>
            {' · '}
            {formatNumber(published)} de {formatNumber(total)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={publishedPct}
          aria-label={`${publishedPct}% de propiedades publicadas`}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
        >
          <div className="h-full rounded-full bg-[#0f2e3a]" style={{ width: `${publishedPct}%` }} />
        </div>
      </footer>
    </section>
  );
}