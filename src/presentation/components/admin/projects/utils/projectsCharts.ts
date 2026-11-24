import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { PROJECT_STATUS_COLORS } from '../config/projectsCharts.config';

export interface SalesHistory {
  labels: string[];
  revenue: number[];
  developers: number[];
  projects: number[];
}

export function getProjectSalesChartData(history: SalesHistory | undefined) {
  return {
    labels: history?.labels || [],
    datasets: [
      {
        label: 'Ventas (USD)',
        data: history?.revenue || [],
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Proyectos',
        data: history?.projects || [],
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };
}

export const projectSalesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = Number(context.parsed.y ?? 0);
          return context.dataset.label === 'Ventas (USD)'
            ? `Ventas (USD): $${value.toLocaleString()}`
            : `Proyectos: ${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 11 } },
    },
    y: {
      type: 'linear' as const,
      position: 'left' as const,
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value: any) => `$${Number(value).toLocaleString()}`,
      },
    },
    y1: {
      type: 'linear' as const,
      position: 'right' as const,
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      ticks: { color: '#64748b', font: { size: 11 } },
    },
  },
};

export function getProjectStatusChartData(data?: { labels: string[]; values: number[] }) {
  return {
    labels: data?.labels || [],
    datasets: [
      {
        data: data?.values || [],
        backgroundColor: (data?.labels || []).map((_, i) => PROJECT_STATUS_COLORS[i] || '#64748b'),
        borderWidth: 0,
      },
    ],
  };
}

export interface ProjectPotential {
  name: string;
  developer: string;
  initials: string;
  value: number;
}

export function getProjectPotentials(projects: ProjectAdminItem[]): ProjectPotential[] {
  return projects
    .map((project) => {
      const value = (project.availableUnits ?? 0) * (project.priceRange?.min ?? 0);
      return {
        name: project.name,
        developer: project.developerName,
        initials: project.name.slice(0, 2).toUpperCase(),
        value,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function formatCurrency(value: number): string {
  return `$${(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
