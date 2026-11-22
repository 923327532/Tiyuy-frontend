'use client';

import { ChevronDown, Download, Search, SlidersHorizontal, X } from 'lucide-react';
import { STATUS_OPTIONS, VERIFICATION_OPTIONS, PLAN_OPTIONS } from '../../config/agents.config';

interface AgentsFiltersBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  verificationFilter: string;
  planFilter: string;
  onFilterChange: (filters: Record<string, any>) => void;
  hasFilter: boolean;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  onExport: () => void;
}

export function AgentsFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  verificationFilter,
  planFilter,
  onFilterChange,
  hasFilter,
  onClearFilters,
  onToggleFilters,
  onExport,
}: AgentsFiltersBarProps) {
  return (
    <section className="users-filters" aria-label="Filtros de agentes">
      <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
        <div className="users-filters__search" style={{ minWidth: 220 }}>
          <Search className="users-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar agente, nombre o correo..."
            className="users-filters__input"
            aria-label="Buscar agentes"
          />
          {searchQuery && (
            <button
              type="button"
              className="users-filters__search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
            >
              <X />
            </button>
          )}
        </div>

        <div className="users-filters__selects" style={{ flexWrap: 'wrap' }}>
          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por estado</span>
            <span className="users-filters__select-icon" aria-hidden="true"><SlidersHorizontal /></span>
            <select
              value={statusFilter}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="users-filters__select"
              aria-label="Filtrar por estado"
            >
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="users-filters__chevron" aria-hidden="true" />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por verificación</span>
            <select
              value={verificationFilter}
              onChange={(e) => onFilterChange({ verification: e.target.value })}
              className="users-filters__select"
              aria-label="Filtrar por verificación"
            >
              {VERIFICATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="users-filters__chevron" aria-hidden="true" />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por plan</span>
            <select
              value={planFilter}
              onChange={(e) => onFilterChange({ plan: e.target.value })}
              className="users-filters__select"
              aria-label="Filtrar por plan"
            >
              {PLAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="users-filters__chevron" aria-hidden="true" />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {hasFilter && (
            <button type="button" onClick={onClearFilters} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1">
              Limpiar
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={onToggleFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtros avanzados</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
