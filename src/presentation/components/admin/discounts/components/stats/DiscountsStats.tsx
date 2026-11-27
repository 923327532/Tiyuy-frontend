'use client';

import { BadgeCheck, Building2, Clock, Tag, User, UserCheck } from 'lucide-react';
import type { CentralDiscountSummary } from '@/core/domain/entities/Admin';
import { KpiCard } from '@/presentation/components/ui/Card';

import { formatDiscountNumber } from '../../utils/discountFormat';

interface Props {
  summary?: CentralDiscountSummary | null;
  loading?: boolean;
}

export function DiscountsStats({ summary, loading }: Props) {
  const total = summary?.total ?? 0;

  const kpis = [
    {
      id: 'total',
      label: 'Total descuentos',
      value: formatDiscountNumber(total),
      hint: 'Registrados en el sistema',
      icon: Tag,
      color: 'cyan' as const,
    },
    {
      id: 'active',
      label: 'Activos',
      value: formatDiscountNumber(summary?.active ?? 0),
      hint: `De ${formatDiscountNumber(total)} descuentos`,
      icon: BadgeCheck,
      color: 'emerald' as const,
    },
    {
      id: 'users',
      label: 'Usuarios',
      value: formatDiscountNumber(summary?.users ?? 0),
      hint: 'Beneficios para usuarios',
      icon: User,
      color: 'indigo' as const,
    },
    {
      id: 'agents',
      label: 'Agentes',
      value: formatDiscountNumber(summary?.agents ?? 0),
      hint: 'Beneficios para agentes',
      icon: UserCheck,
      color: 'sage' as const,
    },
    {
      id: 'developers',
      label: 'Inmobiliarias',
      value: formatDiscountNumber(summary?.developers ?? 0),
      hint: 'Beneficios para inmobiliarias',
      icon: Building2,
      color: 'cyan' as const,
    },
    {
      id: 'expired',
      label: 'Vencidos',
      value: formatDiscountNumber(summary?.expired ?? 0),
      hint: 'Requieren renovación',
      icon: Clock,
      color: 'slate' as const,
    },
  ];

  return (
    <section aria-label="Indicadores de descuentos">
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
              loading={loading}
              color={kpi.color}
              index={index}
              className="discounts-kpi"
            />
          );
        })}
      </div>
    </section>
  );
}
