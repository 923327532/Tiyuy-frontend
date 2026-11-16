'use client';

import { SlidersHorizontal } from 'lucide-react';

import type { UsersFiltersProps } from '@/presentation/components/admin/users/types/users.types';

import { SearchField } from './components/SearchField';
import { SelectField } from './components/SelectField';
import { ClearFiltersButton } from './components/ClearFiltersButton';
import './styles/UsersFilters.css';

export function UsersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  onClear,
  statusOptions,
  roleOptions,
}: UsersFiltersProps) {
  const hasFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'all' ||
    Boolean(roleFilter);

  return (
    <section className="users-filters" aria-label="Filtros de usuarios">
      <div className="users-filters__main">
        <SearchField value={searchQuery} onChange={onSearchChange} />

        <div className="users-filters__selects">
          <SelectField
            label="Filtrar por estado"
            value={statusFilter}
            onChange={onStatusChange}
            options={statusOptions}
            icon={<SlidersHorizontal />}
          />
          <SelectField
            label="Filtrar por rol"
            value={roleFilter}
            onChange={onRoleChange}
            options={roleOptions}
          />
        </div>

        {hasFilters && <ClearFiltersButton onClick={onClear} />}
      </div>
    </section>
  );
}
