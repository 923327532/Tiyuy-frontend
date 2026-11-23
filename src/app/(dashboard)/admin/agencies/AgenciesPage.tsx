'use client';

import { useState } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { AgenciesHeader } from '@/presentation/components/admin/agencies/components/header/AgenciesHeader';
import { AgenciesStats } from '@/presentation/components/admin/agencies/components/stats/AgenciesStats';
import { AgenciesListPanel } from '@/presentation/components/admin/agencies/components/AgenciesListPanel';
import { AgencyDetailModal } from '@/presentation/components/admin/agencies/components/detail/AgencyDetailModal';
import { AgencyConfirmStatusModal, AgencyDeleteModal } from '@/presentation/components/admin/agencies/components/modals';
import CreateAgencyDiscountModal from './components/CreateAgencyDiscountModal';
import ApplyDirectDiscountModal from './components/ApplyDirectDiscountModal';
import NotifyAgencyModal from './components/NotifyAgencyModal';
import { useAgencies } from '@/presentation/components/admin/agencies/hooks/useAgencies';

export default function AgenciesPage() {
  const {
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
    selectedAgency,
    setSelectedAgency,
    agencyAgents,
    agencyDiscounts,
    agencyStats,
    statusHistory,
    historyPage,
    setHistoryPage,
    totalHistoryPages,
    totalHistoryElements,
    isCreateDiscountModalOpen,
    setIsCreateDiscountModalOpen,
    isApplyDirectDiscountModalOpen,
    setIsApplyDirectDiscountModalOpen,
    isNotifyModalOpen,
    setIsNotifyModalOpen,
    notifyAgency,
    setNotifyAgency,
    newDiscount,
    setNewDiscount,
    directDiscount,
    setDirectDiscount,
    notificationData,
    setNotificationData,
    changeStatusMutation,
    createDiscountMutation,
    applyDirectDiscountMutation,
    notifyDeveloperMutation,
    clearHistoryMutation,
    deleteHistoryEntryMutation,
    canManageAgencies,
    handleSelectAgency,
    handleBackToList,
    handleChangeStatus,
    handleCreateDiscount,
    handleApplyDirectDiscount,
    handleClearHistory,
    handleDeleteHistoryEntry,
    handleCreateDiscountSubmit,
    handleApplyDirectDiscountSubmit,
    handleNotify,
    handleNotifyAgency,
    handleNotifySubmit,
    handleExport,
    handleClearFilters,
    refetch,
  } = useAgencies();

  const handleActivate = () => handleChangeStatus('ACTIVE');
  const handleSuspend = () => handleChangeStatus('SUSPENDED');
  const handleBlock = () => handleChangeStatus('BLOCKED');

  const [confirmStatusModal, setConfirmStatusModal] = useState<{ agency: InmobiliariaWithStats | null; action: 'activate' | 'suspend' | 'block' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<InmobiliariaWithStats | null>(null);

  const handleToggleStatus = (agency: InmobiliariaWithStats, action: 'activate' | 'suspend' | 'block') => {
    setConfirmStatusModal({ agency, action });
  };

  const handleConfirmToggleStatus = async () => {
    if (!confirmStatusModal) return;
    const { agency, action } = confirmStatusModal;
    const statusMap = { activate: 'ACTIVE', suspend: 'SUSPENDED', block: 'BLOCKED' };
    await handleChangeStatus(statusMap[action]);
    setConfirmStatusModal(null);
  };

  const handleOpenDeleteModal = (agency: InmobiliariaWithStats) => {
    setDeleteModal(agency);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    // TODO: Implement delete agency mutation
    alert('Eliminar inmobiliaria - implementar mutación');
    setDeleteModal(null);
  };

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <AgenciesHeader onExport={handleExport} />

      {selectedAgency ? (
        <AgencyDetailModal
          agency={selectedAgency}
          agents={agencyAgents}
          discounts={agencyDiscounts}
          stats={agencyStats}
          statusHistory={statusHistory}
          historyPage={historyPage}
          totalHistoryPages={totalHistoryPages}
          totalHistoryElements={totalHistoryElements}
          onHistoryPageChange={setHistoryPage}
          onClearHistory={handleClearHistory}
          onDeleteHistoryEntry={handleDeleteHistoryEntry}
          onClose={handleBackToList}
          onActivate={handleActivate}
          onSuspend={handleSuspend}
          onBlock={handleBlock}
          onCreateDiscount={handleCreateDiscount}
          onApplyDirectDiscount={handleApplyDirectDiscount}
          onNotify={handleNotify}
          isChangingStatus={changeStatusMutation.isPending}
          isLoading={isLoading}
          isFullscreen={true}
        />
      ) : (
        <>
          <AgenciesStats agencies={agencies} loading={isLoading} />

          <AgenciesListPanel
            agencies={agencies}
            totalElements={totalElements}
            isLoading={isLoading}
            error={error}
            filters={filters}
            setFilters={setFilters}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedAgencies={selectedAgencies}
            setSelectedAgencies={setSelectedAgencies}
            canManage={canManageAgencies}
            onSelectAgency={handleSelectAgency}
            onNotifyAgency={handleNotifyAgency}
            onClearFilters={handleClearFilters}
            onRetry={refetch}
          />
        </>
      )}

      <AgencyConfirmStatusModal
        agency={confirmStatusModal?.agency || null}
        isOpen={!!confirmStatusModal}
        onClose={() => setConfirmStatusModal(null)}
        onConfirm={handleConfirmToggleStatus}
        isPending={changeStatusMutation.isPending}
        action={confirmStatusModal?.action || 'activate'}
      />

      <AgencyDeleteModal
        agency={deleteModal}
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleConfirmDelete}
        isPending={false}
      />

      <CreateAgencyDiscountModal
        isOpen={isCreateDiscountModalOpen}
        onClose={() => setIsCreateDiscountModalOpen(false)}
        selectedAgency={selectedAgency}
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        onCreate={handleCreateDiscountSubmit}
        isPending={createDiscountMutation.isPending}
      />

      <ApplyDirectDiscountModal
        isOpen={isApplyDirectDiscountModalOpen}
        onClose={() => setIsApplyDirectDiscountModalOpen(false)}
        selectedAgency={selectedAgency}
        directDiscount={directDiscount}
        setDirectDiscount={setDirectDiscount}
        onApply={handleApplyDirectDiscountSubmit}
        isPending={applyDirectDiscountMutation.isPending}
      />

      <NotifyAgencyModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setNotifyAgency(null);
        }}
        selectedAgency={notifyAgency}
        notificationData={notificationData}
        setNotificationData={setNotificationData}
        onSend={handleNotifySubmit}
        isPending={notifyDeveloperMutation.isPending}
      />
    </div>
  );
}