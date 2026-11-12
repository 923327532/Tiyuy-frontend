'use client';

import { RefreshCw, TriangleAlert } from 'lucide-react';
import { getErrorMessage } from './dashboardUtils';

/** El esqueleto replica el orden real: accesos → atención/actividad → KPIs. */
export function DashboardLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Cargando resumen…</span>

      <div className="space-y-3 border-b border-slate-200 pb-5">
        <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-80 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-9 w-36 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
          <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 rounded bg-slate-50" />
              ))}
            </div>
          </div>
        </div>
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
          <div className="h-4 w-36 rounded bg-slate-100" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 rounded bg-slate-50" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="mt-3 h-7 w-20 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface DashboardErrorProps {
  error: unknown;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function DashboardError({ error, onRetry, isRetrying }: DashboardErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div
        role="alert"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <TriangleAlert className="h-6 w-6 text-rose-600" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          No se pudo cargar el resumen
        </h2>
        <p className="mt-1 text-sm text-slate-500">{getErrorMessage(error)}</p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0f2e3a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#164453] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/40 focus-visible:ring-offset-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isRetrying ? 'Reintentando…' : 'Reintentar'}
        </button>
      </div>
    </div>
  );
}