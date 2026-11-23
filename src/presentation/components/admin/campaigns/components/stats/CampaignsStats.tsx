'use client';

import {
  BadgeCheck,
  CircleDollarSign,
  Eye,
  Megaphone,
  MousePointerClick,
  TrendingUp,
} from 'lucide-react';
import type { MarketingStats } from '@/core/domain/entities/Admin';
import { KpiCard } from '@/presentation/components/ui/Card';
import {
  formatCompact,
  formatCompactCurrency,
  formatExactCurrency,
  formatNumber,
} from '../../utils/campaignFormat';

interface Props {
  stats?: MarketingStats | null;
  loading?: boolean;
  onSelectStatus?: (status: string) => void;
  onShowAll?: () => void;
}

export function CampaignsStats({ stats, loading, onSelectStatus, onShowAll }: Props) {
  const totalCampaigns = stats?.totalCampaigns ?? 0;
  const exactInvestment = formatExactCurrency(stats?.totalRevenue ?? 0);
  const conversions = stats?.totalConversions ?? 0;
  const impressions = stats?.totalImpressions ?? 0;
  const conversionRate = stats?.conversionRate ?? (impressions > 0 ? (conversions / impressions) * 100 : 0);

  const kpis = [
    {
      id: 'total-campaigns',
      label: 'Total campañas',
      value: formatNumber(totalCampaigns),
      hint: 'Registradas en la plataforma',
      onClick: onShowAll,
      icon: Megaphone,
      color: 'emerald' as const,
    },
    {
      id: 'active-campaigns',
      label: 'Campañas activas',
      value: formatNumber(stats?.activeCampaigns ?? 0),
      hint: `De ${formatNumber(totalCampaigns)} registradas`,
      onClick: onSelectStatus ? () => onSelectStatus('ACTIVE') : undefined,
      icon: BadgeCheck,
      color: 'cyan' as const,
    },
    {
      id: 'pending-approval',
      label: 'Pendientes de aprobación',
      value: formatNumber(stats?.pendingApproval ?? 0),
      hint: 'Requieren revisión del administrador',
      onClick: onSelectStatus ? () => onSelectStatus('PENDING_APPROVAL') : undefined,
      icon: MousePointerClick,
      color: 'indigo' as const,
    },
    {
      id: 'investment',
      label: 'Inversión total',
      value: formatCompactCurrency(stats?.totalRevenue ?? 0),
      hint: `Valor exacto: ${exactInvestment}`,
      title: exactInvestment,
      icon: CircleDollarSign,
      color: 'sage' as const,
    },
    {
      id: 'impressions',
      label: 'Impresiones',
      value: formatCompact(impressions),
      hint: `${formatNumber(stats?.totalClicks ?? 0)} clics registrados`,
      icon: Eye,
      color: 'slate' as const,
    },
    {
      id: 'conversion-rate',
      label: 'Tasa de conversión',
      value: `${conversionRate.toFixed(2)}%`,
      hint: `${formatNumber(conversions)} conversiones / impresiones`,
      icon: TrendingUp,
      color: 'emerald' as const,
    },
  ];

  return (
    <section aria-label="Indicadores de campañas">
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
              onClick={'onClick' in kpi ? kpi.onClick : undefined}
              title={'title' in kpi ? kpi.title : undefined}
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
