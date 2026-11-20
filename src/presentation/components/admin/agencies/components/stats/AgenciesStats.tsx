'use client';

import { Building2, CreditCard, DollarSign, Tag, Users } from 'lucide-react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import './styles/AgenciesStats.css';

interface Props {
  agencies: InmobiliariaWithStats[];
  loading?: boolean;
}

function formatCurrency(n: number) {
  return `$${(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function formatNumber(n: number) {
  return (n || 0).toLocaleString('es-PE');
}

const metrics = [
  {
    key: 'total-agencies',
    tone: 'total' as const,
    label: 'Inmobiliarias registradas',
    icon: Building2,
    getValue: (agencies: InmobiliariaWithStats[]) => agencies.length,
    getDescription: () => 'Total en plataforma',
    statusLabel: 'Resumen general',
  },
  {
    key: 'total-agents',
    tone: 'active' as const,
    label: 'Agentes totales',
    icon: Users,
    getValue: (agencies: InmobiliariaWithStats[]) => agencies.reduce((sum, a) => sum + (a.totalAgents || 0), 0),
    getDescription: () => 'Asociados a inmobiliarias',
    statusLabel: 'Agentes vinculados',
  },
  {
    key: 'active-plans',
    tone: 'pending' as const,
    label: 'Planes activos',
    icon: CreditCard,
    getValue: (agencies: InmobiliariaWithStats[]) => agencies.filter((a) => a.subscriptionStatus === 'ACTIVE').length,
    getDescription: () => 'Con suscripción vigente',
    statusLabel: 'Planes vigentes',
  },
  {
    key: 'active-discounts',
    tone: 'active' as const,
    label: 'Descuentos activos',
    icon: Tag,
    getValue: (agencies: InmobiliariaWithStats[]) => agencies.reduce((sum, a) => sum + (a.activeDiscounts || 0), 0),
    getDescription: () => 'Códigos vigentes',
    statusLabel: 'Descuentos vigentes',
  },
  {
    key: 'revenue-30d',
    tone: 'suspended' as const,
    label: 'Ingresos 30 días',
    icon: DollarSign,
    getValue: (agencies: InmobiliariaWithStats[]) => agencies.reduce((sum, a) => sum + (a.revenue30Days || 0), 0),
    getDescription: () => 'Facturación reciente',
    statusLabel: 'Ingresos plataforma',
  },
] as const;

export function AgenciesStats({ agencies, loading }: Props) {
  if (loading) {
    return (
      <section className="users-overview" aria-label="Indicadores de inmobiliarias">
        <div className="users-overview__card">
          <header className="users-overview__header">
            <div>
              <h2 className="users-overview__title">Indicadores de inmobiliarias</h2>
              <p className="users-overview__subtitle">
                Vista consolidada de inmobiliarias, agentes, planes e ingresos.
              </p>
            </div>
            <span className="users-overview__badge">
              <span className="users-overview__badge-dot" aria-hidden="true" />
              Cargando...
            </span>
          </header>
          <div className="users-overview__metrics" role="group" aria-label="Indicadores generales de inmobiliarias">
            {[...Array(5)].map((_, index) => (
              <article
                key={index}
                className="users-overview-metric animate-pulse"
                data-tone="total"
                style={{ '--metric-index': index } as React.CSSProperties}
              >
                <div className="users-overview-metric__top">
                  <span className="users-overview-metric__icon" aria-hidden="true"><span>•</span></span>
                  <span className="users-overview-metric__status">
                    <span className="users-overview-metric__status-dot" aria-hidden="true" />
                    Cargando
                  </span>
                </div>
                <p className="users-overview-metric__label">Métrica</p>
                <p className="users-overview-metric__value">—</p>
                <p className="users-overview-metric__description">Cargando datos...</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="users-overview" aria-label="Indicadores de inmobiliarias">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">Indicadores de inmobiliarias</h2>
            <p className="users-overview__subtitle">
              Vista consolidada de inmobiliarias, agentes, planes e ingresos.
            </p>
          </div>
          <span className="users-overview__badge">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            En vivo
          </span>
        </header>

        <div className="users-overview__metrics" role="group" aria-label="Indicadores generales de inmobiliarias">
          {metrics.map((item, index) => {
            const value = item.getValue(agencies);
            const Icon = item.icon;
            const isCurrency = item.key === 'revenue-30d';
            const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value);

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
                    {item.statusLabel}
                  </span>
                </div>

                <p className="users-overview-metric__label">{item.label}</p>
                <p className="users-overview-metric__value" aria-label={`${formattedValue} ${item.label.toLowerCase()}`}>
                  {formattedValue}
                </p>
                <p className="users-overview-metric__description">{item.getDescription()}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}