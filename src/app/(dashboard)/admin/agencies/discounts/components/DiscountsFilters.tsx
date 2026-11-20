'use client';

import { ChevronDown, Download, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { Card } from '@/presentation/components/ui/Card';
import { FilterState, STATUS_OPTIONS } from '../types';

interface DiscountsFiltersProps {
  filters: FilterState;
  developers: { id: number; name: string }[];
  hasFilters: boolean;
  canManageDiscounts: boolean;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  onExport: () => void;
  onApply: () => void;
  onCreate: () => void;
}

export function DiscountsFilters({
  filters,
  developers,
  hasFilters,
  canManageDiscounts,
  showFilters,
  setShowFilters,
  onFilterChange,
  onClearFilters,
  onExport,
  onApply,
  onCreate,
}: DiscountsFiltersProps) {
  return (
    <>
      <section className="users-filters" aria-label="Filtros de descuentos">
        <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
          <div className="users-filters__search" style={{ minWidth: 220 }}>
            <Search className="users-filters__search-icon" aria-hidden="true" />
            <input
              type="search"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              placeholder="Buscar por código..."
              className="users-filters__input"
              aria-label="Buscar descuentos"
            />
            {filters.searchQuery && (
              <button
                type="button"
                className="users-filters__search-clear"
                onClick={() => onFilterChange('searchQuery', '')}
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
                value={filters.statusFilter}
                onChange={(e) => onFilterChange('statusFilter', e.target.value)}
                className="users-filters__select"
                aria-label="Filtrar por estado"
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="users-filters__chevron" aria-hidden="true" />
            </label>

            <label className="users-filters__select-wrapper">
              <span className="users-filters__sr-only">Filtrar por inmobiliaria</span>
              <select
                value={filters.developerFilter}
                onChange={(e) => onFilterChange('developerFilter', e.target.value)}
                className="users-filters__select"
                aria-label="Filtrar por inmobiliaria"
              >
                <option value="">Todas las inmobiliarias</option>
                {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown className="users-filters__chevron" aria-hidden="true" />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {hasFilters && (
              <button type="button" onClick={onClearFilters} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1">
                Limpiar
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={() => setShowFilters(!showFilters)}
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
            {canManageDiscounts && (
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
              >
                <Plus className="h-4 w-4" />
                <span>Crear</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-medium">Filtros Avanzados</h3>
            <button className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm" onClick={() => setShowFilters(false)}>✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Fecha desde</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Fecha hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Descuento mínimo %</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm"
                onClick={onApply}
              >
                Aplicar
              </button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
