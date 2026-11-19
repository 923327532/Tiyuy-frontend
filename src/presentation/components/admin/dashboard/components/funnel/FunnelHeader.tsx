'use client';

import { Megaphone } from 'lucide-react';
import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import type { MarketingStats } from '@/core/domain/entities/Admin';

interface FunnelHeaderProps {
  marketing: MarketingStats;
}

export function FunnelHeader({ marketing }: FunnelHeaderProps) {
  return (
    <div className="
      flex flex-wrap items-center justify-between gap-3
      rounded-xl border border-[#DCEAE9]
      bg-gradient-to-r from-[#F0F7FA] to-[#F8FAFC] p-4
    ">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE]">
          <Megaphone className="h-5 w-5 text-[#164E63]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#164E63]">Rendimiento de campañas</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Seguimiento de las etapas comerciales</p>
        </div>
      </div>
      <div className="rounded-lg border border-[#DCEAE9] bg-[#F8FAFC] px-3 py-2">
        <p className="text-[10px] text-slate-400">Campañas activas</p>
        <p className="text-lg font-bold text-[#164E63] tabular-nums">{formatNumber(marketing.activeCampaigns)}</p>
      </div>
    </div>
  );
}