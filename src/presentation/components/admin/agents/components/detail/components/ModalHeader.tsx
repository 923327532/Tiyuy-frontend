'use client';

import { X } from 'lucide-react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import { getAgentFullName, getAgentInitials } from '../ui/agentDetailParts';
import { ACCOUNT_STATE_META, type AgentAccountState } from '../model/accountState';

interface ModalHeaderProps {
  agent: AgentListItem;
  accountState: AgentAccountState;
  onClose: () => void;
}

export function ModalHeader({ agent, accountState, onClose }: ModalHeaderProps) {
  const fullName = getAgentFullName(agent);
  const stateMeta = ACCOUNT_STATE_META[accountState];

  return (
    <header className="user-detail-modal__header">
      {agent.profilePhotoUrl ? (
        <img
          src={agent.profilePhotoUrl}
          alt=""
          className={`user-detail-modal__avatar ${!agent.enabled ? 'user-detail-modal__avatar--disabled' : ''}`}
        />
      ) : (
        <span
          className={`user-detail-modal__avatar user-detail-modal__avatar--fallback ${
            !agent.enabled ? 'user-detail-modal__avatar--disabled' : ''
          }`}
        >
          {getAgentInitials(agent)}
        </span>
      )}

      <div className="user-detail-modal__identity">
        <h3 className="user-detail-modal__name" title={fullName}>{fullName}</h3>
        <p className="user-detail-modal__email" title={agent.email}>{agent.email}</p>

        <div className="user-detail-modal__badges">
          <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">
            Agente
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${stateMeta.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stateMeta.dot}`} aria-hidden="true" />
            {stateMeta.label}
          </span>
        </div>
      </div>

      <button type="button" onClick={onClose} className="user-detail-modal__close-btn" aria-label="Cerrar modal">
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </header>
  );
}
