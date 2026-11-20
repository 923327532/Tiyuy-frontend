'use client';

import { useState } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { AgencyDetailModalProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import { SECONDARY_BUTTON } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import type { DetailTab } from './ui/detailParts';

import { ModalHeader } from './components/ModalHeader';
import { ModalTabs } from './components/ModalTabs';
import { ModalContent } from './components/ModalContent';
import './styles/AgencyDetailModal.css';

export function AgencyDetailModal({
  agency,
  agents,
  discounts,
  stats,
  statusHistory,
  historyPage,
  totalHistoryPages,
  totalHistoryElements,
  onHistoryPageChange,
  onClearHistory,
  onDeleteHistoryEntry,
  onClose,
  onActivate,
  onSuspend,
  onBlock,
  onCreateDiscount,
  onApplyDirectDiscount,
  onNotify,
  isChangingStatus = false,
  isLoading = false,
}: AgencyDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!agency) return null;

  const agentsCount = agents?.length || 0;
  const discountsCount = discounts?.length || 0;
  const historyCount = totalHistoryElements || 0;

  const tabProps = {
    agency,
    agents: agents || [],
    discounts: discounts || [],
    stats,
    statusHistory: statusHistory || [],
    historyPage,
    totalHistoryPages,
    totalHistoryElements,
    onHistoryPageChange,
    onClearHistory,
    onDeleteHistoryEntry,
    onActivate,
    onSuspend,
    onBlock,
    onCreateDiscount,
    onApplyDirectDiscount,
    onNotify,
    isChangingStatus,
    loading: isLoading,
  };

  return (
    <Modal isOpen onClose={onClose} size="xl">
      <div className="user-detail-modal__surface">
        <ModalHeader agency={agency} onClose={onClose} />

        <ModalTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          agentsCount={agentsCount}
          discountsCount={discountsCount}
          historyCount={historyCount}
        />

        <ModalContent
          activeTab={activeTab}
          isLoading={isLoading}
          hasExtras={Boolean(agents?.length || discounts?.length || statusHistory?.length)}
          tabProps={tabProps}
        />

        <footer className="user-detail-modal__footer">
          <button
            type="button"
            onClick={onClose}
            className={`${SECONDARY_BUTTON} user-detail-modal__close-action`}
          >
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}
