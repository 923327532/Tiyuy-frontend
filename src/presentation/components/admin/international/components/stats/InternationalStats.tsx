'use client';

import { Clock, ShieldCheck, ShieldX, TrendingUp, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { InternationalCounts } from '../../types/international.types';
import './styles/InternationalStats.css';

interface Props {
  counts: InternationalCounts;
}

interface Metric {
  key: string;
  tone: 'total' | 'active' | 'pending' | 'suspended';
  label: string;
  icon: LucideIcon;
  getValue: (counts: InternationalCounts) => number;
  getDescription: (counts: InternationalCounts) => string;
  statusLabel?: string;
  getStatus?: (counts: InternationalCounts) => string;
  suffix?: string;
}

function pct(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

function approvalRate(counts: InternationalCounts): number {
  const reviewed = counts.VERIFIED + counts.REJECTED;
  if (reviewed <= 0) return 0;
  return pct(counts.VERIFIED, reviewed);
}

const metrics: Metric[] = [
  {
    key: 'ALL',
    tone: 'total',
    label: 'Total',
    icon: Users,
    getValue: (c) => c.ALL,
    getDescription: (c) =>
      c.ALL > 0 ? 'Solicitudes internacionales registradas' : 'Sin solicitudes registradas',
    statusLabel: 'Resumen general',
  },
  {
    key: 'PENDING',
    tone: 'pending',
    label: 'En revisión',
    icon: Clock,
    getValue: (c) => c.PENDING,
    getDescription: (c) =>
      c.PENDING > 0 ? 'Requieren revisión administrativa' : 'No hay verificaciones pendientes',
    getStatus: (c) => (c.PENDING > 0 ? 'Requieren atención' : 'Al día'),
  },
  {
    key: 'VERIFIED',
    tone: 'active',
    label: 'Aprobados',
    icon: ShieldCheck,
    getValue: (c) => c.VERIFIED,
    getDescription: (c) =>
      c.ALL > 0
        ? `De ${c.ALL.toLocaleString('es-PE')} solicitudes totales (${pct(c.VERIFIED, c.ALL)}%)`
        : 'Sin solicitudes registradas',
    statusLabel: 'Verificaciones aprobadas',
  },
  {
    key: 'REJECTED',
    tone: 'suspended',
    label: 'Rechazados',
    icon: ShieldX,
    getValue: (c) => c.REJECTED,
    getDescription: (c) =>
      c.REJECTED > 0 ? 'Solicitudes rechazadas por revisión' : 'No hay solicitudes rechazadas',
    getStatus: (c) => (c.REJECTED > 0 ? 'Con rechazos' : 'Sin rechazos'),
  },
  {
    key: 'APPROVAL_RATE',
    tone: 'active',
    label: 'Tasa de aprobación',
    icon: TrendingUp,
    getValue: approvalRate,
    getDescription: (c) => {
      const reviewed = c.VERIFIED + c.REJECTED;
      return reviewed > 0
        ? `Sobre ${reviewed.toLocaleString('es-PE')} solicitudes revisadas`
        : 'Sin solicitudes revisadas';
    },
    statusLabel: 'Eficiencia de revisión',
    suffix: '%',
  },
];

export function InternationalStats({ counts }: Props) {
  return (
    <section className="users-overview" aria-label="Resumen de solicitudes internacionales">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">Indicadores de extranjería</h2>
            <p className="users-overview__subtitle">
              Vista consolidada del estado de solicitudes y verificaciones internacionales.
            </p>
          </div>
          <span className="users-overview__badge">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            En vivo
          </span>
        </header>

        <div className="users-overview__metrics" aria-label="Indicadores generales de solicitudes internacionales" role="group">
          {metrics.map((item, index) => {
            const value = item.getValue(counts);
            const statusLabel = item.getStatus ? item.getStatus(counts) : item.statusLabel;
            const Icon = item.icon;

            return (
              <article
                key={item.key}
                className="users-overview-metric"
                data-tone={item.tone}
                style={{ '--metric-index': index } as React.CSSProperties}
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
