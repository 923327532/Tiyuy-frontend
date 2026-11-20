'use client';

import { SlidersHorizontal } from 'lucide-react';

import type { AgenciesFiltersProps } from '@/presentation/components/admin/agencies/types/agencies.types';

import { SearchField } from './components/SearchField';
import { SelectField } from './components/SelectField';
import { ClearFiltersButton } from './components/ClearFiltersButton';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

export function AgenciesFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  planFilter,
  onPlanChange,
  discountFilter,
  onDiscountChange,
  sortBy,
  onSortChange,
  statusOptions,
  planOptions,
  discountOptions,
  sortOptions,
}: AgenciesFiltersProps) {
  const hasFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== '' ||
    planFilter !== '' ||
    discountFilter !== '' ||
    sortBy !== 'name';

  return (
    <section className="users-filters" aria-label="Filtros de inmobiliarias">
      <div className="users-filters__main">
        <SearchField value={searchQuery} onChange={onSearchChange} placeholder="Buscar por nombre o RUC..." />

        <div className="users-filters__selects">
          <SelectField
            label="Filtrar por estado"
            value={statusFilter}
            onChange={onStatusChange}
            options={statusOptions}
            icon={<SlidersHorizontal />}
          />
          <SelectField
            label="Filtrar por plan"
            value={planFilter}
            onChange={onPlanChange}
            options={planOptions}
          />
          <SelectField
            label="Filtrar por descuento"
            value={discountFilter}
            onChange={onDiscountChange}
            options={discountOptions}
          />
          <SelectField
            label="Ordenar por"
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
          />
        </div>

        {hasFilters && <ClearFiltersButton onClick={() => {
          onSearchChange('');
          onStatusChange('');
          onPlanChange('');
          onDiscountChange('');
          onSortChange('name');
        }} />}
      </div>
    </section>
  );
}