'use client';

import { Landmark, Search, SlidersHorizontal, X } from 'lucide-react';

import { ClearFiltersButton } from '@/presentation/components/admin/users/components/filters/components/ClearFiltersButton';
import { SelectField } from '@/presentation/components/admin/users/components/filters/components/SelectField';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

import {
  DISCOUNT_SOURCE_OPTIONS,
  DISCOUNT_STATUS_OPTIONS,
  hasDiscountFilters,
  type DiscountFilterState,
} from '../../config/discounts.config';

interface Props {
  filters: DiscountFilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (field: 'sourceFilter' | 'statusFilter', value: string) => void;
  onClear: () => void;
}

export function DiscountsFilters({ filters, onSearchChange, onFilterChange, onClear }: Props) {
  return (
    <section className="users-filters discounts-filters" aria-label="Filtros de descuentos">
      <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
        <div className="users-filters__search" style={{ minWidth: 220 }}>
          <Search className="users-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por código, asignado o nota..."
            className="users-filters__input"
            aria-label="Buscar descuentos por código, asignado o nota"
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="users-filters__search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Borrar búsqueda"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="users-filters__selects" style={{ flexWrap: 'wrap' }}>
          <SelectField
            label="Filtrar por origen"
            value={filters.sourceFilter}
            onChange={(value) => onFilterChange('sourceFilter', value)}
            options={DISCOUNT_SOURCE_OPTIONS}
            icon={<Landmark />}
          />
          <SelectField
            label="Filtrar por estado"
            value={filters.statusFilter}
            onChange={(value) => onFilterChange('statusFilter', value)}
            options={DISCOUNT_STATUS_OPTIONS}
            icon={<SlidersHorizontal />}
          />
        </div>

        {hasDiscountFilters(filters) && <ClearFiltersButton onClick={onClear} />}
      </div>
    </section>
  );
}
