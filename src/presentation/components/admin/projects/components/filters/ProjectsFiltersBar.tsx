'use client';

import { ChevronDown, Download, Search, SlidersHorizontal, X } from 'lucide-react';
import { PROJECT_LIFECYCLE_OPTIONS, PROJECT_STATUS_OPTIONS } from './projects.config';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  lifecycleFilter: string;
  onLifecycleChange: (value: string) => void;
  hasFilter: boolean;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  onExport: () => void;
}

export function ProjectsFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  lifecycleFilter,
  onLifecycleChange,
  hasFilter,
  onClearFilters,
  onToggleFilters,
  onExport,
}: Props) {
  return (
    <section className="users-filters" aria-label="Filtros de proyectos">
      <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
        <div className="users-filters__search" style={{ minWidth: 220 }}>
          <Search className="users-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar proyecto, desarrollador o correo..."
            className="users-filters__input"
            aria-label="Buscar proyectos"
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
              onChange={(e) => onStatusChange(e.target.value)}
              className="users-filters__select"
              aria-label="Filtrar por estado"
            >
              {PROJECT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="users-filters__chevron" aria-hidden="true" />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por ciclo de vida</span>
            <select
              value={lifecycleFilter}
              onChange={(e) => onLifecycleChange(e.target.value)}
              className="users-filters__select"
              aria-label="Filtrar por ciclo de vida"
            >
              {PROJECT_LIFECYCLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
