'use client';

import { Plus, Search, X } from 'lucide-react';
import type { AgentListItem } from '@/core/domain/entities/Admin';

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
                      <span className="agent-discounts__agent-meta flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="max-w-full truncate">{agent.email}</span>
                        {agent.dni && (
                          <>
                            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">•</span>
                            <span className="font-medium tabular-nums text-slate-600">DNI: {agent.dni}</span>
                          </>
                        )}
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
        {selectedAgent && (
          <div className="agent-discounts__selected-agent user-detail-modal__header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              {selectedAgent.profilePhotoUrl ? (
                <img src={selectedAgent.profilePhotoUrl} alt="" className="user-detail-modal__avatar shrink-0" />
              ) : (
                <div className="user-detail-modal__avatar user-detail-modal__avatar--fallback flex shrink-0 items-center justify-center">
                  {selectedAgent.firstName?.[0]}{selectedAgent.lastName?.[0]}
                </div>
              )}
              <div className="user-detail-modal__identity min-w-0 flex-1">
                <h3 className="user-detail-modal__name truncate">
                  {selectedAgent.firstName} {selectedAgent.lastName}
                </h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span className="max-w-full truncate" title={selectedAgent.email ?? undefined}>
                    {selectedAgent.email}
                  </span>
                  {selectedAgent.dni && (
                    <>
                      <span className="hidden text-slate-300 sm:inline" aria-hidden="true">•</span>
                      <span className="font-medium tabular-nums text-slate-600">DNI: {selectedAgent.dni}</span>
                    </>
                  )}
                </div>
                <div className="user-detail-modal__badges mt-2 flex flex-wrap items-center gap-1.5">
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
            </div>

            {canManageDiscounts && (
              <div className="agent-discounts__selected-actions flex w-full shrink-0 flex-col items-stretch gap-2 xs:flex-row sm:w-auto sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onOpenAssign}
                  className="agent-discounts__soft-btn flex w-full items-center justify-center sm:w-auto"
                >
                  Asignar Existente
                </button>
                <button
                  type="button"
                  onClick={onCreate}
                  className="agent-discounts__primary-btn flex w-full items-center justify-center sm:w-auto"
                >
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
