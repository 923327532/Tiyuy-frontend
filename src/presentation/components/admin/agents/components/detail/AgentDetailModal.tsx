'use client';

import { useState } from 'react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import { getAccountState } from './model/accountState';
import { SECONDARY_BUTTON, type AgentDetailTab } from './ui/agentDetailParts';
import { ModalHeader } from './components/ModalHeader';
import { ModalTabs } from './components/ModalTabs';
import { ModalContent } from './components/ModalContent';
import type { AgentTabProps } from './tabs';
// Reutilizamos los estilos del modal de usuarios para obtener exactamente el mismo aspecto.
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';

interface AgentDetailModalProps {
  agent: AgentListItem;
  isOpen: boolean;
  onClose: () => void;
  onViewProperties?: (agent: AgentListItem) => void;
}

export function AgentDetailModal({
  agent,
  isOpen,
  onClose,
  onViewProperties,
}: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<AgentDetailTab>('overview');

  if (!agent) return null;

  const accountState = getAccountState(agent);
  const securityBadge = agent.emailVerified ? 0 : 1;

  const tabProps: AgentTabProps = {
    agent,
    goToTab: setActiveTab,
    onViewProperties,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-detail-modal__surface">
        <ModalHeader agent={agent} accountState={accountState} onClose={onClose} />

        <ModalTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          securityBadge={securityBadge}
        />

        <ModalContent activeTab={activeTab} tabProps={tabProps} />

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

export default AgentDetailModal;
