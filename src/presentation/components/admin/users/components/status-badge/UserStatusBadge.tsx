'use client';

import { Badge } from '@/presentation/components/ui/Badge';
import type { UserStatusBadgeProps } from '@/presentation/components/admin/users/types/users.types';

import './styles/UserStatusBadge.css';

export function UserStatusBadge({
  enabled,
  emailVerified,
  phoneVerified,
  compact = false,
}: UserStatusBadgeProps) {
  if (compact) {
    return (
      <Badge
        variant={enabled ? 'success' : 'danger'}
        size="sm"
        dot
        className={`user-status-badge user-status-badge--compact user-status-badge--${enabled ? 'active' : 'suspended'}`}
      >
        {enabled ? 'Activo' : 'Suspendido'}
      </Badge>
    );
  }

  return (
    <div className="user-status-badge__group">
      <Badge
        variant={enabled ? 'success' : 'danger'}
        size="sm"
        dot
        className={`user-status-badge user-status-badge--main user-status-badge--${enabled ? 'active' : 'suspended'}`}
      >
        {enabled ? 'Activo' : 'Suspendido'}
      </Badge>

      <Badge
        variant={emailVerified ? 'success' : 'warning'}
        size="xs"
        dot
        className={`user-status-badge user-status-badge--sub user-status-badge--${emailVerified ? 'verified' : 'unverified'}`}
      >
        Email
      </Badge>

      <Badge
        variant={phoneVerified ? 'success' : 'warning'}
        size="xs"
        dot
        className={`user-status-badge user-status-badge--sub user-status-badge--${phoneVerified ? 'verified' : 'unverified'}`}
      >
        Tel
      </Badge>
    </div>
  );
}
