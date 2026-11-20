'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Globe2, ShieldCheck } from 'lucide-react';
import { formatShortDate } from '@/presentation/components/admin/users/utils/users.utils';

interface InternationalBannerProps {
  className?: string;
}

export function InternationalBanner({ className = '' }: InternationalBannerProps) {
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setDateLabel(formatShortDate()), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <header
      className={`
        relative isolate w-full min-w-0 overflow-hidden
        rounded-2xl border border-slate-200/80
        bg-gradient-to-r from-[#F8FAFC] via-[#F0F7FA] to-[#EDF5F5]
        px-5 py-6 sm:px-7 sm:py-7
        ${className}
      `}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/3 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl"
      />

      <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/70 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800">
              Verificación de identidad
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Usuarios extranjeros
            <span className="text-teal-700">.</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Revisa documentos y selfies, y aprueba o rechaza solicitudes de verificación de identidad internacional.
          </p>

        </div>

        <div className="relative flex shrink-0 flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm shadow-slate-200/30">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-700">Solicitudes internacionales</p>
              <p className="mt-0.5 text-[10px] text-slate-400">Revisión documental y biométrica</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-white/70 px-3 py-3">
            <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
            <span className="text-xs font-semibold text-teal-800">Control de acceso</span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex items-center gap-2 border-t border-slate-200/70 pt-4 text-xs font-medium text-slate-500">
        <CalendarDays className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
        <time>{dateLabel}</time>
      </div>
    </header>
  );
}
