'use client';

import { useMemo, useState } from 'react';

import type {
  AdminFilterConfig,
  FilterValue,
} from '../types';
import { isActiveValue } from '../utils';

interface UseAdminFiltersOptions {
  filters: AdminFilterConfig[];
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Record<string, FilterValue>) => void;
  onClear?: () => void;
}

/**
 * Estado y handlers del panel de filtros administrativos.
 */
export function useAdminFilters({
  filters,
  onSearchChange,
  onFilterChange,
  onClear,
}: UseAdminFiltersOptions) {
  const initialValues = useMemo<Record<string, FilterValue>>(() => {
    const entries: Array<[string, FilterValue]> = filters
      .filter(
        (
          filter,
        ): filter is AdminFilterConfig & {
          value: FilterValue;
        } => filter.value !== undefined,
      )
      .map((filter) => [filter.key, filter.value]);

    return Object.fromEntries(entries);
  }, [filters]);

  const initialSignature = useMemo(
    () => JSON.stringify(initialValues),
    [initialValues],
  );

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] =
    useState<Record<string, FilterValue>>(initialValues);

  // Sincroniza los valores externos cuando cambian las configuraciones.
  // Se ajusta el estado durante el render (patrón recomendado por React)
  // en lugar de usar un efecto con setState.
  const [syncedSignature, setSyncedSignature] =
    useState(initialSignature);

  if (syncedSignature !== initialSignature) {
    setSyncedSignature(initialSignature);
    setFilterValues(initialValues);
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleFilterChange = (
    key: string,
    value: FilterValue | undefined,
  ) => {
    const newFilters = { ...filterValues };

    if (value === undefined || !isActiveValue(value)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setSearchValue('');
    setFilterValues({});

    onSearchChange('');
    onFilterChange({});
    onClear?.();
  };

  const hasActiveFilters =
    searchValue.trim().length > 0 ||
    Object.values(filterValues).some(isActiveValue);

  return {
    searchValue,
    filterValues,
    hasActiveFilters,
    handleSearchChange,
    handleFilterChange,
    handleClear,
  };
}
