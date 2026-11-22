'use client';

import { Line, Doughnut } from 'react-chartjs-2';
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
import type { AgentDashboardStats } from '@/core/domain/entities/Admin';
import { Card } from '@/presentation/components/ui/Card';
import { CHART_PERIODS, PLAN_CODES, PLAN_COLORS } from '../../config/agents.config';
import { revenueChartOptions } from '../../utils/agentsCharts';
import type { getRevenueChartData, getPlanDistributionData } from '../../utils/agentsCharts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

interface AgentsOverviewChartsProps {
  stats?: AgentDashboardStats;
  revenueChartData: ReturnType<typeof getRevenueChartData>;
  planDistributionData: ReturnType<typeof getPlanDistributionData>;
  chartPeriod: string;
  onChartPeriodChange: (period: string) => void;
  onPlanSelect: (plan: string) => void;
  onOpenPlanDetails: () => void;
  onOpenFreeAgents: () => void;
}

export function AgentsOverviewCharts({
  stats,
  revenueChartData,
  planDistributionData,
  chartPeriod,
  onChartPeriodChange,
  onPlanSelect,
  onOpenPlanDetails,
  onOpenFreeAgents,
}: AgentsOverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
      <Card className="col-span-1 lg:col-span-7 p-3 sm:p-6 min-h-[300px] sm:h-[380px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Ingresos generados por agentes</h3>
          <div className="flex gap-1 flex-wrap">
            {CHART_PERIODS.map((period) => (
              <button key={period} onClick={() => onChartPeriodChange(period)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-lg transition-colors ${chartPeriod === period ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[180px] sm:h-[260px]">
          <Line data={revenueChartData} options={revenueChartOptions} />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[10px] sm:text-xs">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-teal-500 rounded-full"></span> Ingresos (USD)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></span> Conversion (%)</span>
        </div>
      </Card>

      <div className="col-span-1 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 min-h-[300px] sm:h-[380px]">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Monetizacion por tipo de plan</h3>
          <div className="h-20 sm:h-28 flex items-center justify-center relative">
            <Doughnut data={planDistributionData} options={{ maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } }} />
            <div className="absolute text-center">
              <p className="text-base sm:text-xl font-bold">{stats?.planDistribution?.total || 0}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Agentes</p>
            </div>
          </div>
          <div className="space-y-0.5 sm:space-y-1 mt-1.5 sm:mt-2">
            {(stats?.planDistribution?.labels || []).map((label: string, index: number) => {
              const value = stats?.planDistribution?.values[index] || 0;
              const total = stats?.planDistribution?.total || 1;
              const percentage = Math.round((value / total) * 100);
              return (
                <div key={label} className="flex items-center justify-between text-[10px] sm:text-xs cursor-pointer hover:bg-gray-50 p-0.5 sm:p-1 rounded"
                  onClick={() => onPlanSelect(PLAN_CODES[index] || 'all')}>
                  <span className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PLAN_COLORS[index] || '#9ca3af' }}></span>
                    <span className="truncate">{label}</span>
                  </span>
                  <span className="text-gray-500 flex-shrink-0">{value} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
            onClick={onOpenPlanDetails}>Ver detalles</button>
        </Card>

        <Card className="p-3 sm:p-4 min-h-[300px] sm:h-[380px]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Potencial perdido</h3>
            <button className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm">ⓘ</button>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">${(stats?.lostPotentialRevenue || 0).toLocaleString()}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Ingresos potenciales de agentes free</p>
          <div className="space-y-1.5 sm:space-y-2 mt-2 sm:mt-3 max-h-28 sm:max-h-32 overflow-y-auto">
            {(stats?.freeAgentList || []).slice(0, 4).map((agent) => (
              <div key={agent.agentId} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] sm:text-xs font-medium text-gray-600 flex-shrink-0">{agent.initials}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">{agent.firstName} {agent.lastName}</p>
                    <p className="text-[9px] sm:text-xs text-gray-500">Sin plan activo</p>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-medium flex-shrink-0">${agent.potentialRevenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 sm:mt-3 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
            onClick={onOpenFreeAgents}>Ver todos ({stats?.freeAgents || 0})</button>
        </Card>
      </div>
    </div>
  );
}
