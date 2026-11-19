'use client';

import { useEffect, useState } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type { AgenciesFiltersState } from '@/presentation/components/admin/agencies/types/agencies.types';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { AgenciesFilters } from './filters';
import { AgenciesTable } from './table';
import { AgencyCardView } from './cards/AgencyCardView';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersLoadingState, UsersErrorState, UsersEmptyState } from '@/presentation/components/admin/users/components/page-feedback';
import { AGENCIES_STATUS_OPTIONS, AGENCIES_PLAN_OPTIONS, AGENCIES_DISCOUNT_OPTIONS, AGENCIES_SORT_OPTIONS } from '../config/agencies.constants';

interface AgenciesListPanelProps {
  agencies: InmobiliariaWithStats[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;
  filters: AgenciesFiltersState;
  setFilters: (updates: Partial<AgenciesFiltersState>) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedAgencies: InmobiliariaWithStats[];
  setSelectedAgencies: (agencies: InmobiliariaWithStats[]) => void;
  canManage: boolean;
  onSelectAgency: (agency: InmobiliariaWithStats) => void;
  onNotifyAgency?: (agency: InmobiliariaWithStats) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

export function AgenciesListPanel({
  agencies,
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
  selectedAgencies,
  setSelectedAgencies,
  canManage,
  onSelectAgency,
  onNotifyAgency,
  onClearFilters,
  onRetry,
}: AgenciesListPanelProps) {
  const hasAgencies = agencies.length > 0;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const effectiveViewMode: ViewMode = viewMode;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <AgenciesFilters
        searchQuery={filters.searchQuery}
        onSearchChange={(value) => setFilters({ searchQuery: value })}
        statusFilter={filters.statusFilter}
        onStatusChange={(value) => setFilters({ statusFilter: value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | '' })}
        planFilter={filters.planFilter}
        onPlanChange={(value) => setFilters({ planFilter: value })}
        discountFilter={filters.discountFilter}
        onDiscountChange={(value) => setFilters({ discountFilter: value })}
        sortBy={filters.sortBy}
        onSortChange={(value) => setFilters({ sortBy: value })}
        statusOptions={AGENCIES_STATUS_OPTIONS}
        planOptions={AGENCIES_PLAN_OPTIONS}
        discountOptions={AGENCIES_DISCOUNT_OPTIONS}
        sortOptions={AGENCIES_SORT_OPTIONS}
      />

      {!isLoading && hasAgencies && (
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-end">
          <UsersViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      )}

      {isLoading && <UsersLoadingState />}
      {Boolean(error) && <UsersErrorState error={error} onRetry={onRetry} />}
      {!isLoading && !error && !hasAgencies && <UsersEmptyState onClear={onClearFilters} />}

      {!isLoading && !error && hasAgencies && effectiveViewMode === 'table' && (
        <>
          <AgenciesTable
            agencies={agencies}
            columns={[]}
            selectedAgencyId={selectedAgencies[0]?.id}
            recentlyUpdatedAgencyId={null}
            onSelectAgency={onSelectAgency}
            onNotifyAgency={onNotifyAgency}
            isLoading={isLoading}
          />
          <UsersPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {!isLoading && !error && hasAgencies && effectiveViewMode === 'cards' && (
        <>
          <AgencyCardView
            agencies={agencies}
            onSelectAgency={onSelectAgency}
            onNotifyAgency={onNotifyAgency}
            canManage={canManage}
          />
          <UsersPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}