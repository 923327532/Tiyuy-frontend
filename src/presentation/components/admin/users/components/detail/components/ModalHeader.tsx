'use client';

import { X } from 'lucide-react';
import type { UserListItem } from '@/core/domain/entities/Admin';
import { getFullName, getInitials } from '@/presentation/components/admin/users/utils/users.utils';
import { ROLE_LABELS } from '@/presentation/components/admin/users/userRoleConfig';
import { AccountStateBadge } from '../account/AccountStateBadge';
import type { UserAccountState } from '../model/accountState';

interface ModalHeaderProps {
  user: UserListItem;
  accountState: UserAccountState;
  onClose: () => void;
}

export function ModalHeader({ user, accountState, onClose }: ModalHeaderProps) {
  const fullName = getFullName(user);
  const role = user.role ?? 'USER';

  return (
    <header className="user-detail-modal__header">
      {user.profilePhotoUrl ? (
        <img
          src={user.profilePhotoUrl}
          alt=""
          className={`user-detail-modal__avatar ${!user.enabled ? 'user-detail-modal__avatar--disabled' : ''}`}
        />
      ) : (
        <span className={`user-detail-modal__avatar user-detail-modal__avatar--fallback ${!user.enabled ? 'user-detail-modal__avatar--disabled' : ''}`}>
          {getInitials(user)}
        </span>
      )}

      <div className="user-detail-modal__identity">
        <h3 className="user-detail-modal__name" title={fullName}>{fullName}</h3>
        <p className="user-detail-modal__email" title={user.email}>{user.email}</p>

        <div className="user-detail-modal__badges">
          <span className={`user-detail-modal__role-badge user-detail-modal__role-badge--${role.toLowerCase()}`}>
            {ROLE_LABELS[role] ?? role}
          </span>
          <AccountStateBadge state={accountState} className="user-detail-modal__state-badge" />
        </div>
      </div>

      <button type="button" onClick={onClose} className="user-detail-modal__close-btn" aria-label="Cerrar modal">
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </header>
  );
}
