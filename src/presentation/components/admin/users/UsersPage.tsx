'use client';

import { useMemo } from 'react';
import { AdminBulkOperations } from '@/presentation/components/admin/AdminBulkOperations/AdminBulkOperations';
import { UsersHeader, UsersStats, UsersListPanel, UsersModalsPanel } from './components';
import { getUserConditionalColumns, getUsersSummary } from './config';
import { useUsers } from './hooks/useUsers';

export function UsersPage() {
  const u = useUsers();

  const summary = useMemo(
    () => getUsersSummary(u.users, u.totalElements),
    [u.users, u.totalElements],
  );

  const conditionalColumns = useMemo(
    () => getUserConditionalColumns(u.filters.roleFilter),
    [u.filters.roleFilter],
  );

  const displayUser = u.userDetailData || u.selectedUser;

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-3 sm:py-4">
      <UsersHeader />

      <UsersStats
        totalUsers={summary.totalUsers}
        activeUsers={summary.activeUsers}
        pendingUsers={summary.pendingUsers}
        suspendedUsers={summary.suspendedUsers}
        usersByRole={summary.usersByRole}
      />

      <UsersListPanel
        users={u.users}
        totalElements={u.totalElements}
        isLoading={u.isLoading}
        error={u.error}
        filters={u.filters}
        setFilters={u.setFilters}
        currentPage={u.currentPage}
        setCurrentPage={u.setCurrentPage}
        pageSize={u.pageSize}
        setPageSize={u.setPageSize}
        viewMode={u.viewMode}
        setViewMode={u.setViewMode}
        selectedUsers={u.selectedUsers}
        setSelectedUsers={u.setSelectedUsers}
        columns={conditionalColumns}
        canManageUsers={u.canManageUsers}
        canDeleteUsers={u.canDeleteUsers}
        toggleStatusPending={u.toggleStatusMutation.isPending}
        pendingUserId={u.toggleStatusMutation.isPending ? u.selectedUser?.id ?? null : null}
        onViewDetail={u.handleViewUser}
        onToggleStatus={u.canManageUsers ? u.handleToggleStatus : undefined}
        onDelete={u.canDeleteUsers ? u.handleDeleteUser : undefined}
        onViewProperties={u.handleViewProperties}
        onViewProjects={u.handleViewProjects}
        onClearFilters={u.handleClearFilters}
        onRetry={u.refetch}
      />

      {u.selectedUsers.length > 0 && (
        <AdminBulkOperations
          selectedItems={u.selectedUsers}
          onClearSelection={() => u.setSelectedUsers([])}
          onOperationComplete={u.refetch}
          itemType="users"
        />
      )}

      <UsersModalsPanel
        selectedUser={u.selectedUser}
        displayUser={displayUser}
        isViewModalOpen={u.isViewModalOpen}
        isLoadingDetail={u.isLoadingDetail}
        isRoleModalOpen={u.isRoleModalOpen}
        isToggleModalOpen={u.isToggleModalOpen}
        isDeleteModalOpen={u.isDeleteModalOpen}
        isPropertiesModalOpen={u.isPropertiesModalOpen}
        isProjectsModalOpen={u.isProjectsModalOpen}
        userPropertiesData={u.userPropertiesData ?? null}
        isLoadingProperties={u.isLoadingProperties}
        userProjectsData={u.userProjectsData ?? null}
        isLoadingProjects={u.isLoadingProjects}
        isEmailVerifying={u.verifyEmailMutation.isPending}
        isPhoneVerifying={u.verifyPhoneMutation.isPending}
        togglePending={u.toggleStatusMutation.isPending}
        deletePending={u.deleteUserMutation.isPending}
        onCloseDetail={() => {
          u.setIsViewModalOpen(false);
          u.setDetailUserId(null);
        }}
        onCloseRole={() => u.setIsRoleModalOpen(false)}
        onCloseToggle={() => u.setIsToggleModalOpen(false)}
        onCloseDelete={() => u.setIsDeleteModalOpen(false)}
        onCloseProperties={() => u.setIsPropertiesModalOpen(false)}
        onCloseProjects={() => u.setIsProjectsModalOpen(false)}
        onVerifyEmail={u.handleVerifyEmail}
        onVerifyPhone={u.handleVerifyPhone}
        onViewProperties={u.handleViewProperties}
        onViewProjects={u.handleViewProjects}
        onConfirmRole={u.confirmRoleChange}
        onConfirmToggle={u.confirmToggleStatus}
        onConfirmDelete={u.confirmDeleteUser}
      />
    </div>
  );
}
