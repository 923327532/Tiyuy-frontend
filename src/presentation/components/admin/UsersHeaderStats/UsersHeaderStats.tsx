
'use client';

import {
  Activity,
  Clock3,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

interface UsersHeaderStatsProps {
  activeUsers: number;
  pendingUsers: number;
  totalUsers?: number;
  activeTrend?: number;
}

function formatCurrentDate(): string {
  const formatted = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value);
}

function isValidNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function UsersHeaderStats({
  activeUsers,
  pendingUsers,
  totalUsers,
  activeTrend,
}: UsersHeaderStatsProps) {
  const validActive = isValidNumber(activeUsers);
  const validPending = isValidNumber(pendingUsers);
  const validTotal =
    totalUsers !== undefined &&
    isValidNumber(totalUsers);

  const hasTotal = validTotal && totalUsers > 0;
  const hasTrend =
    activeTrend !== undefined &&
    Number.isFinite(activeTrend);

  const activePercent =
    hasTotal && validActive
      ? Math.min(100, Math.round((activeUsers / totalUsers) * 100))
      : null;

  const hasPending = validPending && pendingUsers > 0;
  const trendIsPositive = hasTrend && activeTrend >= 0;

  return (
    <section
      aria-label="Resumen de gestión de usuarios"
      className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-[1.5fr_1fr]"
    >
      {/* Encabezado principal */}
      <div className="relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl border border-[#244653] bg-[#102f3b] p-6 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(ellipse_at_right,_rgba(64,115,125,0.20),_transparent_70%)]"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
              <img
                src="/assets/images/logo.svg"
                alt="Tiyuy"
                className="h-5 w-auto brightness-0 invert"
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                TIYUY
              </p>
              <p className="text-xs font-medium text-white">
                Administración
              </p>
            </div>
          </div>

          <span className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-200">
            Usuarios
          </span>
        </div>

        <div className="mt-9">
          <p className="mb-2 text-xs font-medium text-[#a9c4cc]">
            Panel de administración
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Gestión de usuarios
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Administra cuentas, asignación de roles y procesos de
            verificación de propietarios, corredores e inmobiliarias.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            <time>{formatCurrentDate()}</time>
          </div>

          <span className="text-[11px] text-slate-400">
            Control de cuentas y permisos
          </span>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {/* Usuarios activos */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Users
                className="h-5 w-5 text-emerald-700"
                aria-hidden="true"
              />
            </div>

            {hasTrend && (
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold tabular-nums ${
                  trendIsPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
                aria-label={`Variación de usuarios activos: ${activeTrend > 0 ? 'aumento' : activeTrend < 0 ? 'disminución' : 'sin variación'} del ${Math.abs(activeTrend).toFixed(1)} por ciento`}
              >
                {trendIsPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {activeTrend > 0 ? '+' : ''}
                {activeTrend.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Usuarios activos
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {validActive ? formatNumber(activeUsers) : '—'}
              </p>

              {hasTotal && (
                <span className="text-sm text-slate-400">
                  / {formatNumber(totalUsers)}
                </span>
              )}
            </div>

            {activePercent !== null && (
              <div className="mt-4">
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label="Porcentaje de usuarios activos"
                  aria-valuenow={activePercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-[#26745d] transition-[width] duration-500"
                    style={{ width: `${activePercent}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {activePercent}% del total de usuarios
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Usuarios pendientes */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
          <div className="flex items-center justify-between gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                hasPending ? 'bg-amber-50' : 'bg-slate-100'
              }`}
            >
              <Activity
                className={`h-5 w-5 ${
                  hasPending ? 'text-amber-700' : 'text-slate-500'
                }`}
                aria-hidden="true"
              />
            </div>

            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                hasPending
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {validPending
                ? hasPending
                  ? 'Requieren revisión'
                  : 'Al día'
                : 'No disponible'}
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pendientes de revisión
            </p>

            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {validPending ? formatNumber(pendingUsers) : '—'}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {validPending
                ? hasPending
                  ? 'Solicitudes que necesitan atención administrativa.'
                  : 'No hay solicitudes pendientes de revisión.'
                : 'No fue posible obtener este indicador.'}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
