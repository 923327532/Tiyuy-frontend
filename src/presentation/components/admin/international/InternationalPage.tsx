'use client';

import { useMemo } from 'react';
import { InternationalHeader } from './components/header/InternationalHeader';
import { InternationalStats } from './components/stats/InternationalStats';
import { InternationalFilters } from './components/filters';
import { InternationalListPanel } from './components/list/InternationalListPanel';
import { InternationalDetailModal } from './components/modals/detail';
import { InternationalApproveModal } from './components/modals/approve';
import { InternationalRejectModal } from './components/modals/reject';
import { useInternationalAdmin } from './hooks/useInternationalAdmin';

export function InternationalPage() {
  const intl = useInternationalAdmin();

  const selectedIsOpen = useMemo(() => Boolean(intl.selected), [intl.selected]);
  const approveIsOpen = useMemo(() => Boolean(intl.approveTarget), [intl.approveTarget]);

  return (
    <div className="space-y-4 px-3 py-3 sm:space-y-6 sm:px-6 sm:py-4">
      <InternationalHeader />
      <InternationalStats counts={intl.counts} />

      <InternationalFilters
        value={intl.statusFilter}
        onChange={intl.setStatusFilter}
        counts={intl.counts}
        searchQuery={intl.searchQuery}
        onSearchChange={intl.setSearchQuery}
      />

      <InternationalListPanel
        users={intl.filtered}
        isLoading={intl.isLoading}
        hasFilter={intl.statusFilter !== 'ALL' || intl.searchQuery.trim().length > 0}
        page={intl.page}
        pageSize={intl.pageSize}
        totalElements={intl.total}
        canReview={intl.canReview}
        onPageChange={intl.setPage}
        onPageSizeChange={intl.setPageSize}
        onViewDetail={intl.setSelected}
        onApprove={intl.handleApprove}
        onReject={intl.handleOpenReject}
      />

      <InternationalDetailModal
        user={intl.selected}
        isOpen={selectedIsOpen}
        canReview={intl.canReview}
        approvePending={intl.approvePending}
        rejectPending={intl.rejectPending}
        onClose={() => intl.setSelected(null)}
        onApprove={intl.handleApprove}
        onReject={intl.handleOpenReject}
      />

      <InternationalApproveModal
        user={intl.approveTarget}
        isOpen={approveIsOpen}
        isPending={intl.approvePending}
        onClose={intl.closeApproveModal}
        onConfirm={intl.handleConfirmApprove}
      />

      <InternationalRejectModal
        isOpen={intl.showRejectModal}
        reason={intl.rejectReason}
        isPending={intl.rejectPending}
        onReasonChange={intl.setRejectReason}
        onClose={intl.closeRejectModal}
        onConfirm={intl.handleReject}
      />
    </div>
  );
}