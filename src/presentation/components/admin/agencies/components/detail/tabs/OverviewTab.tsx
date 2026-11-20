'use client';

import { Building2, Mail, MapPin, Phone, Users } from 'lucide-react';
import type { DetailTabProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import '../styles/OverviewTab.css';

export function OverviewTab({
  agency,
  stats,
}: DetailTabProps) {
  if (!agency) return null;

  const revenue30d = stats?.revenue30Days ?? agency.revenue30Days ?? 0;
  const projectsCount = stats?.projectsCount ?? agency.totalProjects ?? 0;
  const agentsCount = stats?.agentsCount ?? agency.totalAgents ?? 0;

  const formatCurrency = (n: number) => `$${(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  const formatNumber = (n: number) => (n || 0).toLocaleString('es-PE');

  return (
    <div className="agency-detail__tab-panel">
      {/* Métricas principales */}
      <section className="agency-detail__metrics" aria-label="Métricas principales">
        <article className="agency-detail__metric">
          <div className="agency-detail__metric-icon">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="agency-detail__metric-data">
            <p className="agency-detail__metric-value">{formatNumber(projectsCount)}</p>
            <p className="agency-detail__metric-label">Proyectos totales</p>
          </div>
        </article>
        <article className="agency-detail__metric">
          <div className="agency-detail__metric-icon">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="agency-detail__metric-data">
            <p className="agency-detail__metric-value">{formatNumber(agentsCount)}</p>
            <p className="agency-detail__metric-label">Agentes asociados</p>
          </div>
        </article>
        <article className="agency-detail__metric">
          <div className="agency-detail__metric-icon agency-detail__metric-icon--green">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="agency-detail__metric-data">
            <p className="agency-detail__metric-value">{formatCurrency(revenue30d)}</p>
            <p className="agency-detail__metric-label">Ingresos 30 días</p>
          </div>
        </article>
      </section>

      {/* Información de contacto */}
      <section className="agency-detail__section">
        <h3 className="agency-detail__section-title">Información de contacto</h3>
        <div className="agency-detail__contact-grid">
          <div className="agency-detail__contact-item">
            <div className="agency-detail__contact-icon">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="agency-detail__contact-label">Email</p>
              <p className="agency-detail__contact-value">{agency.email || '—'}</p>
            </div>
          </div>
          <div className="agency-detail__contact-item">
            <div className="agency-detail__contact-icon">
              <Phone className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="agency-detail__contact-label">Teléfono</p>
              <p className="agency-detail__contact-value">{agency.phone || '—'}</p>
            </div>
          </div>
          <div className="agency-detail__contact-item">
            <div className="agency-detail__contact-icon">
              <MapPin className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="agency-detail__contact-label">Ciudad</p>
              <p className="agency-detail__contact-value">{agency.city || '—'}</p>
            </div>
          </div>
          <div className="agency-detail__contact-item">
            <div className="agency-detail__contact-icon">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="agency-detail__contact-label">Dirección</p>
              <p className="agency-detail__contact-value">{agency.address || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan y estado */}
      <section className="agency-detail__section">
        <h3 className="agency-detail__section-title">Plan y estado</h3>
        <div className="agency-detail__plan-grid">
          <div className="agency-detail__plan-card">
            <p className="agency-detail__plan-label">Plan actual</p>
            <p className="agency-detail__plan-value">{agency.currentPlan || 'Sin plan'}</p>
          </div>
          <div className="agency-detail__plan-card">
            <p className="agency-detail__plan-label">Estado suscripción</p>
            <p className="agency-detail__plan-value">{agency.subscriptionStatus || '—'}</p>
          </div>
          <div className="agency-detail__plan-card">
            <p className="agency-detail__plan-label">Descuentos activos</p>
            <p className="agency-detail__plan-value">{agency.activeDiscounts || 0}</p>
          </div>
          <div className="agency-detail__plan-card">
            <p className="agency-detail__plan-label">Miembro desde</p>
            <p className="agency-detail__plan-value">
              {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString('es-PE') : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Gerente */}
      <section className="agency-detail__section">
        <h3 className="agency-detail__section-title">Gerente</h3>
        <p className="agency-detail__manager">{agency.managerName || '—'}</p>
      </section>
    </div>
  );
}