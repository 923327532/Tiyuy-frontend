'use client';

import type { AgentListItem } from '@/core/domain/entities/Admin';
import './styles/AgentCard.css';

interface Props {
  agent: AgentListItem;
  canManage?: boolean;
  onView: (agent: AgentListItem) => void;
  onStats: (agent: AgentListItem) => void;
  onToggleStatus: (agent: AgentListItem) => void;
}

function fmtDate(v?: Date | string) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('es-PE');
}

export function AgentCard({ agent, canManage, onView, onStats, onToggleStatus }: Props) {
  const name = [agent.firstName, agent.lastName].filter(Boolean).join(' ') || agent.email || '—';
  const initials = `${agent.firstName?.[0] || ''}${agent.lastName?.[0] || ''}`.toUpperCase() || '?';

  return (
    <article className="agc-card">
      <header className="agc-card__header">
        <div className="agc-card__identity">
          <div className="agc-card__avatar">
            {agent.profilePhotoUrl ? (
              <img src={agent.profilePhotoUrl} alt="" className="agc-card__avatar-img" />
            ) : (
              <span className="agc-card__avatar-text">{initials}</span>
            )}
          </div>
          <div className="agc-card__identity-info">
            <h3 className="agc-card__name" title={name}>{name}</h3>
            <p className="agc-card__email" title={agent.email}>{agent.email}</p>
          </div>
        </div>
        <span className={`agc-card__badge ${agent.enabled ? 'agc-card__badge--active' : 'agc-card__badge--inactive'}`}>
          {agent.enabled ? 'Activo' : 'Inactivo'}
        </span>
      </header>

      <div className="agc-card__body">
        <dl className="agc-card__grid">
          <div className="agc-card__item"><dt>Plan</dt><dd>{agent.currentPlan || 'Free'}</dd></div>
          <div className="agc-card__item"><dt>Verificación</dt><dd>{agent.emailVerified ? 'Verificado' : 'Pendiente'}</dd></div>
          <div className="agc-card__item"><dt>Ingresos mes</dt><dd>${(agent.monthRevenue || 0).toLocaleString()}</dd></div>
          <div className="agc-card__item"><dt>Conversión</dt><dd>{(agent.conversionRate || 0).toFixed(1)}%</dd></div>
          <div className="agc-card__item"><dt>Ubicación</dt><dd>{agent.city ? `${agent.city}${agent.country ? `, ${agent.country}` : ''}` : '—'}</dd></div>
          <div className="agc-card__item"><dt>Miembro desde</dt><dd>{fmtDate(agent.createdAt)}</dd></div>
        </dl>
      </div>

      <div className="agc-card__actions">
        <button type="button" className="agc-card__btn agc-card__btn--primary" onClick={() => onView(agent)}>Ver</button>
        <button type="button" className="agc-card__btn" onClick={() => onStats(agent)}>Estadísticas</button>
        {canManage && (
          <button type="button" className="agc-card__btn" onClick={() => onToggleStatus(agent)}>
            {agent.enabled ? 'Desactivar' : 'Activar'}
          </button>
        )}
      </div>
    </article>
  );
}
