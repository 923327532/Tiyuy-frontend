'use client';

import {
  Building2,
  FolderKanban,
  Target,
  Wallet,
  Users,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import type { DashboardKpiStripProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { KpiCard } from './KpiCard';

import {
  formatCurrency,
  formatNumber,
} from '@/presentation/components/admin/dashboard/utils/dashboard.utils';

interface Kpi {
  id: string;
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: LucideIcon;
  growth?: number;
  unavailable?: boolean;
  loading?: boolean;
  color: 'cyan' | 'indigo' | 'sage' | 'emerald' | 'slate';
  insight: string;
}

export function DashboardKpiStrip({
  stats,
  finance,
  financeUnavailable,
  projectStats,
  projectsUnavailable,
  marketing,
  canViewMarketing,
  marketingLoading,
}: DashboardKpiStripProps) {
  const kpis: Kpi[] = [
    {
      id: 'listings',
      label: 'Propiedades publicadas',
      value: formatNumber(stats?.publishedProperties),
      hint: `${formatNumber(stats?.pendingProperties)} por moderar`,
      href: '/admin/properties',
      icon: Building2,
      growth: stats?.propertiesGrowthPercent,
      color: 'cyan',
      insight: 'Inventario inmobiliario publicado',
    },
    {
      id: 'projects',
      label: 'Proyectos activos',
      value: formatNumber(
        projectsUnavailable
          ? undefined
          : (projectStats?.activeProjects ?? stats?.activeProjects)
      ),
      hint: `De ${formatNumber(
        projectsUnavailable
          ? undefined
          : (projectStats?.totalProjects ?? stats?.totalProjects)
      )} registrados`,
      href: '/admin/projects',
      icon: FolderKanban,
      growth: stats?.projectsGrowthPercent,
      color: 'indigo',
      insight: 'Portafolio de proyectos inmobiliarios',
    },
    {
      id: 'leads',
      label: 'Leads de campañas',
      value: canViewMarketing
        ? formatNumber(marketing?.totalLeads)
        : '—',
      hint: canViewMarketing
        ? 'Contactos generados'
        : 'Requiere rol administrador',
      href: '/admin/campaigns',
      icon: Target,
      growth: canViewMarketing
        ? marketing?.leadsGrowth
        : undefined,
      unavailable: !canViewMarketing,
      loading: marketingLoading,
      color: 'sage',
      insight: 'Captación de oportunidades comerciales',
    },
    {
      id: 'revenue',
      label: 'Ingresos del mes',
      value: formatCurrency(
        financeUnavailable
          ? undefined
          : (finance?.revenueThisMonth ?? stats?.revenueThisMonth)
      ),
      hint: `${formatCurrency(
        financeUnavailable
          ? undefined
          : (finance?.revenueToday ?? stats?.revenueToday)
      )} hoy`,
      href: '/admin/finance',
      icon: Wallet,
      growth: stats?.revenueGrowthPercent,
      color: 'emerald',
      insight: 'Rendimiento financiero de TIYUY',
    },
    {
      id: 'users',
      label: 'Usuarios nuevos del mes',
      value: formatNumber(stats?.newUsersThisMonth),
      hint: `${formatNumber(stats?.totalUsers)} en total`,
      href: '/admin/users',
      icon: Users,
      growth: stats?.usersGrowthPercent,
      color: 'slate',
      insight: 'Evolución de la comunidad',
    },
  ];

  return (
    <section
      aria-label="Indicadores principales"
      className="
        grid min-w-0 grid-cols-2 gap-3 sm:gap-4
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-5
      "
    >
      {kpis.map((kpi, index) => (
        <KpiCard
          key={kpi.id}
          kpi={kpi}
          index={index}
        />
      ))}
    </section>
  );
}