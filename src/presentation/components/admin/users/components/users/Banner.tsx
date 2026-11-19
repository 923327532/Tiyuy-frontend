'use client';

import { useEffect, useState } from 'react';

import { CalendarDays, ShieldCheck } from 'lucide-react';

import { formatShortDate } from '@/presentation/components/admin/users/utils/users.utils';

interface BannerProps {
  className?: string;
}

export function Banner({ className = '' }: BannerProps) {
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setDateLabel(formatShortDate()), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <header
      className={`
        users-header-banner
        relative isolate w-full min-w-0 overflow-hidden
        rounded-2xl border border-slate-200/80
        bg-gradient-to-r from-[#F8FAFC] via-[#F0F7FA] to-[#EDF5F5]
        px-5 py-6 sm:px-7 sm:py-7
        ${className}
      `}
    >
      {/* Decoración ambiental */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-12 -top-20
          h-56 w-56 rounded-full
          bg-cyan-200/30 blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -bottom-24 right-1/3
          h-40 w-40 rounded-full
          bg-emerald-200/20 blur-3xl
        "
      />

      <div className="
        relative flex min-w-0 flex-col gap-6
        lg:flex-row lg:items-center lg:justify-between
      ">
        {/* Identidad y bienvenida */}
        <div className="min-w-0">
          <div className="
            mb-3 inline-flex items-center gap-2
            rounded-full border border-cyan-200/70
            bg-white/70 px-3 py-1.5
          ">
            <span className="h-2 w-2 rounded-full bg-teal-600" />

            <span className="
              text-[10px] font-bold uppercase
              tracking-[0.14em] text-teal-800
            ">
              Administración TIYUY
            </span>
          </div>

          <h1 className="
            text-2xl font-bold tracking-tight
            text-slate-800 sm:text-3xl
          ">
            Gestión de usuarios
            <span className="text-teal-700">.</span>
          </h1>

          <p className="
            mt-2 max-w-xl text-sm
            leading-relaxed text-slate-500
          ">
            Administra cuentas, asignación de roles y procesos
            de verificación de propietarios, corredores e
            inmobiliarias desde un solo lugar.
          </p>

        </div>

        {/* Estado del módulo */}
        <div className="
          relative flex shrink-0 flex-wrap
          items-center gap-3
        ">
          <div className="
            flex items-center gap-3
            rounded-xl border border-slate-200/80
            bg-white/80 px-4 py-3
            shadow-sm shadow-slate-200/30
          ">
            <span className="
              h-2.5 w-2.5 rounded-full
              bg-emerald-500 ring-4 ring-emerald-100
            " />

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Gestión de cuentas
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Control de usuarios y permisos
              </p>
            </div>
          </div>

          <div className="
            flex items-center gap-2 rounded-xl
            border border-teal-100 bg-white/70
            px-3 py-3
          ">
            <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
            <span className="text-xs font-semibold text-teal-800">
              Administración
            </span>
          </div>
        </div>
      </div>

      {/* Pie informativo */}
      <div className="relative mt-6 flex items-center gap-2 border-t border-slate-200/70 pt-4 text-xs font-medium text-slate-500">
        <CalendarDays className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
        <time>{dateLabel}</time>
      </div>
    </header>
  );
}