'use client';

import type { DashboardKpi } from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { KpiCard as BaseKpiCard } from '@/presentation/components/ui/Card';

interface KpiCardProps {
  kpi: DashboardKpi & { color?: 'cyan' | 'indigo' | 'sage' | 'emerald' | 'slate' };
  index?: number;
}

export function KpiCard({ kpi, index = 0 }: KpiCardProps) {
  const Icon = kpi.icon;

  return (
    <BaseKpiCard
      icon={<Icon className="w-5 h-5" aria-hidden="true" />}
      value={kpi.value}
      label={kpi.label}
      hint={kpi.hint}
      growth={kpi.growth}
      href={kpi.href}
      loading={kpi.loading}
      unavailable={kpi.unavailable}
      color={kpi.color ?? 'cyan'}
      index={index}
    />
  );
}