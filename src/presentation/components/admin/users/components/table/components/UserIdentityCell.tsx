'use client';

import type { UserListItem } from '@/core/domain/entities/Admin';
import { getFullName, getInitials } from '@/presentation/components/admin/users/utils/users.utils';

export function UserIdentityCell({ user }: { user: UserListItem }) {
  const isDisabled = !user.enabled;

  return (
    <div className="users-table__user-cell">
      {user.profilePhotoUrl ? (
        <img
          src={user.profilePhotoUrl}
          alt=""
          className={`users-table__avatar ${isDisabled ? 'users-table__avatar--disabled' : ''}`}
        />
      ) : (
        <div className={`users-table__avatar users-table__avatar--fallback ${isDisabled ? 'users-table__avatar--disabled' : ''}`}>
          {getInitials(user)}
        </div>
      )}
      <div className="users-table__user-info">
        <div className="users-table__email" title={user.email}>{user.email}</div>
        <div className="users-table__name" title={getFullName(user)}>{getFullName(user)}</div>
      </div>
    </div>
  );
}
