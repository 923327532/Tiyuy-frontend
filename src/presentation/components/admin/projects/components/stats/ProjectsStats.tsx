'use client';

import { Building2, DollarSign, FolderOpen, Home, Package, TrendingUp } from 'lucide-react';
import type { ProjectStats } from '@/core/domain/entities/Admin';
import { KpiCard } from '@/presentation/components/ui/Card';

interface Props {
  stats?: ProjectStats | null;
  loading?: boolean;
  onSelectStatus?: (status: string) => void;
  onShowAll?: () => void;
}

function formatNumber(n: number): string {
  return (n || 0).toLocaleString('es-PE');
}

function formatExactCurrency(n: number): string {
  return `S/ ${(n || 0).toLocaleString('es-PE', { maximumFractionDigits: 0 })}`;
}

function formatCompactCurrency(n: number): string {
  const value = n || 0;
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${sign}S/ ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}S/ ${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${formatExactCurrency(abs)}`;
}

export function ProjectsStats({ stats, loading, onSelectStatus, onShowAll }: Props) {
  const s = stats;
  const totalProjects = s?.totalProjects ?? 0;
  const totalUnits = s?.totalUnits ?? 0;
  const exactSales = formatExactCurrency(s?.totalSalesValue ?? 0);

  const kpis = [
    {
      id: 'total-projects',
      label: 'Total proyectos',
      value: formatNumber(totalProjects),
      hint: 'Registrados en la plataforma',
      onClick: onShowAll,
      icon: FolderOpen,
      color: 'emerald' as const,
    },
    {
      id: 'active-projects',
      label: 'Proyectos activos',
      value: formatNumber(s?.activeProjects ?? 0),
      hint: `De ${formatNumber(totalProjects)} registrados`,
      onClick: onSelectStatus ? () => onSelectStatus('ACTIVE') : undefined,
      icon: Building2,
      color: 'cyan' as const,
    },
    {
      id: 'total-sales',
      label: 'Ventas totales',
      value: formatCompactCurrency(s?.totalSalesValue ?? 0),
      hint: `Valor exacto: ${exactSales}`,
      title: exactSales,
      href: '/admin/finance',
      icon: DollarSign,
      color: 'sage' as const,
    },
    {
      id: 'sold-units',
      label: 'Unidades vendidas',
      value: formatNumber(s?.totalSoldUnits ?? 0),
      hint: `De ${formatNumber(totalUnits)} unidades`,
      icon: Package,
      color: 'indigo' as const,
    },
    {
      id: 'conversion-rate',
      label: 'Tasa de conversión',
      value: `${(s?.conversionRate ?? 0).toFixed(1)}%`,
      hint: 'Unidades vendidas / totales',
      icon: TrendingUp,
      color: 'slate' as const,
    },
    {
      id: 'available-units',
      label: 'Unidades disponibles',
      value: formatNumber(s?.totalAvailableUnits ?? 0),
      hint: 'Listas para comercializarse',
      icon: Home,
      color: 'emerald' as const,
    },
  ];

  return (
    <section aria-label="Indicadores de proyectos">
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
              href={'href' in kpi ? kpi.href : undefined}
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
