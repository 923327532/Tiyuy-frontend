'use client';

import { Building2, Wallet } from 'lucide-react';

import { formatCurrency, formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { safeNumber } from './Config';

interface SalesHeaderProps {
  stats: {
    totalSalesValue?: number;
    soldUnits?: number;
    totalSoldUnits?: number;
    conversionRate?: number;
  };
}

export function SalesHeader({ stats }: SalesHeaderProps) {
  const soldUnits = safeNumber(stats.soldUnits ?? stats.totalSoldUnits);
  const soldRevenue = safeNumber(stats.totalSalesValue);
  const conversionRate = safeNumber(stats.conversionRate);

  return (
    <section className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DCEAE9]">
              <Wallet className="h-4 w-4 text-[#36866C]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Valor de ventas</p>
              <p className="text-xs text-slate-400">Comercialización de unidades</p>
            </div>
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-[#164E63]">
            {formatCurrency(soldRevenue)}
          </p>

          <p className="mt-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{formatNumber(soldUnits)}</span>{' '}
            unidades vendidas
            <span className="mx-1.5 text-slate-300">·</span>
            Conversión{' '}
            <span className="font-semibold text-[#36866C]">{conversionRate.toFixed(1)}%</span>
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0F3]">
          <Building2 className="h-5 w-5 text-[#164E63]" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}