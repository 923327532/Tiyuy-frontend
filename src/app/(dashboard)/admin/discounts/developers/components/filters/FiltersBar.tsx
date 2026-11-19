/**
 * Filters Bar Component
 * Main filter controls for the discounts list
 */

'use client';

import { useState } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import { Search, Filter, ChevronDown, ChevronUp, Download, Plus, X } from 'lucide-react';
import { DeveloperSubscriptionDiscountFilters, DiscountStatus, DiscountType, DiscountApplicabilityScope } from '@/core/domain/entities/DeveloperSubscriptionDiscount';

interface FiltersBarProps {
  filters: DeveloperSubscriptionDiscountFilters;
  onFilterChange: (key: keyof DeveloperSubscriptionDiscountFilters, value: string | number) => void;
  onClearFilters: () => void;
  onSortChange: (sort: string) => void;
  onExport: () => void;
  onCreate: () => void;
  developers: { id: number; name: string }[];
  hasActiveFilters: boolean;
  canManage: boolean;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  sortBy: string;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'EXPIRED', label: 'Expirado' },
  { value: 'REVOKED', label: 'Revocado' },
  { value: 'EXHAUSTED', label: 'Agotado' },
];

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'Todos los tipos' },
  { value: 'PERCENTAGE', label: 'Porcentaje' },
  { value: 'FIXED_AMOUNT', label: 'Importe fijo' },
];

const SCOPE_OPTIONS = [
  { value: 'ALL', label: 'Todos los alcances' },
  { value: 'NEW_CONTRACT', label: 'Nueva contratación' },
  { value: 'RENEWAL', label: 'Renovación' },
  { value: 'BOTH', label: 'Ambos' },
];

const DEVELOPER_OPTIONS = (developers: { id: number; name: string }[]) => [
  { value: '', label: 'Todas las inmobiliarias' },
  ...developers.map(d => ({ value: d.id.toString(), label: d.name })),
];

export default function FiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  onSortChange,
  onExport,
  onCreate,
  developers,
  hasActiveFilters,
  canManage,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  sortBy,
}: FiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilterChange('search', value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    onFilterChange('search', '');
  };

  return (
    <section className="users-filters" aria-label="Filtros de descuentos de suscripción">
      <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
        <div className="users-filters__search" style={{ minWidth: 220 }}>
          <Search className="users-filters__search-icon" aria-hidden="true" />
          <Input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por inmobiliaria, motivo..."
            className="users-filters__input"
            aria-label="Buscar descuentos"
          />
          {searchQuery && (
            <button
              type="button"
              className="users-filters__search-clear"
              onClick={handleSearchClear}
              aria-label="Limpiar búsqueda"
            >
              <X />
            </button>
          )}
        </div>

        <div className="users-filters__selects" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por estado</span>
            <span className="users-filters__select-icon" aria-hidden="true"><Filter /></span>
            <Select
              value={filters.status || 'ALL'}
              onChange={(v: string) => onFilterChange('status', v)}
              options={STATUS_OPTIONS}
              placeholder="Estado"
            />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por tipo</span>
            <Select
              value={filters.type || 'ALL'}
              onChange={(v: string) => onFilterChange('type', v)}
              options={TYPE_OPTIONS}
              placeholder="Tipo"
            />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por alcance</span>
            <Select
              value={filters.applicabilityScope || 'ALL'}
              onChange={(v: string) => onFilterChange('applicabilityScope', v)}
              options={SCOPE_OPTIONS}
              placeholder="Alcance"
            />
          </label>

          <label className="users-filters__select-wrapper">
            <span className="users-filters__sr-only">Filtrar por inmobiliaria</span>
            <Select
              value={filters.developerId?.toString() || ''}
              onChange={(v: string) => onFilterChange('developerId', v ? parseInt(v) : 0)}
              options={DEVELOPER_OPTIONS(developers)}
              placeholder="Inmobiliaria"
            />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1"
            >
              Limpiar
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleAdvancedFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros avanzados</span>
            {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
          {canManage && (
            <Button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              <Plus className="h-4 w-4" />
              <span>Crear</span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}