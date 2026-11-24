/** Configuración Chart.js de Campañas, alineada con Agentes/Proyectos. */

import type { MarketingStats, PromotionCampaign } from '@/core/domain/entities/Admin';
import { CAMPAIGN_STATUS_CODES, CAMPAIGN_STATUS_COLORS } from '../config/campaigns.config';
import { CAMPAIGN_STATUS_LABELS } from '../config/campaigns.config';
import { formatCompact, parseCampaignDate } from './campaignFormat';

const PERIOD_BUCKETS: Record<string, number> = {
  '7D': 7,
  '30D': 30,
  '3M': 3,
  '6M': 6,
  '1A': 12,
};

function bucketsForPeriod(period: string) {
  const now = new Date();
  const count = PERIOD_BUCKETS[period] ?? 30;
  const monthly = ['3M', '6M', '1A'].includes(period);
  return Array.from({ length: count }, (_, index) => {
    if (monthly) {
      const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
      return {
        date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
        label: date.toLocaleString('es-PE', { month: 'short' }).replace('.', ''),
      };
    }
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (count - 1 - index));
    return {
      date,
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      label: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
    };
  });
}

export function getCampaignsPerformanceData(campaigns: PromotionCampaign[], period: string) {
  const buckets = bucketsForPeriod(period);
  const values = buckets.map(() => ({ impressions: 0, clicks: 0, conversions: 0 }));

  campaigns.forEach((campaign) => {
    const date = parseCampaignDate(campaign.startDate ?? campaign.createdAt);
    if (!date) return;
    const index = buckets.findIndex((bucket) => date >= bucket.date && date < bucket.end);
    if (index < 0) return;
    values[index].impressions += campaign.impressions ?? 0;
    values[index].clicks += campaign.clicks ?? 0;
    values[index].conversions += campaign.conversions ?? 0;
  });

  return {
    labels: buckets.map((bucket) => bucket.label),
    datasets: [
      {
        label: 'Impresiones',
        data: values.map((item) => item.impressions),
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Clics',
        data: values.map((item) => item.clicks),
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };
}

export const campaignsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) =>
          `${context.dataset.label}: ${formatCompact(Number(context.parsed.y ?? 0))}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 11 }, maxTicksLimit: 8 },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value: any) => formatCompact(Number(value)),
      },
    },
  },
};

export function getCampaignStatusData(
  stats?: MarketingStats | null,
  campaigns: PromotionCampaign[] = []
) {
  const source = stats?.campaignsByStatus;
  const labels = CAMPAIGN_STATUS_CODES.map((code) => CAMPAIGN_STATUS_LABELS[code] ?? code);
  const values = CAMPAIGN_STATUS_CODES.map((code) => {
    if (source && Object.keys(source).length > 0) return Number(source[code] ?? 0);
    return campaigns.filter((campaign) => campaign.status === code).length;
  });
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: CAMPAIGN_STATUS_COLORS,
        borderWidth: 0,
      },
    ],
  };
}
