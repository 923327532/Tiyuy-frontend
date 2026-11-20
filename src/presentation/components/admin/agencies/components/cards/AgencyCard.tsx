'use client';

import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { AgencyAvatar } from './AgencyAvatar';
import './styles/AgencyCard.css';

interface AgencyCardProps {
  agency: InmobiliariaWithStats;
  onView: (agency: InmobiliariaWithStats) => void;
  onNotify?: (agency: InmobiliariaWithStats) => void;
  canManage?: boolean;
}

export function AgencyCard({ agency, canManage, onView, onNotify }: AgencyCardProps) {
  const isEnabled = agency.enabled !== false;

  return (
    <article className="agc-card">
      <header className="agc-card__header">
        <div className="agc-card__identity">
          <AgencyAvatar agency={agency} size="md" />
          <div className="agc-card__identity-info">
            <h3 className="agc-card__name" title={agency.name || ''}>{agency.name || '—'}</h3>
            <p className="agc-card__email" title={agency.ruc || ''}>RUC: {agency.ruc || '—'}</p>
          </div>
        </div>
        <span className={`agc-card__badge ${isEnabled ? 'agc-card__badge--active' : 'agc-card__badge--inactive'}`}>
          {isEnabled ? 'Activo' : 'Inactivo'}
        </span>
      </header>

      <div className="agc-card__body">
        <dl className="agc-card__grid">
          <div className="agc-card__item"><dt>Gerente</dt><dd>{agency.managerName || '—'}</dd></div>
          <div className="agc-card__item"><dt>Email</dt><dd>{agency.email || '—'}</dd></div>
          <div className="agc-card__item"><dt>Ciudad</dt><dd>{agency.city || '—'}</dd></div>
          <div className="agc-card__item"><dt>Proyectos</dt><dd>{agency.totalProjects || 0}</dd></div>
          <div className="agc-card__item"><dt>Agentes</dt><dd>{agency.totalAgents || 0}</dd></div>
          <div className="agc-card__item"><dt>Plan</dt><dd>{agency.currentPlan || 'Sin plan'}</dd></div>
        </dl>
      </div>

      <div className="agc-card__actions">
        <button type="button" className="agc-card__btn agc-card__btn--primary" onClick={() => onView(agency)}>Ver</button>
        {onNotify && (
          <button type="button" className="agc-card__btn" onClick={() => onNotify(agency)}>Notificar</button>
        )}
        {canManage && (
          <button type="button" className="agc-card__btn" onClick={() => onView(agency)}>
            {agency.enabled ? 'Suspender' : 'Activar'}
          </button>
        )}
      </div>
    </article>
  );
}