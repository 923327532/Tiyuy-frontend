'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Plus, ShieldCheck } from 'lucide-react';
import { formatShortDate } from '@/presentation/components/admin/users/utils/users.utils';

interface GroupsHeaderProps {
  className?: string;
  onCreate?: () => void;
}

export function GroupsHeader({ className = '', onCreate }: GroupsHeaderProps) {
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setDateLabel(formatShortDate()), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section aria-label="Encabezado de gestión de grupos y canales" className={`users-header ${className}`.trim()}>
      <header
        className="
          users-header-banner relative isolate w-full min-w-0 overflow-hidden
          rounded-2xl border border-slate-200/80
          bg-gradient-to-r from-[#F8FAFC] via-[#F0F7FA] to-[#EDF5F5]
          px-5 py-6 sm:px-7 sm:py-7
        "
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/3 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl"
        />

        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/70 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800">
                Administración TIYUY
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Gestión de grupos y canales<span className="text-teal-700">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Administra grupos, canales por ciudad, suspensiones y violaciones
              desde un solo lugar.
            </p>
          </div>

          <div className="relative flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2.5 rounded-xl border border-teal-100 bg-white/70 px-3.5 py-2.5 sm:flex">
              <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span className="text-xs font-semibold text-teal-800">Comunidad</span>
            </div>

            {onCreate ? (
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0b5f58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Crear Grupo
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative mt-6 flex items-center gap-2 border-t border-slate-200/70 pt-4 text-xs font-medium text-slate-500">
          <CalendarDays className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
          <time>{dateLabel}</time>
        </div>
      </header>
    </section>
  );
}
