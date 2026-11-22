'use client';

import { AgentDiscount } from '@/core/domain/entities/AgentDiscount';
import { AgentListItem } from '@/core/domain/entities/Admin';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import { ChevronDown, Inbox, Plus, Search, SlidersHorizontal, Users, X } from 'lucide-react';
import { DiscountCardView } from './DiscountCardView';
import { DiscountHistoryTable } from './DiscountHistoryTable';

interface DiscountHistoryProps {
  selectedAgent: AgentListItem | null;
  isLoading: boolean;
  paginatedDiscounts: AgentDiscount[];
  filteredCount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  canManageDiscounts: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onToggleStatus: (id: number) => void;
  onRemove: (id: number) => void;
}

export function DiscountHistory({
  selectedAgent,
  isLoading,
  paginatedDiscounts,
  filteredCount,
  currentPage,
  setCurrentPage,
  pageSize,
  startIndex,
  endIndex,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  canManageDiscounts,
  onClearFilters,
  onCreate,
  onToggleStatus,
  onRemove,
}: DiscountHistoryProps) {
  return (
    <section className="agent-discounts__surface generic-table__container" aria-label="Historial de descuentos">
      <div className="agent-discounts__panel-head">
        <div>
          <h2 className="agent-discounts__panel-title">Historial de Descuentos</h2>
          <p className="agent-discounts__panel-subtitle">
            {selectedAgent
              ? `Descuentos asignados a ${selectedAgent.firstName} ${selectedAgent.lastName}`
              : 'Selecciona un agente para ver su historial'
            }
          </p>
        </div>
        {selectedAgent && canManageDiscounts && (
          <button type="button" className="agent-discounts__primary-btn" onClick={onCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear Descuento
          </button>
        )}
      </div>

      {/* Toolbar */}
      {selectedAgent && (
        <div className="users-filters agent-discounts__toolbar">
          <div className="users-filters__main">
            <div className="users-filters__search">
              <Search className="users-filters__search-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por código o porcentaje..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="users-filters__input"
                aria-label="Buscar descuentos"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="users-filters__search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  <X />
                </button>
              )}
            </div>

            <div className="users-filters__selects">
              <label className="users-filters__select-wrapper">
                <span className="users-filters__sr-only">Filtrar por estado</span>
                <span className="users-filters__select-icon" aria-hidden="true"><SlidersHorizontal /></span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="users-filters__select"
                  aria-label="Filtrar por estado"
                >
                  <option value="all">Todos los estados</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="EXPIRED">Expirado</option>
                  <option value="USED">Usado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
                <ChevronDown className="users-filters__chevron" aria-hidden="true" />
              </label>
            </div>

            <button type="button" className="agent-discounts__clear-btn" onClick={onClearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* View toggle - same as the users section */}
      {selectedAgent && !isLoading && paginatedDiscounts.length > 0 && (
        <UsersViewToggle value={viewMode} onChange={setViewMode} />
      )}

      {/* Feedback states */}
      {(!selectedAgent || isLoading || paginatedDiscounts.length === 0) && (
        <div className="generic-table__empty">
          {!selectedAgent ? (
            <>
              <Users className="generic-table__empty-icon" aria-hidden="true" />
              <p className="generic-table__empty-message">Selecciona un agente para ver su historial</p>
              <p className="generic-table__empty-hint">Busca por nombre, email o DNI en el paso 1.</p>
            </>
          ) : isLoading ? (
            <>
              <div className="agent-discounts__spinner" aria-hidden="true" />
              <p className="generic-table__empty-message">Cargando descuentos...</p>
            </>
          ) : (
            <>
              <Inbox className="generic-table__empty-icon" aria-hidden="true" />
              <p className="generic-table__empty-message">Sin descuentos asignados</p>
              <p className="generic-table__empty-hint">Este agente todavía no tiene códigos de descuento.</p>
              {canManageDiscounts && (
                <button type="button" className="agent-discounts__empty-link" onClick={onCreate}>
                  Crear primer descuento
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Table view */}
      {selectedAgent && !isLoading && paginatedDiscounts.length > 0 && viewMode === 'table' && (
        <DiscountHistoryTable
          discounts={paginatedDiscounts}
          canManage={canManageDiscounts}
          onToggleStatus={onToggleStatus}
          onRemove={onRemove}
        />
      )}

      {/* Cards view */}
      {selectedAgent && !isLoading && paginatedDiscounts.length > 0 && viewMode === 'cards' && (
        <DiscountCardView
          discounts={paginatedDiscounts}
          canManage={canManageDiscounts}
          onToggleStatus={onToggleStatus}
          onRemove={onRemove}
        />
      )}

      {/* Pagination */}
      {selectedAgent && filteredCount > pageSize && (
        <div className="agent-discounts__footer">
          <div className="agent-discounts__page-info">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCount)} de {filteredCount}
          </div>
          <div className="agent-discounts__pagination">
            <button
              type="button"
              className="agent-discounts__page-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              type="button"
              className="agent-discounts__page-btn"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={endIndex >= filteredCount}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
