'use client';

import type { InternationalUserListItem } from '@/core/domain/entities/Admin';
import { InternationalCard } from './InternationalCard';

interface Props {
  users: InternationalUserListItem[];
  canReview?: boolean;
  onViewDetail: (user: InternationalUserListItem) => void;
  onApprove?: (user: InternationalUserListItem) => void;
  onReject?: (user: InternationalUserListItem) => void;
}

export function InternationalCardView({ users, canReview, onViewDetail, onApprove, onReject }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {users.map((user) => (
        <li key={user.userId}>
          <InternationalCard
            user={user}
            canReview={canReview}
            onViewDetail={onViewDetail}
            onApprove={onApprove}
            onReject={onReject}
          />
        </li>
      ))}
    </ul>
  );
}
