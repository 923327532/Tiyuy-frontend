'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { DashboardCampaignFunnelProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { ChartCard } from '@/presentation/components/ui/Card';

import { FunnelStage } from './FunnelStage';
import { FunnelHeader } from './FunnelHeader';
import { FunnelSummary } from './FunnelSummary';
import { FunnelFootnote } from './FunnelFootnote';
import { STAGES } from './StagesConfig';
import type { MarketingStats } from '@/core/domain/entities/Admin';

export function DashboardCampaignFunnel({
  marketing,
  loading,
  unavailable,
}: DashboardCampaignFunnelProps) {
  const stages = [
    { ...STAGES[0], value: marketing?.totalImpressions ?? 0 },
    { ...STAGES[1], value: marketing?.totalClicks ?? 0 },
    { ...STAGES[2], value: marketing?.totalLeads ?? 0 },
    { ...STAGES[3], value: marketing?.totalConversions ?? 0 },
  ];

  const calculatedStages = stages.map((stage, index, all) => {
    const previous = index === 0 ? stage.value : all[index - 1].value;
    const rate = index === 0 ? 100 : previous > 0 ? Math.min(100, (stage.value / previous) * 100) : 0;
    return { ...stage, rate };
  });

  const hasMarketingData = Boolean(marketing);

  return (
    <ChartCard
      title="Embudo de campañas"
      description="Del alcance a la conversión. Rendimiento de campañas promocionales."
      action={
        <Link
          href="/admin/campaigns"
          className="
            inline-flex shrink-0 items-center gap-1
            rounded-lg px-2 py-1.5
            text-xs font-semibold text-[#164E63]
            transition-colors duration-200
            hover:bg-[#E0F2FE]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#164E63]/40
          "
        >
          Ver campañas
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      }
      loading={loading}
      error={unavailable ? 'No se pudo cargar esta información. Usa Actualizar para reintentar.' : undefined}
    >
      {hasMarketingData && !unavailable && (
        <div className="mt-5 space-y-5 animate-funnel-entry">
          {/* TOP SUMMARY */}
          <FunnelHeader marketing={marketing as MarketingStats} />

          {/* FUNNEL STAGES */}
          <section aria-label="Etapas del embudo">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-xs font-semibold text-slate-700">Etapas de conversión</h4>
              <span className="text-[10px] text-slate-400">Tasa entre etapas</span>
            </div>
            <ol className="space-y-2">
              {calculatedStages.map((stage, index) => (
                <FunnelStage
                  key={stage.id}
                  stage={stage}
                  index={index}
                  value={stage.value}
                  rate={stage.rate}
                />
              ))}
            </ol>
          </section>

          {/* PERFORMANCE SUMMARY */}
          <FunnelSummary marketing={marketing as MarketingStats} />

          {/* FOOTNOTE */}
          <FunnelFootnote />
        </div>
      )}
    </ChartCard>
  );
}