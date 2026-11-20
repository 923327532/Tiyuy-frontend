'use client';

import { useState } from 'react';

import {
  GroupsHeader,
  GroupsListPanel,
  GroupsStats,
  useGroupsAdmin,
} from '@/presentation/components/admin/groups';

import { CreateGroupModal } from './components/new-group';
import { ViewDetailsModal } from './components/modals/ViewDetailsModal';
import { ToggleStatusModal } from './components/modals/ToggleStatusModal';
import { SuspendModal } from './components/modals/SuspendModal';
import { ViolationModal } from './components/modals/ViolationModal';
import { ReactivateModal } from './components/modals/ReactivateModal';

export default function GroupsAndChannelsPage() {
  const groups = useGroupsAdmin();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-3 sm:py-4">
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

      <ViewDetailsModal
        isOpen={groups.isViewModalOpen}
        onClose={() => groups.setIsViewModalOpen(false)}
        item={groups.selectedItem}
        viewType={groups.viewType}
      />

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

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </div>
  );
}
