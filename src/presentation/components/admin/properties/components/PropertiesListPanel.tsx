'use client';

import {
  UsersEmptyState,
  UsersErrorState,
  UsersLoadingState,
} from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';

import type { PropertiesListPanelProps } from '../types/properties.types';
import { PropertiesCardView } from './PropertiesCardView';
import { PropertiesFilters } from './PropertiesFilters';
import { PropertiesTable } from './PropertiesTable';

export function PropertiesListPanel({
  properties,
  totalElements,
  isLoading,
  error,
  filters,
  setFilters,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  viewMode,
  setViewMode,
  selectedProperties,
  setSelectedProperties,
  columns,
  canModerate,
  canFeature,
  onViewDetail,
  onModerate,
  onToggleFeatured,
  onDisable,
  onEnable,
  onClearFilters,
  onRetry,
}: PropertiesListPanelProps) {
  const hasProperties = properties.length > 0;

  const pagination = (
    <UsersPagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalElements={totalElements}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemLabel="propiedades"
    />
  );

  const actions = {
    onViewDetail,
    onModerate,
    onToggleFeatured,
    onDisable,
    onEnable,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <PropertiesFilters filters={filters} setFilters={setFilters} onClear={onClearFilters} />

      {!isLoading && hasProperties && <UsersViewToggle value={viewMode} onChange={setViewMode} />}

      {isLoading && <UsersLoadingState message="Cargando propiedades..." />}
      {Boolean(error) && <UsersErrorState error={error} onRetry={onRetry} />}
      {!isLoading && !error && !hasProperties && (
        <UsersEmptyState
          onClear={onClearFilters}
          title="No se encontraron propiedades"
          description="Intenta ajustar tu búsqueda o los filtros aplicados."
        />
      )}

      {!isLoading && !error && hasProperties && viewMode === 'table' && (
        <>
          <PropertiesTable
            properties={properties}
            columns={columns}
            selectedProperties={selectedProperties}
            onSelectionChange={setSelectedProperties}
            canModerate={canModerate}
            canFeature={canFeature}
            isLoading={isLoading}
            {...actions}
          />
          {pagination}
        </>
      )}

      {!isLoading && !error && hasProperties && viewMode === 'cards' && (
        <>
          <PropertiesCardView properties={properties} onViewDetail={onViewDetail} />
          {pagination}
        </>
      )}
    </div>
  );
}
