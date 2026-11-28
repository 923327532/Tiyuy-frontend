'use client';

import Link from 'next/link';
import { CalendarDays, Image, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatShortDate } from '@/presentation/components/admin/users/utils/users.utils';

interface Props {
  onRefresh: () => void;
  onCreate: () => void;
  isRefreshing?: boolean;
  activeCount?: number;
  totalCount?: number;
}

export function BannersHeader({
  onRefresh,
  onCreate,
  isRefreshing = false,
  activeCount = 0,
  totalCount = 0,
}: Props) {
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setDateLabel(formatShortDate()), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <header className="users-header-banner relative isolate w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-[#F8FAFC] via-[#F0F7FA] to-[#EDF5F5] px-4 py-3 sm:px-5 sm:py-4">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-1/3 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-200/70 bg-white/70 px-2.5 py-0.5">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800">
              Administración TIYUY
            </span>
            <span className="flex items-center gap-1 border-l border-slate-200 pl-2 text-[10px] font-medium text-slate-500">
              <CalendarDays className="h-3 w-3 text-teal-700" aria-hidden="true" />
              <time>{dateLabel}</time>
            </span>
          </div>

          <h1 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
            Banners Publicitarios<span className="text-teal-700">.</span>
          </h1>
          <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-slate-500">
            Administra las piezas promocionales del carrusel y de cada sección: estado,
            ubicación, vigencia y rendimiento en un solo lugar.
          </p>
        </div>

        <div className="relative flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 shadow-sm shadow-slate-200/30">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <div>
              <p className="text-[11px] font-semibold text-slate-700">
                {activeCount} activos de {totalCount}
              </p>
              <p className="text-[10px] text-slate-400">Banners en línea ahora</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-teal-100 bg-white/70 px-2.5 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-teal-800">Administración</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              Actualizar
            </button>
            <Link
              href="/admin/campaigns"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Image className="h-3.5 w-3.5" aria-hidden="true" />
              Campañas
            </Link>
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f2e3a] px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#164453]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Nuevo banner
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
