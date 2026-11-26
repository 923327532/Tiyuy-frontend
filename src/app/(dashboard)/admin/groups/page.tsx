'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import {
  GroupsHeader,
  GroupsListPanel,
  GroupsStats,
  useGroupsAdmin,
} from '@/presentation/components/admin/groups';

const CreateGroupModal = dynamic(
  () => import('./components/new-group').then((m) => m.CreateGroupModal),
  { ssr: false }
);
const ViewDetailsModal = dynamic(
  () => import('./components/modals/ViewDetailsModal').then((m) => m.ViewDetailsModal),
  { ssr: false }
);
const ToggleStatusModal = dynamic(
  () => import('./components/modals/ToggleStatusModal').then((m) => m.ToggleStatusModal),
  { ssr: false }
);
const SuspendModal = dynamic(
  () => import('./components/modals/SuspendModal').then((m) => m.SuspendModal),
  { ssr: false }
);
const ViolationModal = dynamic(
  () => import('./components/modals/ViolationModal').then((m) => m.ViolationModal),
  { ssr: false }
);
const ReactivateModal = dynamic(
  () => import('./components/modals/ReactivateModal').then((m) => m.ReactivateModal),
  { ssr: false }
);

export default function GroupsAndChannelsPage() {
  const groups = useGroupsAdmin();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <GroupsHeader onCreate={() => setIsCreateGroupModalOpen(true)} />

      <GroupsStats summary={groups.summary} />

      <GroupsListPanel
        items={groups.items}
        totalElements={groups.totalElements}
        isLoading={groups.isLoading}
        error={groups.error}
        filters={groups.filters}
        setFilters={groups.setFilters}
        viewType={groups.viewType}
        setViewType={groups.setViewType}
        suspendedFilter={groups.suspendedFilter}
        setSuspendedFilter={groups.setSuspendedFilter}
        viewMode={groups.viewMode}
        setViewMode={groups.setViewMode}
        currentPage={groups.currentPage}
        setCurrentPage={groups.setCurrentPage}
        pageSize={groups.pageSize}
        setPageSize={groups.setPageSize}
        cityOptions={groups.cityOptions}
        onClearFilters={groups.clearFilters}
        onRetry={groups.refetch}
        onViewDetail={groups.openViewModal}
        onToggleStatus={groups.handleToggleStatus}
        onSuspend={groups.openSuspendModal}
        onViolation={groups.openViolationModal}
        onReactivate={groups.openReactivateModal}
      />

      {groups.isViewModalOpen && groups.selectedItem && (
        <ViewDetailsModal
          isOpen={groups.isViewModalOpen}
          onClose={() => groups.setIsViewModalOpen(false)}
          item={groups.selectedItem}
          viewType={groups.viewType}
        />
      )}

      {groups.isToggleModalOpen && (
        <ToggleStatusModal
          item={groups.selectedItem}
          isOpen={groups.isToggleModalOpen}
          reason={groups.toggleReason}
          setReason={groups.setToggleReason}
          onClose={() => {
            groups.setIsToggleModalOpen(false);
            groups.setToggleReason('');
          }}
          onConfirm={groups.confirmToggleStatus}
          isPending={groups.isTogglePending}
        />
      )}

      {groups.isSuspendModalOpen && (
        <SuspendModal
          isOpen={groups.isSuspendModalOpen}
          onClose={() => {
            groups.setIsSuspendModalOpen(false);
            groups.setSuspendReason('');
          }}
          item={groups.selectedItem}
          reason={groups.suspendReason}
          setReason={groups.setSuspendReason}
          onConfirm={groups.handleSuspend}
          isPending={groups.isSuspendPending}
        />
      )}

      {groups.isViolationModalOpen && (
        <ViolationModal
          isOpen={groups.isViolationModalOpen}
          onClose={() => {
            groups.setIsViolationModalOpen(false);
            groups.setViolationType('CONTENT_VIOLATION');
            groups.setViolationMessage('');
          }}
          item={groups.selectedItem}
          violationType={groups.violationType}
          setViolationType={groups.setViolationType}
          message={groups.violationMessage}
          setMessage={groups.setViolationMessage}
          onConfirm={groups.handleViolation}
          isPending={groups.isViolationPending}
        />
      )}

      {groups.isReactivateModalOpen && (
        <ReactivateModal
          isOpen={groups.isReactivateModalOpen}
          onClose={() => {
            groups.setIsReactivateModalOpen(false);
            groups.setReactivateReason('');
          }}
          item={groups.selectedItem}
          itemType={groups.selectedItemType}
          reason={groups.reactivateReason}
          setReason={groups.setReactivateReason}
          onConfirm={groups.handleReactivate}
          isPending={groups.isReactivatePending}
        />
      )}

      {isCreateGroupModalOpen && (
        <CreateGroupModal
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
        />
      )}
    </div>
  );
}