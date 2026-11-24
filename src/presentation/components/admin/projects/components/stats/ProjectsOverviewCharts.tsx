'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import type { ProjectAdminItem, ProjectStats } from '@/core/domain/entities/Admin';
import { Card } from '@/presentation/components/ui/Card';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import { PROJECT_CHART_PERIODS, PROJECT_STATUS_COLORS } from '../../config/projectsCharts.config';
import {
  formatCurrency,
  getProjectPotentials,
  getProjectSalesChartData,
  getProjectStatusChartData,
  projectSalesChartOptions,
} from '../../utils/projectsCharts';

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
  stats?: ProjectStats | null;
  projects: ProjectAdminItem[];
  onOpenDetails: () => void;
  onOpenAllProjects: () => void;
  onStatusSelect?: (status: string) => void;
}

export function ProjectsOverviewCharts({
  stats,
  projects,
  onOpenDetails,
  onOpenAllProjects,
  onStatusSelect,
}: Props) {
  const [period, setPeriod] = useState('6M');

  const { data: salesHistory } = useQuery({
    queryKey: ['projectsSalesHistory', period],
    queryFn: () => adminRepository.getProjectsSalesHistory(period),
  });
  const { data: statusData } = useQuery({
    queryKey: ['projectsByStatus'],
    queryFn: () => adminRepository.getProjectsByStatus(),
  });

  const salesData = useMemo(() => getProjectSalesChartData(salesHistory), [salesHistory]);
  const statusChartData = useMemo(() => getProjectStatusChartData(statusData), [statusData]);
  const potentials = useMemo(() => getProjectPotentials(projects), [projects]);
  const potentialTotal = potentials.reduce((sum, item) => sum + item.value, 0);
  const statusValues = statusData?.values || [];
  const statusTotal = statusValues.reduce((sum, value) => sum + value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
      <Card className="col-span-1 lg:col-span-7 p-3 sm:p-6 min-h-[300px] sm:h-[380px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Resumen de ventas de proyectos</h3>
          <div className="flex gap-1 flex-wrap">
            {PROJECT_CHART_PERIODS.map((item) => (
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
          <Line data={salesData} options={projectSalesChartOptions} />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[10px] sm:text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-teal-500 rounded-full" /> Ventas (USD)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full" /> Proyectos
          </span>
        </div>
      </Card>

      <div className="col-span-1 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 min-h-[300px] sm:h-[380px]">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
            Proyectos por estado
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
              <p className="text-base sm:text-xl font-bold">{stats?.totalProjects || 0}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Proyectos</p>
            </div>
          </div>
          <div className="space-y-0.5 sm:space-y-1 mt-1.5 sm:mt-2">
            {(statusData?.labels || []).map((label: string, index: number) => {
              const value = statusValues[index] || 0;
              const percentage = Math.round((value / (statusTotal || 1)) * 100);
              return (
                <div
                  key={label}
                  className="flex items-center justify-between text-[10px] sm:text-xs cursor-pointer hover:bg-gray-50 p-0.5 sm:p-1 rounded"
                  onClick={() => onStatusSelect?.(label)}
                >
                  <span className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PROJECT_STATUS_COLORS[index] || '#9ca3af' }}
                    />
                    <span className="truncate">{label}</span>
                  </span>
                  <span className="text-gray-500 flex-shrink-0">
                    {value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="w-full mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
            onClick={onOpenDetails}
          >
            Ver detalles
          </button>
        </Card>

        <Card className="p-3 sm:p-4 min-h-[300px] sm:h-[380px]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Potencial de venta</h3>
            <span className="text-gray-400 text-xs sm:text-sm">ⓘ</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(potentialTotal)}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
            Ingresos potenciales de unidades disponibles
          </p>
          <div className="space-y-1.5 sm:space-y-2 mt-2 sm:mt-3 max-h-28 sm:max-h-32 overflow-y-auto">
            {potentials.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] sm:text-xs font-medium text-gray-600 flex-shrink-0">
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-[9px] sm:text-xs text-gray-500 truncate">{item.developer}</p>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-medium flex-shrink-0">{formatCurrency(item.value)}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full mt-2 sm:mt-3 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
            onClick={onOpenAllProjects}
          >
            Ver todos ({projects.length})
          </button>
        </Card>
      </div>
    </div>
  );
}
