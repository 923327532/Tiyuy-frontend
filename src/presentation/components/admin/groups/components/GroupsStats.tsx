'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  Building2,
  Globe2,
  Layers3,
  ShieldCheck,
  Users,
} from 'lucide-react';

import {
  KpiItem,
  type KpiTone,
} from '@/presentation/components/admin/users/components/kpis';

import type { GroupsSummary } from '../types';

interface GroupsStatsProps {
  summary: GroupsSummary;
}

export function GroupsStats({ summary }: GroupsStatsProps) {
  const reducedMotion = useReducedMotion();

  const metrics: Array<{
    key: string;
    tone: KpiTone;
    label: string;
    value: number;
    description: string;
    statusLabel: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'total',
      tone: 'total',
      label: 'Grupos y canales',
      value: summary.totalItems,
      description: `${summary.totalGroups} grupos y ${summary.totalChannels} canales registrados`,
      statusLabel: 'Resumen general',
      icon: <Layers3 />,
    },
    {
      key: 'active',
      tone: 'active',
      label: 'Activos',
      value: summary.activeItems,
      description:
        summary.totalItems > 0
          ? `De ${summary.totalItems} elementos registrados (${summary.activePercentage}%)`
          : 'Sin elementos registrados',
      statusLabel: 'Comunidad activa',
      icon: <Users />,
    },
    {
      key: 'suspended',
      tone: 'suspended',
      label: 'Suspendidos',
      value: summary.suspendedItems,
      description:
        summary.suspendedItems > 0
          ? `${summary.suspendedGroupsCount} grupos y ${summary.suspendedChannelsCount} canales (${summary.suspendedPercentage}%)`
          : 'No hay elementos suspendidos',
      statusLabel: summary.suspendedItems > 0 ? 'Requieren atención' : 'Al día',
      icon: <ShieldCheck />,
    },
    {
      key: 'violations',
      tone: 'pending',
      label: 'Con violaciones',
      value: summary.itemsWithViolations,
      description:
        summary.itemsWithViolations > 0
          ? `${summary.groupsWithViolationsCount} grupos y ${summary.channelsWithViolationsCount} canales (${summary.violationsPercentage}%)`
          : 'No hay violaciones registradas',
      statusLabel: summary.itemsWithViolations > 0 ? 'Revisar reportes' : 'Sin reportes',
      icon: <AlertTriangle />,
    },
    {
      key: 'channels',
      tone: 'active',
      label: 'Canales por ciudad',
      value: summary.totalChannels,
      description: 'Canales disponibles en la red',
      statusLabel: 'Cobertura geográfica',
      icon: <Globe2 />,
    },
  ];

  return (
    <section className="users-overview" aria-label="Resumen de grupos y canales">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">Indicadores y distribución</h2>
            <p className="users-overview__subtitle">
              Vista consolidada del estado de grupos, canales y violaciones.
            </p>
          </div>
          <span className="users-overview__badge" aria-label="Estado del resumen">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            Actualizado
          </span>
        </header>

        <div
          className="users-overview__metrics users-kpi-grid"
          aria-label="Indicadores generales de grupos y canales"
          role="group"
        >
          {metrics.map((metric, index) => (
            <KpiItem
              key={metric.key}
              tone={metric.tone}
              label={metric.label}
              value={metric.value}
              description={metric.description}
              statusLabel={metric.statusLabel}
              icon={metric.icon}
              index={index}
            />
          ))}
        </div>

        <motion.div
          className="users-stats-roles users-overview__roles"
          aria-label="Distribución de grupos y canales"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="users-stats-roles__header users-overview__roles-header">
            <div>
              <h3 className="users-stats-roles__title users-overview__roles-title">
                Distribución de la comunidad
              </h3>
              <p className="users-stats-roles__subtitle users-overview__roles-subtitle">
                Elementos agrupados según su tipo
              </p>
            </div>
            <div className="users-stats-roles__icon users-overview__roles-icon">
              <Building2 aria-hidden="true" />
            </div>
          </div>

          <div className="users-stats-roles__list users-overview__roles-list">
            <DistributionItem
              label="Grupos sociales"
              count={summary.totalGroups}
              index={0}
              icon={<Users aria-hidden="true" />}
              accent="#36866c"
              soft="#e5f1eb"
            />
            <DistributionItem
              label="Canales por ciudad"
              count={summary.totalChannels}
              index={1}
              icon={<Globe2 aria-hidden="true" />}
              accent="#39769b"
              soft="#e5f0f8"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface DistributionItemProps {
  label: string;
  count: number;
  index: number;
  icon: React.ReactNode;
  accent: string;
  soft: string;
}

function DistributionItem({ label, count, index, icon, accent, soft }: DistributionItemProps) {
  return (
    <div
      className="users-stats-role users-overview-role"
      style={{ '--role-index': index, '--role-accent': accent } as React.CSSProperties}
    >
      <span
        className="users-stats-role__icon users-overview-role__icon"
        style={{ background: soft, color: accent }}
      >
        {icon}
      </span>
      <span className="users-stats-role__name users-overview-role__name">{label}</span>
      <span className="users-stats-role__count users-overview-role__count">
        {count.toLocaleString('es-PE')}
      </span>
    </div>
  );
}
