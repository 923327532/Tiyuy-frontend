/**
 * Configuración de las gráficas del dashboard de agentes.
 */

import type { AgentDashboardStats } from '@/core/domain/entities/Admin';
import { PLAN_COLORS } from '../config/agents.config';

type Stats = AgentDashboardStats | undefined;

export function getRevenueChartData(dashboardStats: Stats) {
  return {
    labels: dashboardStats?.revenueChart?.labels || [],
    datasets: [
      {
        label: 'Ingresos (USD)',
        data: dashboardStats?.revenueChart?.revenue || [],
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Conversion (%)',
        data: dashboardStats?.revenueChart?.conversion || [],
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };
}

export const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = Number(context.parsed.y ?? 0);
          return context.dataset.label === 'Ingresos (USD)'
            ? `Ingresos (USD): $${value.toLocaleString()}`
            : `Conversión (%): ${value.toFixed(1)}%`;
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
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value: any) => `${value}%`,
      },
    },
  },
};

export function getPlanDistributionData(dashboardStats: Stats) {
  return {
    labels: dashboardStats?.planDistribution?.labels || [],
    datasets: [
      {
        data: dashboardStats?.planDistribution?.values || [],
        backgroundColor: dashboardStats?.planDistribution?.labels?.map((_, i) => PLAN_COLORS[i]) || [],
        borderWidth: 0,
      },
    ],
  };
}
