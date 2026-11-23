'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, RefreshCw } from 'lucide-react';
import type { DashboardHeaderProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { greetingFor } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { formatShortDate } from '@/presentation/components/admin/users/utils/users.utils';

export function DashboardHeader({
  generatedAt,
  isRefreshing,
  onRefresh,
  userName,
}: DashboardHeaderProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [dateLabel, setDateLabel] = useState('');
  useEffect(() => {
    const id = window.setTimeout(() => {
      setNow(new Date());
      setDateLabel(formatShortDate());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const firstName = userName?.trim().split(/\s+/)[0];
  const greeting = now ? greetingFor(now) : 'Hola';

  const updateTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const validUpdate = !!generatedAt;

  return (
    <header className="
      relative isolate w-full min-w-0 overflow-hidden
      rounded-2xl
      border border-slate-200/80
      bg-gradient-to-r from-[#F8FAFC] via-[#F0F7FA] to-[#EDF5F5]
      px-5 py-4 sm:px-7 sm:py-5
    ">
      {/* Decorative accents */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-12 -top-20
          h-56 w-56 rounded-full
          bg-cyan-200/30 blur-3xl
        "
      />

      <div className="
        relative flex min-w-0 flex-col gap-4
        lg:flex-row lg:items-center
        lg:justify-between
      ">
        {/* Welcome */}
        <div className="min-w-0">
          <div className="
            mb-2 inline-flex items-center gap-2
            rounded-full border border-cyan-200/70
            bg-white/70 px-3 py-1
          ">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            <span className="
              text-[10px] font-bold uppercase
              tracking-[0.14em] text-teal-800
            ">
              Administración TIYUY
            </span>
            <span className="flex items-center gap-1 border-l border-slate-200 pl-2 text-[10px] font-medium text-slate-500">
              <CalendarDays className="h-3 w-3 text-teal-700" aria-hidden="true" />
              <time>{dateLabel}</time>
            </span>
          </div>

          <h1 className="
            text-xl font-bold tracking-tight
            text-slate-800 sm:text-2xl
          ">
            {greeting}
            {firstName ? `, ${firstName}` : ''}
            <span className="text-teal-700">.</span>
          </h1>

          <p className="
            mt-1 max-w-xl text-xs
            leading-relaxed text-slate-500
          ">
            Bienvenido a tu centro de administración.
            Supervisa y gestiona la actividad de TIYUY
            desde un solo lugar.
          </p>
        </div>

        {/* Controls */}
        <div className="
          relative flex shrink-0 flex-wrap
          items-center gap-2
        ">
          <div className="
            flex items-center gap-2
            rounded-lg border border-slate-200/80
            bg-white/80 px-3 py-2
            shadow-sm shadow-slate-200/30
          ">
            <span className="
              h-2 w-2 rounded-full
              bg-emerald-500
              ring-4 ring-emerald-100
            " />

            <div>
              <p className="
                text-xs font-semibold text-slate-700
              ">
                {validUpdate ? 'Datos actualizados' : 'Panel administrativo'}
              </p>
              <p className="
                mt-0.5 text-[10px] text-slate-400
              ">
                {updateTime
                  ? `Última actualización: ${updateTime}`
                  : 'Información general'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-busy={isRefreshing}
            className="
              inline-flex min-h-10 items-center
              justify-center gap-2 rounded-lg
              bg-[#164E63] px-4 py-2
              text-xs font-semibold text-white
              shadow-sm shadow-teal-900/10
              transition-all duration-200
              hover:bg-[#0F3D50]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-teal-600
              focus-visible:ring-offset-2
            "
          >
            <RefreshCw className={`
              h-3.5 w-3.5
              ${isRefreshing ? 'animate-spin' : ''}
            `} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>
    </header>
  );
}