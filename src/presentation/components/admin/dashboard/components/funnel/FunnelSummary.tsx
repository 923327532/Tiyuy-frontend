'use client';

import { TrendingUp, Activity } from 'lucide-react';
import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import type { MarketingStats } from '@/core/domain/entities/Admin';
import { SummaryMetric } from './SummaryMetric';

interface FunnelSummaryProps {
  marketing: MarketingStats;
}

export function FunnelSummary({ marketing }: FunnelSummaryProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-[#E2EAF0] bg-[#F8FAFC] p-4 sm:grid-cols-2">
      <SummaryMetric
        label="CTR promedio"
        value={`${(marketing.averageCTR ?? 0).toLocaleString('es-PE', { maximumFractionDigits: 2 })}%`}
        icon={TrendingUp}
        color="bg-[#E8EAF6] text-[#5965A8]"
      />
      <SummaryMetric
        label="Campañas activas"
        value={formatNumber(marketing.activeCampaigns)}
        icon={Activity}
        color="bg-[#DCEAE9] text-[#477A72]"
      />
    </div>
  );
}