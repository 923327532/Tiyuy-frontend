'use client';

import { PackageCheck } from 'lucide-react';

import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { safeNumber, clamp } from './Config';

interface UnitsDistributionProps {
  stats: {
    totalUnits?: number;
    soldUnits?: number;
    totalSoldUnits?: number;
    availableUnits?: number;
    totalAvailableUnits?: number;
  };
}

export function UnitsDistribution({ stats }: UnitsDistributionProps) {
  const totalUnits = safeNumber(stats.totalUnits);
  const soldUnits = safeNumber(stats.soldUnits ?? stats.totalSoldUnits);
  const availableUnits = safeNumber(stats.availableUnits ?? stats.totalAvailableUnits);
  const otherUnits = Math.max(0, totalUnits - soldUnits - availableUnits);
  const distributionTotal = Math.max(totalUnits, soldUnits + availableUnits);

  const soldPct = distributionTotal > 0 ? clamp((soldUnits / distributionTotal) * 100) : 0;
  const availablePct = distributionTotal > 0 ? clamp((availableUnits / distributionTotal) * 100) : 0;
  const otherPct = distributionTotal > 0 ? clamp((otherUnits / distributionTotal) * 100) : 0;

  return (
    <section className="border-t border-[#E2EAF0] px-6 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F0F3]">
            <PackageCheck className="h-4 w-4 text-[#164E63]" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Distribución de unidades</h3>
            <p className="text-xs text-slate-500">Estado comercial del inventario</p>
          </div>
        </div>
        <span className="rounded-full bg-[#E0F2FE] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#164E63]">
          {formatNumber(totalUnits)} total
        </span>
      </div>

      <div
        className="flex h-3 overflow-hidden rounded-full bg-[#EDF2F5]"
        role="img"
        aria-label={`${formatNumber(soldUnits)} vendidas, ${formatNumber(availableUnits)} disponibles y ${formatNumber(otherUnits)} otras, de ${formatNumber(totalUnits)} unidades`}
      >
        {soldUnits > 0 && (
          <div className="projects-unit-segment bg-[#164E63]" style={{ width: `${soldPct}%`, animationDelay: '0ms' }} />
        )}
        {availableUnits > 0 && (
          <div className="projects-unit-segment bg-[#61988C]" style={{ width: `${availablePct}%`, animationDelay: '100ms' }} />
        )}
        {otherUnits > 0 && (
          <div className="projects-unit-segment bg-[#CBD5E1]" style={{ width: `${otherPct}%`, animationDelay: '200ms' }} />
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#164E63]" />
          <div className="min-w-0">
            <dt className="text-xs text-slate-500">Vendidas</dt>
            <dd className="text-sm font-semibold tabular-nums text-slate-800">{formatNumber(soldUnits)}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#61988C]" />
          <div className="min-w-0">
            <dt className="text-xs text-slate-500">Disponibles</dt>
            <dd className="text-sm font-semibold tabular-nums text-slate-800">{formatNumber(availableUnits)}</dd>
          </div>
        </div>
        {otherUnits > 0 && (
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#CBD5E1]" />
            <div className="min-w-0">
              <dt className="text-xs text-slate-500">Otras</dt>
              <dd className="text-sm font-semibold tabular-nums text-slate-800">{formatNumber(otherUnits)}</dd>
            </div>
          </div>
        )}
      </dl>
    </section>
  );
}