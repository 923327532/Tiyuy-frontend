'use client';

import type { UserCardViewProps } from '@/presentation/components/admin/users/types/users.types';
import { UserCard } from './UserCard';

export function UserCardView({
  users,
  onViewDetail,
  onToggleStatus,
  onDelete,
  canManage,
  canDelete,
}: UserCardViewProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {users.map((user) => (
        <li key={user.id}>
          <UserCard
            user={user}
            onViewDetail={onViewDetail}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            canManage={canManage}
            canDelete={canDelete}
          />
        </li>
      ))}
    </ul>
  );
}
