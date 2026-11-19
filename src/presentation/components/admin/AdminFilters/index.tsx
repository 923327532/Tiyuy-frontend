'use client';

import { useAdminFilters } from './hooks/useAdminFilters';
import {
  FilterField,
  FiltersHeader,
  FiltersSearch,
} from './components';
import type { AdminFiltersProps } from './types';

export function AdminFilters({
  onSearchChange,
  onFilterChange,
  searchPlaceholder = 'Buscar...',
  filters = [],
  onClear,
}: AdminFiltersProps) {
  const {
    searchValue,
    filterValues,
    hasActiveFilters,
    handleSearchChange,
    handleFilterChange,
    handleClear,
  } = useAdminFilters({
    filters,
    onSearchChange,
    onFilterChange,
    onClear,
  });

  return (
    <section
      aria-label="Filtros administrativos"
      className="
        w-full rounded-2xl border border-white/10
        bg-[#0f2e3a] p-4 shadow-lg shadow-black/10
        sm:p-5
      "
    >
      <FiltersHeader
        hasActiveFilters={hasActiveFilters}
        onClear={handleClear}
      />

      <FiltersSearch
        value={searchValue}
        placeholder={searchPlaceholder}
        onChange={handleSearchChange}
        onClear={() => handleSearchChange('')}
      />

      {filters.length > 0 && (
        <div
          className="
            mt-5 grid grid-cols-1 gap-4
            border-t border-white/10 pt-5
            sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          "
        >
          {filters.map((filter) => (
            <FilterField
              key={filter.key}
              filter={filter}
              value={filterValues[filter.key]}
              onChange={handleFilterChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export type {
  AdminFilterConfig,
  AdminFiltersProps,
  AdminFilterType,
  DateRangeValue,
  FilterOption,
  FilterValue,
} from './types';
