'use client';

import { Landmark, SlidersHorizontal } from 'lucide-react';

import { ClearFiltersButton } from '@/presentation/components/admin/users/components/filters/components/ClearFiltersButton';
import { SearchField } from '@/presentation/components/admin/users/components/filters/components/SearchField';
import { SelectField } from '@/presentation/components/admin/users/components/filters/components/SelectField';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

import {
  DISCOUNT_SOURCE_OPTIONS,
  DISCOUNT_STATUS_OPTIONS,
} from '../../config/discounts.config';
import { ActivityDateField } from './ActivityDateField';
import type { RecentActivityFilters as Filters } from './useRecentActivity';

type FilterField = 'sourceFilter' | 'statusFilter' | 'dateFrom' | 'dateTo';

interface Props {
  filters: Filters;
  hasFilter: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (field: FilterField, value: string) => void;
  onClear: () => void;
}

export function RecentActivityFilters({
  filters,
  hasFilter,
  onSearchChange,
  onFilterChange,
  onClear,
}: Props) {
  return (
    <section className="users-filters activity-filters" aria-label="Filtros de actividad reciente">
      <div className="users-filters__main" style={{ flexWrap: 'wrap' }}>
        <div className="flex min-w-[220px] flex-1">
          <SearchField
            value={filters.searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar por código o asignado..."
            ariaLabel="Buscar actividad por código o asignado"
          />
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

        <ActivityDateField
          label="Desde"
          value={filters.dateFrom}
          onChange={(value) => onFilterChange('dateFrom', value)}
        />

        <ActivityDateField
          label="Hasta"
          value={filters.dateTo}
          onChange={(value) => onFilterChange('dateTo', value)}
        />

        {hasFilter && <ClearFiltersButton onClick={onClear} />}
      </div>
    </section>
  );
}
