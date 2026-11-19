'use client';

import { SlidersHorizontal } from 'lucide-react';

import { ClearFiltersButton } from '@/presentation/components/admin/users/components/filters/components/ClearFiltersButton';
import { SearchField } from '@/presentation/components/admin/users/components/filters/components/SearchField';
import { SelectField } from '@/presentation/components/admin/users/components/filters/components/SelectField';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

import { PROPERTIES_STATUS_OPTIONS } from '../config/properties.constants';
import type { PropertiesFiltersState } from '../types/properties.types';

interface PropertiesFiltersProps {
  filters: PropertiesFiltersState;
  setFilters: (updates: Partial<PropertiesFiltersState>) => void;
  onClear: () => void;
}

export function PropertiesFilters({ filters, setFilters, onClear }: PropertiesFiltersProps) {
  const hasFilters =
    filters.searchQuery.trim().length > 0 || filters.statusFilter !== 'all';

  return (
    <section className="users-filters" aria-label="Filtros de propiedades">
      <div className="users-filters__main">
        <SearchField
          value={filters.searchQuery}
          onChange={(value) => setFilters({ searchQuery: value })}
          placeholder="Buscar por título, propietario o distrito..."
        />

        <div className="users-filters__selects">
          <SelectField
            label="Filtrar por estado"
            value={filters.statusFilter}
            onChange={(value) => setFilters({ statusFilter: value })}
            options={PROPERTIES_STATUS_OPTIONS}
            icon={<SlidersHorizontal />}
          />
        </div>

        {hasFilters && <ClearFiltersButton onClick={onClear} />}
      </div>
    </section>
  );
}
