'use client';

import Link from 'next/link';
import { BellOff } from 'lucide-react';
import type { ActivityItem } from './dashboardTypes';
import { formatFullDate, formatRelativeTime } from './dashboardUtils';

interface DashboardRecentActivityProps {
  items: ActivityItem[];
  isLoading: boolean;
  unreadCount: number;
}

export function DashboardRecentActivity({
  items,
  isLoading,
  unreadCount,
}: DashboardRecentActivityProps) {
  return (
    <section
      className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,46,58,0.04)]"
      aria-labelledby="dashboard-activity-title"
    >
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="dashboard-activity-title" className="text-sm font-semibold text-slate-900">
              Actividad reciente
            </h2>
            {/* El conteo vive en el encabezado: ya no hace falta un pie aparte. */}
            {!isLoading && unreadCount > 0 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-600">
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Últimos avisos registrados en el sistema.
          </p>
        </div>
        <Link
          href="/admin/notifications"
          className="shrink-0 rounded text-xs font-medium text-[#0f2e3a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30"
        >
          Ver todo
        </Link>
      </header>

      {isLoading ? (
        <div className="flex-1 space-y-4 p-5" aria-busy="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-50" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <BellOff className="h-7 w-7 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-slate-700">Sin actividad reciente</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            Cuando existan avisos o eventos aparecerán en esta sección.
          </p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className={`px-5 py-4 ${item.read ? '' : 'bg-slate-50/60'}`}>
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    item.read ? 'bg-slate-300' : 'bg-[#0f2e3a]'
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm text-slate-900 ${
                      item.read ? 'font-medium' : 'font-semibold'
                    }`}
                  >
                    {/* aria-label en un <span> sin rol se ignora; el texto oculto sí se lee. */}
                    <span className="sr-only">{item.read ? 'Leído: ' : 'No leído: '}</span>
                    {item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
                  <time
                    dateTime={item.createdAt}
                    title={formatFullDate(item.createdAt)}
                    className="mt-1 block text-[11px] text-slate-400"
                  >
                    {formatRelativeTime(item.createdAt)}
                  </time>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}