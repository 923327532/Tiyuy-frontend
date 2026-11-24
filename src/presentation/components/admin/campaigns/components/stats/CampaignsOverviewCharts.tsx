'use client';

import { useMemo, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { MarketingStats, PromotionCampaign } from '@/core/domain/entities/Admin';
import { Card } from '@/presentation/components/ui/Card';
import {
  CAMPAIGN_STATUS_BY_LABEL,
  CAMPAIGN_STATUS_COLORS,
  CHART_PERIODS,
} from '../../config/campaigns.config';
import {
  campaignsChartOptions,
  getCampaignStatusData,
  getCampaignsPerformanceData,
} from '../../utils/campaignsCharts';
import { formatCompact, formatCompactCurrency } from '../../utils/campaignFormat';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  stats?: MarketingStats | null;
  campaigns: PromotionCampaign[];
  onOpenAllCampaigns: () => void;
  onStatusSelect?: (status: string) => void;
}

export function CampaignsOverviewCharts({
  stats,
  campaigns,
  onOpenAllCampaigns,
  onStatusSelect,
}: Props) {
  const [period, setPeriod] = useState('30D');

  const performanceData = useMemo(
    () => getCampaignsPerformanceData(campaigns, period),
    [campaigns, period]
  );
  const statusChartData = useMemo(
    () => getCampaignStatusData(stats, campaigns),
    [stats, campaigns]
  );
  const statusValues = statusChartData.datasets[0]?.data ?? [];
  const statusTotal = statusValues.reduce((sum, value) => sum + Number(value || 0), 0);

  const topCampaigns = useMemo(
    () =>
      [...campaigns]
        .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
        .slice(0, 4),
    [campaigns]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
      <Card className="col-span-1 lg:col-span-7 p-3 sm:p-6 min-h-[300px] sm:h-[380px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
            Rendimiento de campañas
          </h3>
          <div className="flex gap-1 flex-wrap">
            {CHART_PERIODS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-lg transition-colors ${
                  period === item
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[180px] sm:h-[260px]">
          <Line data={performanceData} options={campaignsChartOptions} />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[10px] sm:text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-teal-500 rounded-full" /> Impresiones
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full" /> Clics
          </span>
        </div>
      </Card>

      <div className="col-span-1 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 min-h-[300px] sm:h-[380px]">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
            Campañas por estado
          </h3>
          <div className="h-20 sm:h-28 flex items-center justify-center relative">
            <Doughnut
              data={statusChartData}
              options={{
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: { legend: { display: false } },
              }}
            />
            <div className="absolute text-center">
              <p className="text-base sm:text-xl font-bold tabular-nums">
                {stats?.totalCampaigns || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">Campañas</p>
            </div>
          </div>
          <div className="space-y-0.5 sm:space-y-1 mt-1.5 sm:mt-2">
            {(statusChartData.labels ?? []).map((label, index) => {
              const value = Number(statusValues[index] || 0);
              const percentage = Math.round((value / (statusTotal || 1)) * 100);
              const code = CAMPAIGN_STATUS_BY_LABEL[String(label)] || String(label);
              return (
                <button
                  key={String(label)}
                  type="button"
                  className="w-full flex items-center justify-between text-[10px] sm:text-xs cursor-pointer hover:bg-gray-50 p-0.5 sm:p-1 rounded"
                  onClick={() => onStatusSelect?.(code)}
                >
                  <span className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CAMPAIGN_STATUS_COLORS[index] || '#9ca3af' }}
                    />
                    <span className="truncate">{label}</span>
                  </span>
                  <span className="text-gray-500 flex-shrink-0 tabular-nums">
                    {value} ({percentage}%)
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-3 sm:p-4 min-h-[300px] sm:h-[380px]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Campañas destacadas</h3>
          </div>
          <p className="text-lg sm:text-2xl font-bold tabular-nums text-gray-900">
            {formatCompact(stats?.totalImpressions ?? 0)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
            Impresiones totales · {formatCompactCurrency(stats?.totalRevenue ?? 0)} invertidos
          </p>
          <div className="space-y-1.5 sm:space-y-2 mt-2 sm:mt-3">
            {topCampaigns.map((campaign, index) => (
              <div key={campaign.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] sm:text-xs font-medium text-gray-600 flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">
                      {campaign.title}
                    </p>
                    <p className="text-[9px] sm:text-xs text-gray-500 truncate">
                      {campaign.ownerName || campaign.ownerRole || 'Sin anunciante'}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-medium flex-shrink-0 tabular-nums">
                  {formatCompact(campaign.impressions ?? 0)}
                </p>
              </div>
            ))}
            {topCampaigns.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-400">Sin datos para mostrar</p>
            )}
          </div>
          <button
            type="button"
            className="w-full mt-2 sm:mt-3 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
            onClick={onOpenAllCampaigns}
          >
            Ver todas las campañas
          </button>
        </Card>
      </div>
    </div>
  );
}
