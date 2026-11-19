'use client';

import { useEffect, useState } from 'react';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UsersFiltersState, UserTableColumn, ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { UsersFilters } from './filters';
import { UsersTable } from './table';
import { UsersPagination } from './pagination';
import { UsersViewToggle } from './view-toolbar';
import { UsersLoadingState, UsersErrorState, UsersEmptyState } from './page-feedback';
import { UserCardView } from './cards';
import { USERS_ROLE_OPTIONS, USERS_STATUS_OPTIONS } from '../config';

interface UsersListPanelProps {
  users: UserListItem[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;
  filters: UsersFiltersState;
  setFilters: (updates: Partial<UsersFiltersState>) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedUsers: UserListItem[];
  setSelectedUsers: (users: UserListItem[]) => void;
  columns: UserTableColumn[];
  canManageUsers: boolean;
  canDeleteUsers: boolean;
  toggleStatusPending: boolean;
  pendingUserId: number | null;
  onViewDetail: (user: UserListItem) => void;
  onToggleStatus?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

export function UsersListPanel({
  users,
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
  selectedUsers,
  setSelectedUsers,
  columns,
  canManageUsers,
  canDeleteUsers,
  toggleStatusPending,
  pendingUserId,
  onViewDetail,
  onToggleStatus,
  onDelete,
  onViewProperties,
  onViewProjects,
  onClearFilters,
  onRetry,
}: UsersListPanelProps) {
  const hasUsers = users.length > 0;
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
      <UsersFilters
        searchQuery={filters.searchQuery}
        onSearchChange={(value) => setFilters({ searchQuery: value })}
        statusFilter={filters.statusFilter}
        onStatusChange={(value) => setFilters({ statusFilter: value as UsersFiltersState['statusFilter'] })}
        roleFilter={filters.roleFilter}
        onRoleChange={(value) => setFilters({ roleFilter: value as UsersFiltersState['roleFilter'] })}
        onClear={onClearFilters}
        statusOptions={USERS_STATUS_OPTIONS}
        roleOptions={USERS_ROLE_OPTIONS}
      />

      {!isLoading && hasUsers && <UsersViewToggle value={viewMode} onChange={setViewMode} />}

      {isLoading && <UsersLoadingState />}
      {Boolean(error) && <UsersErrorState error={error} onRetry={onRetry} />}
      {!isLoading && !error && !hasUsers && <UsersEmptyState onClear={onClearFilters} />}

      {!isLoading && !error && hasUsers && effectiveViewMode === 'table' && (
        <>
          <UsersTable
            users={users}
            columns={columns}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
            onViewDetail={onViewDetail}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onViewProperties={onViewProperties}
            onViewProjects={onViewProjects}
            canManage={canManageUsers}
            canDelete={canDeleteUsers}
            isLoading={isLoading}
            toggleStatusPending={toggleStatusPending}
            pendingUserId={pendingUserId}
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

      {!isLoading && !error && hasUsers && effectiveViewMode === 'cards' && (
        <>
          <UserCardView
            users={users}
            onViewDetail={onViewDetail}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            canManage={canManageUsers}
            canDelete={canDeleteUsers}
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
