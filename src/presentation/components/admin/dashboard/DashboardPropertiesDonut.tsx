'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { DashboardStats } from '@/core/domain/entities/Admin';
import { CARD, FOCUS_RING } from './dashboardStyles';
import { formatNumber } from './dashboardUtils';

interface DashboardPropertiesDonutProps {
  stats?: DashboardStats;
  /** propiedades por estado, tal como lo entrega la analítica (clave = enum del backend). */
  byStatus?: Record<string, number>;
}

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Agrupa los 10 estados del backend en las etapas con las que
 * piensa un administrador inmobiliario.
 */
const STAGES = [
  { id: 'published', label: 'Publicadas', hint: 'Visibles en el portal', statuses: ['PUBLISHED'], color: '#06b6d4' },
  { id: 'pending', label: 'En revisión', hint: 'Esperan moderación', statuses: ['PENDING'], color: '#f59e0b' },
  { id: 'closed', label: 'Cerradas', hint: 'Vendidas o alquiladas', statuses: ['SOLD', 'RENTED'], color: '#0f2e3a' },
] as const;

function sumStatuses(byStatus: Record<string, number>, statuses: readonly string[]): number {
  return statuses.reduce((sum, status) => sum + (byStatus[status] ?? 0), 0);
}

export function DashboardPropertiesDonut({ stats, byStatus }: DashboardPropertiesDonutProps) {
  const source: Record<string, number> = byStatus ?? {
    PUBLISHED: stats?.publishedProperties ?? 0,
    PENDING: stats?.pendingProperties ?? 0,
  };

  const grouped = STAGES.map((stage) => ({
    ...stage,
    value: sumStatuses(source, stage.statuses),
  }));

  const total = byStatus
    ? Object.values(byStatus).reduce((sum, value) => sum + (value ?? 0), 0)
    : stats?.totalProperties ?? 0;

  const inactive = Math.max(0, total - grouped.reduce((sum, stage) => sum + stage.value, 0));

  const segments = [
    ...grouped,
    {
      id: 'inactive',
      label: byStatus ? 'Inactivas' : 'Otras',
      hint: byStatus ? 'Borrador, pausadas, rechazadas o vencidas' : 'Otros estados',
      value: inactive,
      color: '#cbd5e1',
    },
  ];

  let offset = 0;

  return (
    <section className={`${CARD} p-6`} aria-labelledby="portfolio-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="portfolio-title" className="text-base font-semibold text-slate-900">
            Cartera de publicaciones
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Dónde está cada propiedad hoy</p>
        </div>
        <Link
          href="/admin/properties"
          className={`inline-flex shrink-0 items-center gap-0.5 rounded text-sm font-medium text-[#0f2e3a] hover:underline ${FOCUS_RING}`}
        >
          Ver todas
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap">
        <div className="relative h-40 w-40 shrink-0">
          <svg
            viewBox="0 0 180 180"
            className="h-full w-full"
            role="img"
            aria-label={`${formatNumber(total)} propiedades: ${segments
              .map((s) => `${s.value} ${s.label.toLowerCase()}`)
              .join(', ')}`}
          >
            <g transform="rotate(-90 90 90)">
              <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth="16" />
              {total > 0 &&
                segments.map((segment) => {
                  if (segment.value <= 0) return null;
                  const length = (segment.value / total) * CIRCUMFERENCE;
                  const circle = (
                    <circle
                      key={segment.id}
                      cx="90"
                      cy="90"
                      r={RADIUS}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="16"
                      strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                      strokeDashoffset={-offset}
                    />
                  );
                  offset += length;
                  return circle;
                })}
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-semibold tabular-nums text-slate-900">{formatNumber(total)}</p>
            <p className="text-xs text-slate-500">propiedades</p>
          </div>
        </div>

        {/* Tabla tipo libro: etapa, detalle y cantidad alineada a la derecha. */}
        <dl className="w-full min-w-0 divide-y divide-slate-100 text-sm">
          {segments.map((segment) => {
            const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
            return (
              <div key={segment.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="font-medium text-slate-900">{segment.label}</dt>
                    <p className="truncate text-xs text-slate-500">{segment.hint}</p>
                  </div>
                </div>
                <dd className="shrink-0 text-right tabular-nums">
                  <span className="font-semibold text-slate-900">{formatNumber(segment.value)}</span>
                  <span className="ml-1.5 text-xs text-slate-500">{pct}%</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}