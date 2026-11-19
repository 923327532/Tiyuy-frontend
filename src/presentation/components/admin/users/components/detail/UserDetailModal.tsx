'use client';

import { useState } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { UserDetailModalProps } from '@/presentation/components/admin/users/types/users.types';
import { getAccountState } from './model/accountState';
import {
  SECONDARY_BUTTON,
  type DetailTab,
} from './ui/detailParts';

import { ModalHeader } from './components/ModalHeader';
import { ModalTabs } from './components/ModalTabs';
import { ModalContent } from './components/ModalContent';
import './styles/UserDetailModal.css';

export function UserDetailModal({
  user,
  extras,
  isOpen,
  isLoading,
  onClose,
  onVerifyEmail,
  onVerifyPhone,
  onViewProperties,
  onViewProjects,
  onResolveCancellation,
  isEmailVerifying,
  isPhoneVerifying,
  isResolvingCancellation,
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!user) return null;

  const accountState = getAccountState(user, extras);

  const securityBadge =
    (extras?.openAlerts?.length ?? 0) + (!user.emailVerified ? 1 : 0);

  const openClaimsCount = (extras?.formalClaims ?? extras?.claims ?? []).filter(
    (c) =>
      c.status === 'OPEN' ||
      c.status === 'IN_REVIEW' ||
      c.status === 'PENDING' ||
      c.status === 'IN_PROGRESS',
  ).length;

  const openTicketsCount = (extras?.openTickets ?? extras?.tickets ?? []).filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS',
  ).length;

  const pendingCancellationsCount = (
    extras?.cancellationRequests ??
    (extras?.cancellationRequest ? [extras.cancellationRequest] : [])
  ).filter((r) => r.status === 'REQUESTED' || r.status === 'PENDING').length;

  const supportBadge =
    openClaimsCount + openTicketsCount + pendingCancellationsCount;

  const tabProps = {
    user,
    extras,
    loading: isLoading,
    goToTab: setActiveTab,
    onVerifyEmail,
    onVerifyPhone,
    onViewProperties,
    onViewProjects,
    isEmailVerifying,
    isPhoneVerifying,
    onResolveCancellation,
    isResolvingCancellation,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-detail-modal__surface">
        <ModalHeader user={user} accountState={accountState} onClose={onClose} />

        <ModalTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          securityBadge={securityBadge}
          supportBadge={supportBadge}
        />

        <ModalContent
          activeTab={activeTab}
          isLoading={isLoading}
          hasExtras={Boolean(extras)}
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