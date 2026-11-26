'use client';

import { ChevronDown, Download, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  BANNER_STATUS_FILTERS,
  PLACEMENT_OPTIONS,
  type BannerStatusFilter,
} from '../config/banners.config';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placement: string;
  onPlacementChange: (value: string) => void;
  status: BannerStatusFilter;
  onStatusChange: (value: BannerStatusFilter) => void;
  hasFilter: boolean;
  onClearFilters: () => void;
  onExport: () => void;
  resultCount?: number;
  totalCount?: number;
}

export function BannersFiltersBar({
  searchQuery,
  onSearchChange,
  placement,
  onPlacementChange,
  status,
  onStatusChange,
  hasFilter,
  onClearFilters,
  onExport,
  resultCount,
  totalCount,
}: Props) {
  return (
    <section className="users-filters" aria-label="Filtros de banners">
      <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
        <div className="users-filters__search" style={{ minWidth: 220 }}>
          <Search className="users-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título o descripción..."
            className="users-filters__input"
            aria-label="Buscar banners"
          />
          {searchQuery && (
            <button
              type="button"
              className="users-filters__search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="users-filters__selects" style={{ flexWrap: 'wrap' }}>
          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por estado</span>
            <span className="users-filters__select-icon" aria-hidden="true">
              <SlidersHorizontal />
            </span>
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value as BannerStatusFilter)}
              className="users-filters__select"
              aria-label="Filtrar por estado"
            >
              {BANNER_STATUS_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="users-filters__chevron" aria-hidden="true" />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por ubicación</span>
            <select
              value={placement}
              onChange={(event) => onPlacementChange(event.target.value)}
              className="users-filters__select"
              aria-label="Filtrar por ubicación"
            >
              <option value="all">Todas las ubicaciones</option>
              {PLACEMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="users-filters__chevron" aria-hidden="true" />
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginLeft: 'auto',
            flexWrap: 'wrap',
          }}
        >
          {typeof resultCount === 'number' && typeof totalCount === 'number' && (
            <span className="hidden text-xs text-slate-500 lg:inline">
              {resultCount} de {totalCount}
            </span>
          )}

          {hasFilter && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1"
            >
              Limpiar
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={onExport}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
