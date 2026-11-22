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
          px-5 py-4 sm:px-7 sm:py-5
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

        <div className="relative flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/70 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800">
                Administración TIYUY
              </span>
              <span className="flex items-center gap-1 border-l border-slate-200 pl-2 text-[10px] font-medium text-slate-500">
                <CalendarDays className="h-3 w-3 text-teal-700" aria-hidden="true" />
                <time>{dateLabel}</time>
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              Gestión de grupos y canales<span className="text-teal-700">.</span>
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
              Administra grupos, canales por ciudad, suspensiones y violaciones
              desde un solo lugar.
            </p>
          </div>

          <div className="relative flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-lg border border-teal-100 bg-white/70 px-2.5 py-2 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              <span className="text-[11px] font-semibold text-teal-800">Comunidad</span>
            </div>

            {onCreate ? (
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0b5f58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Crear Grupo
              </button>
            ) : null}
          </div>
        </div>
      </header>
    </section>
  );
}
