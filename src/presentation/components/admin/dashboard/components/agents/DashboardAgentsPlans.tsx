'use client';

import Link from 'next/link';
import { ChevronRight, UserCheck, UserRoundX, TrendingUp, AlertCircle } from 'lucide-react';

import type { DashboardAgentsPlansProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { ChartCard } from '@/presentation/components/ui/Card';

import { formatCurrency, formatNumber, calculateGrowth } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { percent } from './Config';
import { SummaryMetric } from './SummaryMetric';
import { PlanDistribution } from './PlanDistribution';
import { TopAgents } from './TopAgents';

export function DashboardAgentsPlans({ stats, loading, unavailable }: DashboardAgentsPlansProps) {
  const topAgents = (stats?.topAgents.slice(0, 3) ?? []).map((agent) => ({
    ...agent,
    agentId: String(agent.agentId),
  }));

  const growth = stats
    ? calculateGrowth(stats.activeAgents, Number(stats.activeAgentsPrevious ?? 0)) ?? 0
    : 0;

  const isPositiveGrowth = growth >= 0;

  return (
    <ChartCard
      title="Corredores y planes"
      description="Suscripciones, conversión y rendimiento comercial"
      action={
        <Link
          href="/admin/agents"
          className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-[#164E63] transition-colors hover:bg-[#E0F2FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E63]/30"
        >
          Ver corredores
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      }
      loading={loading}
      error={unavailable ? 'No se pudo cargar la información de corredores' : undefined}
    >
      {stats && (
        <div className="animate-agents-entry">
          {/* Métricas principales */}
          <dl className="grid grid-cols-1 gap-3 px-6 pt-4 pb-4">
            <SummaryMetric
              label="Con plan activo"
              value={formatNumber(stats.activeAgents)}
              description={`de ${formatNumber(stats.totalAgents)} corredores`}
              icon={UserCheck}
              iconBackground="bg-[#DCEAE9]"
              iconColor="text-[#36866C]"
            >
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${isPositiveGrowth ? 'text-emerald-600' : 'text-rose-500'}`}>
                {isPositiveGrowth ? '▲' : '▼'} {Math.abs(growth).toFixed(1)}%
                <span className="font-normal text-slate-400">vs mes anterior</span>
              </span>
            </SummaryMetric>

            <SummaryMetric
              label="Conversión a plan"
              value={percent(stats.conversionRate)}
              description={`Anterior: ${percent(stats.conversionRatePrevious)}`}
              icon={TrendingUp}
              iconBackground="bg-[#E8EAF6]"
              iconColor="text-[#7183B8]"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#7183B8]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#7183B8]" aria-hidden="true" />
                Tasa de conversión
              </span>
            </SummaryMetric>

            <SummaryMetric
              label="Sin plan"
              value={formatNumber(stats.freeAgents)}
              description={`${formatCurrency(stats.lostPotentialRevenue ?? 0)} potenciales sin capturar`}
              icon={UserRoundX}
              iconBackground="bg-[#E0F2FE]"
              iconColor="text-[#164E63]"
            >
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                Oportunidad perdida
              </span>
            </SummaryMetric>
          </dl>

          {/* Divider */}
          <div className="mx-6 h-px bg-[#E2EAF0]" />

          {/* Distribución de planes */}
          <PlanDistribution stats={stats} />

          {/* Mejores corredores */}
          <TopAgents topAgents={topAgents} />
        </div>
      )}
    </ChartCard>
  );
}