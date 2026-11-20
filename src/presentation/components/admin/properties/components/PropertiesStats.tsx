'use client';

import { Building2, CheckCircle2, Clock3, Flag, ShieldX } from 'lucide-react';

import { KpiItem } from '@/presentation/components/admin/users/components/kpis/KpiItem';
import { calculatePercentage, formatNumber } from '../utils/properties.utils';
import type { PropertyKpis } from '../types/properties.types';

interface PropertiesStatsProps {
  kpis: PropertyKpis;
}

export function PropertiesStats({ kpis }: PropertiesStatsProps) {
  const total = kpis.total;
  const percentage = calculatePercentage(kpis.published, total);

  const metrics = [
    {
      tone: 'active' as const,
      label: 'Propiedades publicadas',
      value: kpis.published,
      description: total > 0
        ? `De ${formatNumber(total)} propiedades (${percentage}%)`
        : 'Sin propiedades registradas',
      statusLabel: 'Visibles públicamente',
      icon: <CheckCircle2 />,
    },
    {
      tone: 'pending' as const,
      label: 'Pendientes de revisión',
      value: kpis.pending,
      description: kpis.pending > 0
        ? 'Requieren revisión administrativa'
        : 'No hay publicaciones pendientes',
      statusLabel: kpis.pending > 0 ? 'Requieren atención' : 'Al día',
      icon: <Clock3 />,
    },
    {
      tone: 'suspended' as const,
      label: 'Suspendidas',
      value: kpis.suspended,
      description: kpis.suspended > 0
        ? 'Publicaciones suspendidas temporalmente'
        : 'No hay propiedades suspendidas',
      statusLabel: kpis.suspended > 0 ? 'Bloqueadas' : 'Sin suspensiones',
      icon: <ShieldX />,
    },
    {
      tone: 'total' as const,
      label: 'Total de propiedades',
      value: total,
      description: 'Propiedades registradas en la plataforma',
      statusLabel: 'Resumen general',
      icon: <Building2 />,
    },
    {
      tone: 'pending' as const,
      label: 'Reportes pendientes',
      value: kpis.reports,
      description: kpis.reports > 0
        ? 'Reportes de usuarios sin revisar'
        : 'No hay reportes pendientes',
      statusLabel: kpis.reports > 0 ? 'Requieren revisión' : 'Al día',
      icon: <Flag />,
    },
  ];

  return (
    <section className="users-overview" aria-label="Resumen de propiedades">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">Indicadores de moderación</h2>
            <p className="users-overview__subtitle">
              Vista consolidada del estado de las publicaciones y reportes.
            </p>
          </div>
          <span className="users-overview__badge" aria-label="Estado del resumen">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            Actualizado
          </span>
        </header>

        <div
          className="users-overview__metrics users-kpi-grid"
          aria-label="Indicadores generales de propiedades"
          role="group"
        >
          {metrics.map((metric, index) => (
            <KpiItem key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
