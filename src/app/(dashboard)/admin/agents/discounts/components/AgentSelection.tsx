'use client';

import { Search, X, Plus } from 'lucide-react';
import { AgentListItem } from '@/core/domain/entities/Admin';

interface AgentSelectionProps {
  agentSearchQuery: string;
  setAgentSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showAgentDropdown: boolean;
  setShowAgentDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  filteredAgents: AgentListItem[];
  selectedAgent: AgentListItem | null;
  setSelectedAgent: React.Dispatch<React.SetStateAction<AgentListItem | null>>;
  onSelectAgent: (agent: AgentListItem) => void;
  canManageDiscounts: boolean;
  onOpenAssign: () => void;
  onCreate: () => void;
}

export function AgentSelection({
  agentSearchQuery,
  setAgentSearchQuery,
  showAgentDropdown,
  setShowAgentDropdown,
  filteredAgents,
  selectedAgent,
  setSelectedAgent,
  onSelectAgent,
  canManageDiscounts,
  onOpenAssign,
  onCreate,
}: AgentSelectionProps) {
  const clearAgent = () => {
    setAgentSearchQuery('');
    setSelectedAgent(null);
    setShowAgentDropdown(false);
  };

  return (
    <section className="agent-discounts__surface agent-discounts__surface--selection" aria-label="Seleccionar agente">
      <div className="agent-discounts__card-header">
        <h2 className="agent-discounts__section-title">
          <span className="agent-discounts__step">1</span>
          Seleccionar Agente
        </h2>
      </div>

      {/* Same filter bar as the users section */}
      <div className="users-filters agent-discounts__agent-filters">
        <div className="users-filters__main">
          <div className="agent-discounts__search-wrap">
            <div className="users-filters__search">
              <Search className="users-filters__search-icon" aria-hidden="true" />
              <input
                id="agent-discounts-agent-search"
                type="search"
                value={agentSearchQuery}
                onChange={(e) => {
                  setAgentSearchQuery(e.target.value);
                  setShowAgentDropdown(true);
                  if (!e.target.value) setSelectedAgent(null);
                }}
                onFocus={() => setShowAgentDropdown(true)}
                placeholder="Buscar por nombre, email o DNI..."
                className="users-filters__input"
                aria-label="Buscar agente por nombre, email o DNI"
              />
              {agentSearchQuery && (
                <button
                  type="button"
                  className="users-filters__search-clear"
                  onClick={clearAgent}
                  aria-label="Limpiar búsqueda de agente"
                >
                  <X />
                </button>
              )}
            </div>
            {showAgentDropdown && filteredAgents.length > 0 && (
              <div className="agent-discounts__agent-dropdown" role="listbox">
                {filteredAgents.map((agent: AgentListItem) => (
                  <button
                    key={agent.id}
                    type="button"
                    role="option"
                    aria-selected={selectedAgent?.id === agent.id}
                    onClick={() => onSelectAgent(agent)}
                    className="agent-discounts__agent-option"
                  >
                    <span className="agent-discounts__agent-avatar">
                      {agent.firstName?.[0]}{agent.lastName?.[0]}
                    </span>
                    <span className="agent-discounts__agent-info">
                      <span className="agent-discounts__agent-name">{agent.firstName} {agent.lastName}</span>
                      <span className="agent-discounts__agent-meta">
                        {agent.email}{agent.dni && ` • DNI: ${agent.dni}`}
                      </span>
                    </span>
                    <span className={`agent-discounts__status-badge ${agent.enabled ? 'agent-discounts__status-badge--active' : 'agent-discounts__status-badge--expired'}`}>
                      <span className="agent-discounts__status-dot" />
                      {agent.enabled ? 'Activo' : 'Inactivo'}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {showAgentDropdown && agentSearchQuery && filteredAgents.length === 0 && (
              <div className="agent-discounts__agent-dropdown agent-discounts__agent-dropdown-empty">
                No se encontraron agentes
              </div>
            )}
          </div>
          {agentSearchQuery && (
            <button type="button" className="users-filters__clear" onClick={clearAgent}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="agent-discounts__card-body">
        {/* Selected agent - same header as the user detail modal */}
        {selectedAgent && (
          <div className="agent-discounts__selected-agent user-detail-modal__header">
            {selectedAgent.profilePhotoUrl ? (
              <img src={selectedAgent.profilePhotoUrl} alt="" className="user-detail-modal__avatar" />
            ) : (
              <div className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
                {selectedAgent.firstName?.[0]}{selectedAgent.lastName?.[0]}
              </div>
            )}
            <div className="user-detail-modal__identity">
              <h3 className="user-detail-modal__name">{selectedAgent.firstName} {selectedAgent.lastName}</h3>
              <p className="user-detail-modal__email">
                {selectedAgent.email}{selectedAgent.dni && ` • DNI: ${selectedAgent.dni}`}
              </p>
              <div className="user-detail-modal__badges">
                <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">Agente</span>
                <span className={`agent-discounts__status-badge ${selectedAgent.enabled ? 'agent-discounts__status-badge--active' : 'agent-discounts__status-badge--expired'}`}>
                  <span className="agent-discounts__status-dot" />
                  {selectedAgent.enabled ? 'Activo' : 'Inactivo'}
                </span>
                {selectedAgent.currentPlan && (
                  <span className="user-detail-modal__role-badge user-detail-modal__role-badge--developer">
                    {selectedAgent.currentPlan}
                  </span>
                )}
              </div>
            </div>
            {canManageDiscounts && (
              <div className="agent-discounts__selected-actions">
                <button type="button" onClick={onOpenAssign} className="agent-discounts__soft-btn">
                  Asignar Existente
                </button>
                <button type="button" onClick={onCreate} className="agent-discounts__primary-btn">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Crear Nuevo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
