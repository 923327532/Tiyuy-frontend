'use client';

import type { CSSProperties } from 'react';
import { Clock, ShieldCheck, ShieldX, TrendingUp, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import '@/presentation/components/admin/agencies/components/stats/styles/AgenciesStats.css';

export interface AssociationCounts {
  ALL: number;
  PENDING: number;
  ACTIVE: number;
  REJECTED: number;
}

interface Metric {
  key: string;
  tone: 'total' | 'active' | 'pending' | 'suspended';
  label: string;
  icon: LucideIcon;
  getValue: (counts: AssociationCounts) => number;
  getDescription: (counts: AssociationCounts) => string;
  statusLabel?: string;
  getStatus?: (counts: AssociationCounts) => string;
  suffix?: string;
}

function pct(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

const metrics: Metric[] = [
  {
    key: 'ALL',
    tone: 'total',
    label: 'Total de solicitudes',
    icon: Users,
    getValue: (c) => c.ALL,
    getDescription: (c) => (c.ALL > 0 ? 'Solicitudes registradas' : 'Sin solicitudes registradas'),
    statusLabel: 'Resumen general',
  },
  {
    key: 'PENDING',
    tone: 'pending',
    label: 'Pendientes',
    icon: Clock,
    getValue: (c) => c.PENDING,
    getDescription: (c) =>
      c.PENDING > 0 ? 'Esperando revisión administrativa' : 'No hay solicitudes pendientes',
    getStatus: (c) => (c.PENDING > 0 ? 'Requieren atención' : 'Al día'),
  },
  {
    key: 'ACTIVE',
    tone: 'active',
    label: 'Aprobadas',
    icon: ShieldCheck,
    getValue: (c) => c.ACTIVE,
    getDescription: (c) =>
      c.ALL > 0 ? `De ${c.ALL.toLocaleString('es-PE')} solicitudes totales` : 'Sin solicitudes registradas',
    statusLabel: 'Asociaciones vigentes',
  },
  {
    key: 'REJECTED',
    tone: 'suspended',
    label: 'Rechazadas',
    icon: ShieldX,
    getValue: (c) => c.REJECTED,
    getDescription: (c) =>
      c.REJECTED > 0 ? 'Solicitudes rechazadas en revisión' : 'No hay solicitudes rechazadas',
    getStatus: (c) => (c.REJECTED > 0 ? 'Con rechazos' : 'Sin rechazos'),
  },
  {
    key: 'APPROVAL_RATE',
    tone: 'active',
    label: 'Tasa de aprobación',
    icon: TrendingUp,
    getValue: (c) => pct(c.ACTIVE, c.ACTIVE + c.REJECTED),
    getDescription: (c) => {
      const reviewed = c.ACTIVE + c.REJECTED;
      return reviewed > 0 ? `Sobre ${reviewed.toLocaleString('es-PE')} solicitudes revisadas` : 'Sin solicitudes revisadas';
    },
    statusLabel: 'Eficiencia de revisión',
    suffix: '%',
  },
];

export function AssociationRequestsStats({ counts }: { counts: AssociationCounts }) {
  return (
    <section className="users-overview" aria-label="Indicadores de solicitudes de asociación">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">Indicadores de asociación</h2>
            <p className="users-overview__subtitle">
              Vista consolidada del estado de las solicitudes de agentes e inmobiliarias.
            </p>
          </div>
          <span className="users-overview__badge">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            En vivo
          </span>
        </header>

        <div className="users-overview__metrics" role="group" aria-label="Indicadores de asociación">
          {metrics.map((item, index) => {
            const value = item.getValue(counts);
            const statusLabel = item.getStatus ? item.getStatus(counts) : item.statusLabel;
            const Icon = item.icon;

            return (
              <article
                key={item.key}
                className="users-overview-metric"
                data-tone={item.tone}
                style={{ '--metric-index': index } as CSSProperties}
              >
                <div className="users-overview-metric__top">
                  <span className="users-overview-metric__icon" aria-hidden="true">
                    <span><Icon /></span>
                  </span>
                  <span className="users-overview-metric__status">
                    <span className="users-overview-metric__status-dot" aria-hidden="true" />
                    {statusLabel}
                  </span>
                </div>

                <p className="users-overview-metric__label">{item.label}</p>
                <p
                  className="users-overview-metric__value"
                  aria-label={`${value.toLocaleString('es-PE')}${item.suffix ?? ''} ${item.label.toLowerCase()}`}
                >
                  {value.toLocaleString('es-PE')}{item.suffix ?? ''}
                </p>
                <p className="users-overview-metric__description">{item.getDescription(counts)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
