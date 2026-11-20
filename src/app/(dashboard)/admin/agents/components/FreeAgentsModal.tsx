'use client';

import { useState } from 'react';
import { CalendarDays, Users, X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import { SECONDARY_BUTTON } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';
import '@/presentation/components/ui/GenericUserTable/GenericUserTable.css';

interface FreeAgentItem {
  agentId: number;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  potentialRevenue: number;
  createdAt: string;
}

interface FreeAgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  freeAgentList?: FreeAgentItem[];
  lostPotentialRevenue?: number;
  freeAgentsCount?: number;
}

const PAGE_SIZE = 5;

export default function FreeAgentsModal({
  isOpen,
  onClose,
  freeAgentList,
  lostPotentialRevenue,
  freeAgentsCount,
}: FreeAgentsModalProps) {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const filteredAgents = (freeAgentList ?? []).filter((agent) => {
    if (!dateRange.start && !dateRange.end) return true;
    const agentDate = new Date(agent.createdAt);
    if (dateRange.start && agentDate < dateRange.start) return false;
    if (dateRange.end && agentDate > dateRange.end) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedAgents = filteredAgents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasFilters = Boolean(dateRange.start || dateRange.end);

  const clearFilters = () => {
    setDateRange({});
    setPage(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title="Agentes Free - Potencial Perdido">
              Agentes Free - Potencial Perdido
            </h3>
            <p className="user-detail-modal__email">
              {freeAgentsCount ?? freeAgentList?.length ?? 0} agentes sin plan activo
            </p>
            <div className="user-detail-modal__badges">
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">
                Agentes
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="user-detail-modal__close-btn"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="user-detail-modal__content">
          <section className="users-filters" aria-label="Filtros de agentes free">
            <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
              <div className="users-filters__selects" style={{ flexWrap: 'wrap' }}>
                <div className="users-filters__search" style={{ flex: '0 1 12rem' }}>
                  <CalendarDays className="users-filters__search-icon" aria-hidden="true" />
                  <input
                    type="date"
                    className="users-filters__input"
                    value={dateRange.start ? dateRange.start.toISOString().slice(0, 10) : ''}
                    onChange={(event) => {
                      setDateRange((prev) => ({
                        ...prev,
                        start: event.target.value ? new Date(event.target.value) : undefined,
                      }));
                      setPage(1);
                    }}
                    aria-label="Fecha de inicio"
                  />
                </div>
                <div className="users-filters__search" style={{ flex: '0 1 12rem' }}>
                  <CalendarDays className="users-filters__search-icon" aria-hidden="true" />
                  <input
                    type="date"
                    className="users-filters__input"
                    value={dateRange.end ? dateRange.end.toISOString().slice(0, 10) : ''}
                    onChange={(event) => {
                      setDateRange((prev) => ({
                        ...prev,
                        end: event.target.value ? new Date(event.target.value) : undefined,
                      }));
                      setPage(1);
                    }}
                    aria-label="Fecha de fin"
                  />
                </div>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`${SECONDARY_BUTTON} h-[2.625rem]`}
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="mt-4 space-y-3">
            {paginatedAgents.length === 0 ? (
              <div className="generic-table__empty">
                <Users className="generic-table__empty-icon" aria-hidden="true" />
                <p className="generic-table__empty-message">Sin agentes free</p>
                <p className="generic-table__empty-hint">No hay agentes que coincidan con el filtro.</p>
              </div>
            ) : (
              paginatedAgents.map((agent) => (
                <div
                  key={agent.agentId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,46,58,0.04)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
                      {agent.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {agent.firstName} {agent.lastName}
                      </p>
                      <p className="truncate text-xs text-slate-500">{agent.email}</p>
                      <p className="mt-0.5 text-xs text-slate-400">Sin plan activo</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      ${agent.potentialRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">potencial</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
              <span className="text-xs text-slate-500">
                Mostrando {(safePage - 1) * PAGE_SIZE + 1} -{' '}
                {Math.min(safePage * PAGE_SIZE, filteredAgents.length)} de {filteredAgents.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  className={SECONDARY_BUTTON}
                >
                  Anterior
                </button>
                <span className="text-xs font-medium text-slate-600">
                  Página {safePage} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={safePage === totalPages}
                  className={SECONDARY_BUTTON}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,46,58,0.04)]">
            <span className="text-sm font-medium text-slate-500">Potencial Total Perdido</span>
            <span className="text-xl font-bold text-slate-900">
              ${(lostPotentialRevenue ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        <footer className="user-detail-modal__footer">
          <button
            type="button"
            onClick={onClose}
            className={`${SECONDARY_BUTTON} user-detail-modal__close-action`}
          >
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}
