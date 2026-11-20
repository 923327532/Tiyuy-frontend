'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { GenericUser, GenericUserTableProps, SearchConfig } from './types';
import type { UserListItem } from '@/core/domain/entities/Admin';
import { getDefaultColumns } from './helpers';
import { SearchInput } from './components/SearchInput';
import { TableHeader } from './components/TableHeader';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { DataRows } from './components/DataRows';

/** Main GenericUserTable component */
export function GenericUserTable<T extends GenericUser>({
  data,
  userTypeConfig,
  extraColumns = [],
  actions = [],
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  isLoading = false,
  emptyMessage = 'No se encontraron usuarios',
  emptyIcon,
  className = '',
  search,
  striped = true,
  hoverable = true,
  rowClassName,
}: GenericUserTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get search config
  const searchConfig = search === false ? null : (search ?? {
    placeholder: 'Buscar...',
    debounceMs: 300,
    searchFields: [
      { key: 'email', label: 'Email', getValue: (u) => (u as UserListItem).email ?? '' },
      { key: 'name', label: 'Nombre', getValue: (u) => `${(u as UserListItem).firstName} ${(u as UserListItem).lastName}`.toLowerCase() },
    ],
  });
  const fallbackSearchConfig: SearchConfig = searchConfig ?? { placeholder: 'Buscar...', debounceMs: 300, searchFields: [] };
  const searchPlaceholder = searchConfig?.placeholder ?? 'Buscar...';

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchConfig || !searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((user) => {
      return searchConfig.searchFields.some((field) => {
        const value = field.getValue(user).toLowerCase();
        return value.includes(query);
      });
    });
  }, [data, searchQuery, searchConfig]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy as keyof T];
      const bVal = b[sortBy as keyof T];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = String(aVal).localeCompare(String(bVal), 'es', { numeric: true });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortBy, sortOrder]);

  // Handle sort
  const handleSort = useCallback((key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // Handle selection
  const getRowKey = (row: T) => String(userTypeConfig.getRowKey(row));
  const allSelected = sortedData.length > 0 && sortedData.every((row) =>
    selectedRows.some((r) => getRowKey(r) === getRowKey(row))
  );
  const someSelected = sortedData.length > 0 && sortedData.some((row) =>
    selectedRows.some((r) => getRowKey(r) === getRowKey(row))
  );

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(sortedData);
    } else {
      onSelectionChange([]);
    }
  };

  const handleRowSelect = (row: T, checked: boolean) => {
    if (!onSelectionChange) return;
    const key = getRowKey(row);
    if (checked) {
      onSelectionChange([...selectedRows, row]);
    } else {
      onSelectionChange(selectedRows.filter((r) => getRowKey(r) !== key));
    }
  };

  // Get default columns
  const defaultColumns = getDefaultColumns(userTypeConfig, actions, onRowClick);
  const allColumns = [...defaultColumns, ...extraColumns];

  // Loading skeleton
  if (isLoading) {
    return (
      <LoadingState<T>
        className={className}
        columns={allColumns}
        placeholder={searchPlaceholder}
        searchConfig={fallbackSearchConfig}
        showSelection={Boolean(onSelectionChange)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    );
  }

  // Empty state
  if (sortedData.length === 0) {
    return (
      <EmptyState
        className={className}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={searchPlaceholder}
        searchConfig={fallbackSearchConfig}
        emptyMessage={emptyMessage}
        emptyIcon={emptyIcon}
      />
    );
  }

  return (
    <div className={`generic-table__container ${className}`}>
      {/* Search Bar */}
      {searchConfig && (
        <div className="generic-table__search-bar">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={searchConfig.placeholder ?? 'Buscar...'}
            config={searchConfig}
          />
          {searchQuery && (
            <span className="generic-table__results-count">
              {sortedData.length} de {data.length} resultados
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="generic-table__wrapper">
        <table className="generic-table" role="table">
          <TableHeader<T>
            columns={allColumns}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectAll={onSelectionChange ? { allSelected, someSelected, onSelectAll: handleSelectAll } : undefined}
          />
          <tbody className="generic-table__body">
            <DataRows<T>
              rows={sortedData}
              columns={allColumns}
              getRowKey={getRowKey}
              selectedRows={selectedRows}
              onRowSelect={onSelectionChange ? handleRowSelect : undefined}
              onRowClick={onRowClick}
              striped={striped}
              hoverable={hoverable}
              rowClassName={rowClassName}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

GenericUserTable.displayName = 'GenericUserTable';
