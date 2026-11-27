'use client';

import { useState } from 'react';
import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import {
  UsersEmptyState,
  UsersErrorState,
  UsersLoadingState,
} from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';

import type { DiscountFilterState } from '../config/discounts.config';
import { DiscountCardView } from './cards/DiscountCardView';
import { DiscountsFilters } from './filters/DiscountsFilters';
import { DiscountsTable } from './table/DiscountsTable';

interface Props {
  discounts: CentralDiscountDto[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;
  filters: DiscountFilterState;
  hasFilter: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (field: 'sourceFilter' | 'statusFilter', value: string) => void;
  onClearFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onRetry: () => void;
}

export function DiscountsListPanel({
  discounts,
  totalElements,
  isLoading,
  error,
  filters,
  hasFilter,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  currentPage,
  setCurrentPage,
  pageSize,
  onPageSizeChange,
  onRetry,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const hasDiscounts = discounts.length > 0;

  const pagination = (
    <UsersPagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalElements={totalElements}
      onPageChange={setCurrentPage}
      onPageSizeChange={onPageSizeChange}
      itemLabel="descuentos"
    />
  );

  return (
    <div className="discounts-panel min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)]">
      <DiscountsFilters
        filters={filters}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        onClear={onClearFilters}
      />

      {!isLoading && hasDiscounts && <UsersViewToggle value={viewMode} onChange={setViewMode} />}

      {isLoading && <UsersLoadingState message="Cargando descuentos..." />}
      {Boolean(error) && <UsersErrorState error={error} onRetry={onRetry} />}
      {!isLoading && !error && !hasDiscounts && (
        <UsersEmptyState
          onClear={onClearFilters}
          title="No se encontraron descuentos"
          description={
            hasFilter
              ? 'Intenta ajustar tu búsqueda o los filtros aplicados.'
              : 'Aún no hay descuentos registrados.'
          }
        />
      )}

      {!isLoading && !error && hasDiscounts && (
        <>
          {viewMode === 'table' ? (
            <DiscountsTable discounts={discounts} />
          ) : (
            <DiscountCardView discounts={discounts} />
          )}
          {pagination}
        </>
      )}
    </div>
  );
}
