'use client';

import { IconButton } from '@/presentation/components/ui/Button';
import type { UserListItem } from '@/core/domain/entities/Admin';
import { shouldShowProduction } from '@/presentation/components/admin/users/utils/users.utils';
import { useAuthStore } from '@/presentation/store/authStore';

interface RowActionsProps {
  user: UserListItem;
  canManage: boolean;
  canDelete: boolean;
  toggleStatusPending?: boolean;
  pendingUserId?: number | null;
  onViewDetail: (user: UserListItem) => void;
  onToggleStatus?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
}

export function RowActions({
  user,
  canManage,
  canDelete,
  toggleStatusPending,
  pendingUserId,
  onViewDetail,
  onToggleStatus,
  onDelete,
  onViewProperties,
  onViewProjects,
}: RowActionsProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isSelf = Number(user.id) === Number(currentUserId);
  const isProtectedSuperAdmin =
    (user as UserListItem & { adminRoleType?: string }).adminRoleType === 'SUPER_ADMIN' ||
    user.email?.toLowerCase() === 'superadmin@tiyuy.com';
  const isProtected = isSelf || isProtectedSuperAdmin;

  const hasActiveAssets =
    (user.publishedPropertiesCount ?? 0) > 0 || (user.publishedProjectsCount ?? 0) > 0;

  return (
    <div className="users-table__actions" onClick={(e) => e.stopPropagation()}>
      <IconButton
        variant="ghost"
        size="sm"
        className="users-table__action-btn users-table__action-btn--view"
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        ariaLabel={`Ver detalle de ${user.email}`}
        onClick={() => onViewDetail(user)}
      />

      {canManage && onToggleStatus && !isProtected && (
        <IconButton
          variant="ghost"
          size="sm"
          className={`users-table__action-btn users-table__action-btn--toggle ${user.enabled ? 'users-table__action-btn--suspend' : 'users-table__action-btn--activate'}`}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
          ariaLabel={user.enabled ? `Suspender a ${user.email}` : `Activar a ${user.email}`}
          onClick={() => onToggleStatus(user)}
          disabled={toggleStatusPending && pendingUserId === user.id}
        />
      )}

      {canDelete && onDelete && !isProtected && !hasActiveAssets && (
        <IconButton
          variant="danger"
          size="sm"
          className="users-table__action-btn users-table__action-btn--delete"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
          ariaLabel={`Eliminar a ${user.email}`}
          onClick={() => onDelete(user)}
        />
      )}

      {shouldShowProduction(user) && Boolean(user.publishedPropertiesCount && user.publishedPropertiesCount > 0) && (
        <IconButton
          variant="ghost"
          size="sm"
          className="users-table__action-btn users-table__action-btn--properties"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          ariaLabel={`Ver propiedades de ${user.email}`}
          onClick={() => onViewProperties(user)}
        />
      )}

      {user.role === 'DEVELOPER' && Boolean(user.publishedProjectsCount && user.publishedProjectsCount > 0) && (
        <IconButton
          variant="ghost"
          size="sm"
          className="users-table__action-btn users-table__action-btn--projects"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          ariaLabel={`Ver proyectos de ${user.email}`}
          onClick={() => onViewProjects(user)}
        />
      )}
    </div>
  );
}