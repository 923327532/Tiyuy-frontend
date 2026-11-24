'use client';

import { BarChart3, Calendar, DollarSign, TrendingUp, UserCheck, Users } from 'lucide-react';
import type { AgentDashboardStats } from '@/core/domain/entities/Admin';
import { KpiCard } from '@/presentation/components/ui/Card';

interface Props {
  stats?: AgentDashboardStats | null;
  loading?: boolean;
  onSelectStatus?: (status: string) => void;
  onSelectPlan?: (plan: string) => void;
}

function formatCurrency(n: number) {
  return `$${(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function formatNumber(n: number) {
  return (n || 0).toLocaleString('es-PE');
}
function growth(current: number, previous: number): number | undefined {
  if (!previous) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function AgentsStats({ stats, loading, onSelectStatus, onSelectPlan }: Props) {
  const s = stats;

  const kpis = [
    {
      id: 'total-revenue',
      label: 'Ingresos totales (plataforma)',
      value: formatCurrency(s?.totalRevenue || 0),
      hint: 'Últimos 30 días',
      href: '/admin/finance',
      icon: DollarSign,
      growth: growth(s?.totalRevenue || 0, s?.totalRevenuePrevious || 0),
      color: 'emerald' as const,
    },
    {
      id: 'monthly-revenue',
      label: 'Ingresos del mes',
      value: formatCurrency(s?.monthlyRevenue || 0),
      hint: 'Comparado con mes anterior',
      href: '/admin/finance',
      icon: Calendar,
      growth: growth(s?.monthlyRevenue || 0, s?.monthlyRevenuePrevious || 0),
      color: 'cyan' as const,
    },
    {
      id: 'weekly-revenue',
      label: 'Ingresos de la semana',
      value: formatCurrency(s?.weeklyRevenue || 0),
      hint: 'Comparado con semana anterior',
      href: '/admin/finance',
      icon: BarChart3,
      growth: growth(s?.weeklyRevenue || 0, s?.weeklyRevenuePrevious || 0),
      color: 'indigo' as const,
    },
    {
      id: 'active-agents',
      label: 'Agentes con plan activo',
      value: formatNumber(s?.activeAgents || 0),
      hint: `De ${formatNumber(s?.totalAgents || 0)} registrados`,
      onClick: onSelectStatus ? () => onSelectStatus('active') : undefined,
      icon: Users,
      growth: growth(s?.activeAgents || 0, s?.activeAgentsPrevious || 0),
      color: 'sage' as const,
    },
    {
      id: 'conversion-rate',
      label: 'Tasa de conversión',
      value: `${(s?.conversionRate || 0).toFixed(1)}%`,
      hint: 'De registros a pagos',
      icon: TrendingUp,
      growth: growth(s?.conversionRate || 0, s?.conversionRatePrevious || 0),
      color: 'slate' as const,
    },
    {
      id: 'free-agents',
      label: 'Agentes Free',
      value: formatNumber(s?.freeAgents || 0),
      hint: 'Sin plan activo',
      onClick: onSelectPlan ? () => onSelectPlan('FREE') : undefined,
      icon: UserCheck,
      growth: growth(s?.freeAgents || 0, s?.freeAgentsPrevious || 0),
      color: 'emerald' as const,
    },
  ];

  return (
    <section aria-label="Indicadores de agentes">
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <KpiCard
              key={kpi.id}
              icon={<Icon className="h-5 w-5" aria-hidden="true" />}
              value={kpi.value}
              label={kpi.label}
              hint={kpi.hint}
              growth={kpi.growth}
              href={'href' in kpi ? kpi.href : undefined}
              onClick={'onClick' in kpi ? kpi.onClick : undefined}
              loading={loading}
              color={kpi.color}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
}
