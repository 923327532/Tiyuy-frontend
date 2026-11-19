'use client';

import { useState } from 'react';
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
  const [draftSearch, setDraftSearch] = useState(searchQuery);

  const hasFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'all' ||
    Boolean(roleFilter);

  return (
    <section className="users-filters" aria-label="Filtros de usuarios">
      <div className="users-filters__main">
        <form
          className="flex min-w-0 flex-1 items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchChange(draftSearch.trim());
          }}
        >
          <SearchField value={draftSearch} onChange={setDraftSearch} />
          <button
            type="submit"
            className="inline-flex h-[2.625rem] min-w-24 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#164e63] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0f3d50]"
          >
            Buscar
          </button>
        </form>

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

        {hasFilters && (
          <ClearFiltersButton
            onClick={() => {
              setDraftSearch('');
              onClear();
            }}
          />
        )}
      </div>
    </section>
  );
}
