'use client';

import { UsersEmptyState, UsersErrorState, UsersLoadingState } from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';

import type {
  GroupItem,
  GroupsFiltersState,
  GroupsSuspendedFilter,
  GroupsViewMode,
  GroupsViewType,
} from '../types';
import { GroupCardView } from './GroupCardView';
import { GroupsFilters } from './GroupsFilters';
import { GroupsTable } from './GroupsTable';

interface GroupsListPanelProps {
  items: GroupItem[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;
  filters: GroupsFiltersState;
  setFilters: (updates: Partial<GroupsFiltersState>) => void;
  viewType: GroupsViewType;
  setViewType: (value: GroupsViewType) => void;
  suspendedFilter: GroupsSuspendedFilter;
  setSuspendedFilter: (value: GroupsSuspendedFilter) => void;
  viewMode: GroupsViewMode;
  setViewMode: (mode: GroupsViewMode) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  cityOptions: string[];
  onClearFilters: () => void;
  onRetry: () => void;
  onViewDetail: (item: GroupItem) => void;
  onToggleStatus: (item: GroupItem) => void;
  onSuspend: (item: GroupItem) => void;
  onViolation: (item: GroupItem) => void;
  onReactivate: (item: GroupItem) => void;
}

export function GroupsListPanel({
  items,
  totalElements,
  isLoading,
  error,
  filters,
  setFilters,
  viewType,
  setViewType,
  suspendedFilter,
  setSuspendedFilter,
  viewMode,
  setViewMode,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  cityOptions,
  onClearFilters,
  onRetry,
  onViewDetail,
  onToggleStatus,
  onSuspend,
  onViolation,
  onReactivate,
}: GroupsListPanelProps) {
  const hasItems = items.length > 0;
  const itemLabel = viewType === 'channels' ? 'canales' : viewType === 'suspended' ? 'elementos' : 'grupos';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <GroupsFilters
        filters={filters}
        setFilters={setFilters}
        viewType={viewType}
        setViewType={setViewType}
        suspendedFilter={suspendedFilter}
        setSuspendedFilter={setSuspendedFilter}
        cityOptions={cityOptions}
        onClear={onClearFilters}
      />

      {!isLoading && hasItems && <UsersViewToggle value={viewMode} onChange={setViewMode} />}

      {isLoading && <UsersLoadingState message="Cargando grupos y canales..." />}
      {Boolean(error) && <UsersErrorState error={error} onRetry={onRetry} />}
      {!isLoading && !error && !hasItems && (
        <UsersEmptyState
          onClear={onClearFilters}
          title="No se encontraron grupos o canales"
          description="Intenta ajustar tu búsqueda o criterios de filtro."
        />
      )}

      {!isLoading && !error && hasItems && viewMode === 'table' && (
        <>
          <GroupsTable
            items={items}
            viewType={viewType}
            isLoading={isLoading}
            onViewDetail={onViewDetail}
            onToggleStatus={onToggleStatus}
            onSuspend={onSuspend}
            onViolation={onViolation}
            onReactivate={onReactivate}
          />
          <UsersPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel={itemLabel}
          />
        </>
      )}

      {!isLoading && !error && hasItems && viewMode === 'cards' && (
        <>
          <GroupCardView
            items={items}
            viewType={viewType}
            onViewDetail={onViewDetail}
            onToggleStatus={onToggleStatus}
            onSuspend={onSuspend}
            onViolation={onViolation}
            onReactivate={onReactivate}
          />
          <UsersPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel={itemLabel}
          />
        </>
      )}
    </div>
  );
}
