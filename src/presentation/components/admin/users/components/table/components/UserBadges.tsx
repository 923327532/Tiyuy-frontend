'use client';

import { Badge } from '@/presentation/components/ui/Badge';
import { ROLE_LABELS } from '@/presentation/components/admin/users/userRoleConfig';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserIdentityLike } from '@/presentation/components/admin/users/types/users.types';

export function RoleBadge({ user }: { user: UserListItem }) {
  const role = user.role ?? 'USER';
  const variant = role === 'ADMIN' ? 'danger' : role === 'AGENT' ? 'info' : role === 'DEVELOPER' ? 'brand' : 'neutral';

  return (
    <Badge variant={variant as any} size="sm" className={`users-table__badge users-table__badge--${variant}`}>
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}

export function StatusBadge({ user }: { user: UserIdentityLike }) {
  const variant = user.enabled ? 'success' : 'danger';
  return (
    <Badge variant={variant} size="sm" dot className={`users-table__badge users-table__badge--${variant}`}>
      {user.enabled ? 'Activo' : 'Suspendido'}
    </Badge>
  );
}

export function VerificationBadges({ user }: { user: UserIdentityLike }) {
  const emailVariant = user.emailVerified ? 'success' : 'warning';
  const phoneVariant = user.phoneVerified ? 'success' : 'warning';

  return (
    <div className="users-table__verification">
      <Badge variant={emailVariant} size="xs" dot className={`users-table__badge users-table__badge--sm users-table__badge--${emailVariant}`}>
        Email
      </Badge>
      <Badge variant={phoneVariant} size="xs" dot className={`users-table__badge users-table__badge--sm users-table__badge--${phoneVariant}`}>
        Tel
      </Badge>
    </div>
  );
}
