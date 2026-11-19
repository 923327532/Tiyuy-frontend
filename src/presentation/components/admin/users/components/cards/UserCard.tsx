'use client';

import type { UserListItem } from '@/core/domain/entities/Admin';

import { Badge } from '@/presentation/components/ui/Badge';

import { UserAvatar } from './UserAvatar';
import { UserContactInfo } from './UserContactInfo';
import { UserProductionStats } from './UserProductionStats';
import { UserDates } from './UserDates';
import { UserActions } from './UserActions';
import { ROLE_LABELS, ROLE_VARIANTS, getFullName, getUserLocation, shouldShowProduction } from './Config';

interface UserCardProps {
  user: UserListItem;
  onViewDetail: (user: UserListItem) => void;
  onToggleStatus?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  canManage?: boolean;
  canDelete?: boolean;
}

export function UserCard({ user, onViewDetail, onToggleStatus, onDelete, canManage, canDelete }: UserCardProps) {
  const fullName = getFullName(user);
  const role = user.role ?? 'USER';

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8CED5] hover:shadow-md ${!user.enabled ? 'bg-slate-50/60' : ''}`}
    >
      {/* INFORMACIÓN PRINCIPAL */}
      <div className="flex-1 p-3 sm:p-4">
        {/* IDENTIDAD */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-[#164E63]" title={fullName}>
                {fullName}
              </h3>
              <p className="mt-0.5 truncate text-xs text-slate-500" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={ROLE_VARIANTS[role] ?? 'neutral'} size="xs">
              {ROLE_LABELS[role] ?? role}
            </Badge>
            <Badge variant={user.enabled ? 'success' : 'danger'} size="xs" dot>
              {user.enabled ? 'Activo' : 'Suspendido'}
            </Badge>
          </div>
        </div>

        {/* CONTACTO */}
        <UserContactInfo user={user} />

        {/* MÉTRICAS */}
        {shouldShowProduction(user) && <UserProductionStats user={user} />}
      </div>

      {/* FECHAS */}
      <UserDates user={user} />

      {/* ACCIONES */}
      <UserActions
        user={user}
        onViewDetail={onViewDetail}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        canManage={canManage}
        canDelete={canDelete}
      />
    </article>
  );
}
