'use client';

import Link from 'next/link';
import type { DashboardStats } from '@/core/domain/entities/Admin';
import type { SystemStats } from '@/presentation/hooks/useSystemStats';
import { CARD, FOCUS_RING } from './dashboardStyles';
import { formatNumber } from './dashboardUtils';

interface DashboardSecondaryStatsProps {
  stats?: DashboardStats;
  systemStats?: SystemStats;
  systemLoading?: boolean;
  systemUnavailable: boolean;
}

export function DashboardSecondaryStats({
  stats,
  systemStats,
  systemLoading,
  systemUnavailable,
}: DashboardSecondaryStatsProps) {
  const totalProjects = stats?.totalProjects ?? 0;
  const activeProjects = stats?.activeProjects ?? 0;
  const activePct =
    totalProjects > 0 ? Math.min(100, Math.round((activeProjects / totalProjects) * 100)) : 0;

  return (
    <section
      className={`${CARD} grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0`}
      aria-label="Proyectos y comunidad"
    >
      <Link
        href="/admin/projects"
        className={`rounded-t-2xl px-6 py-5 transition hover:bg-slate-50 sm:rounded-l-2xl sm:rounded-tr-none ${FOCUS_RING}`}
      >
        <p className="text-sm font-medium text-slate-900">Proyectos inmobiliarios</p>
        <p className="mt-3 text-3xl font-semibold tabular-nums text-slate-900">
          {formatNumber(stats?.totalProjects)}
        </p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={activePct}
          aria-label={`${activePct}% de proyectos activos`}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"
        >
          <div className="h-full rounded-full bg-[#0f2e3a]" style={{ width: `${activePct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {formatNumber(stats?.activeProjects)} en venta o en construcción activa
        </p>
      </Link>

      <Link
        href="/admin/groups"
        className={`rounded-b-2xl px-6 py-5 transition hover:bg-slate-50 sm:rounded-r-2xl sm:rounded-bl-none ${FOCUS_RING}`}
      >
        <p className="text-sm font-medium text-slate-900">Contactos y grupos</p>
        {systemLoading ? (
          <div className="mt-3 h-9 w-20 animate-pulse rounded bg-slate-100" aria-busy="true" />
        ) : (
          <p
            className={`mt-3 text-3xl font-semibold tabular-nums ${
              systemUnavailable ? 'text-slate-300' : 'text-slate-900'
            }`}
          >
            {systemUnavailable ? '—' : formatNumber(systemStats?.groups.total)}
          </p>
        )}
        <p className="mt-4 text-xs text-slate-500">
          {systemUnavailable
            ? 'No disponible por ahora'
            : `${formatNumber(systemStats?.channels.total)} canales de comunicación`}
        </p>
      </Link>
    </section>
  );
}