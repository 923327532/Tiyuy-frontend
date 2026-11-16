'use client';

import { AlertTriangle } from 'lucide-react';

import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';

interface PublishedStatusProps {
  published: number;
  total: number;
  publishedPct: number;
}

export function PublishedStatus({ published, total, publishedPct }: PublishedStatusProps) {
  return (
    <div className="border-t border-[#E2EAF0] px-4 py-5">
      {/* Estado de moderación */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F0F3]">
            <AlertTriangle className="h-4 w-4 text-[#164E63]" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Estado de publicaciones</h3>
            <p className="text-xs text-slate-500">Inventario publicado</p>
          </div>
        </div>

        <span className="rounded-full bg-[#DCEAE9] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#36866C]">
          {publishedPct}%
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">Propiedades publicadas</span>
        <span className="tabular-nums text-slate-700 shrink-0">
          <span className="font-semibold text-slate-900">{formatNumber(published)}</span>
          {' de '}
          {formatNumber(total)}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={publishedPct}
        aria-label={`${publishedPct}% de propiedades publicadas`}
        className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8F0F3]"
      >
        <div
          className="moderation-progress-bar h-full rounded-full bg-[#164E63]"
          style={{ width: `${publishedPct}%` }}
        />
      </div>
    </div>
  );
}