'use client';

import { ChevronRight, Mail, Phone, UserCheck } from 'lucide-react';
import type { InmobiliariaAgent } from '@/core/domain/entities/Admin';
import type { DetailTabProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import '../styles/AgentsTab.css';

interface AgentRowProps {
  agent: InmobiliariaAgent;
  onClick: () => void;
}

function AgentRow({ agent, onClick }: AgentRowProps) {
  const initial = `${agent.firstName?.[0] || ''}${agent.lastName?.[0] || ''}`.toUpperCase() || '?';
  const isActive = agent.status === 'ACTIVE';

  return (
    <button
      type="button"
      onClick={onClick}
      className="agc-agent-row"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="agc-agent-row__avatar">{initial}</div>
      <div className="agc-agent-row__info">
        <p className="agc-agent-row__name">{agent.firstName} {agent.lastName}</p>
        <p className="agc-agent-row__email">{agent.email}</p>
      </div>
      <div className="agc-agent-row__meta">
        <span className={`agc-agent-row__badge ${isActive ? 'agc-agent-row__badge--active' : 'agc-agent-row__badge--inactive'}`}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
        <p className="agc-agent-row__plan">{agent.currentPlan || 'Free'}</p>
        <ChevronRight className="agc-agent-row__chevron w-4 h-4" aria-hidden="true" />
      </div>
    </button>
  );
}

export function AgentsTab({ agents, onViewAgentDetail }: DetailTabProps) {
  const handleViewAgent = (agent: InmobiliariaAgent) => {
    // TODO: Implement agent detail view
    console.log('View agent:', agent);
  };

  return (
    <div className="agc-agents-tab">
      {agents.length === 0 ? (
        <div className="agc-agents-tab__empty">
          <UserCheck className="w-12 h-12 text-slate-300" aria-hidden="true" />
          <p className="agc-agents-tab__empty-title">No hay agentes asociados</p>
          <p className="agc-agents-tab__empty-text">Esta inmobiliaria aún no tiene agentes vinculados.</p>
        </div>
      ) : (
        <div className="agc-agents-tab__list" role="list">
          {agents.map((agent) => (
            <AgentRow
              key={agent.id}
              agent={agent}
              onClick={() => handleViewAgent(agent)}
            />
          ))}
        </div>
      )}
    </div>
  );
}