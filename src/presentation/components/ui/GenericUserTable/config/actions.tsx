import type { UserListItem, InternationalUserListItem } from '@/core/domain/entities/Admin';
import type { GenericAction } from '../types';

/**
 * Common action creators for regular users
 */
export function createRegularUserActions(
  handlers: {
    onViewDetail?: (user: UserListItem) => void;
    onToggleStatus?: (user: UserListItem) => void;
    onDelete?: (user: UserListItem) => void;
    onViewProperties?: (user: UserListItem) => void;
    onViewProjects?: (user: UserListItem) => void;
  },
  permissions: {
    canManage: boolean;
    canDelete: boolean;
    toggleStatusPending?: boolean;
    pendingUserId?: number | null;
  }
): GenericAction<UserListItem>[] {
  const { onViewDetail, onToggleStatus, onDelete, onViewProperties, onViewProjects } = handlers;
  const { canManage, canDelete, toggleStatusPending, pendingUserId } = permissions;

  const actions: GenericAction<UserListItem>[] = [];

  // Build actions using explicit conditional logic that TypeScript can follow
  if (canManage && onToggleStatus) {
    actions.push({
      key: 'toggleStatus',
      label: (user: UserListItem) => (user.enabled ? 'Suspender' : 'Activar'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      variant: 'ghost',
      show: () => true,
      disabled: (user: UserListItem) => Boolean(toggleStatusPending && pendingUserId !== null && pendingUserId !== undefined && pendingUserId === user.id),
      onClick: (user, e) => {
        e.stopPropagation();
        onToggleStatus?.(user);
      },
      ariaLabel: (user: UserListItem) => `${user.enabled ? 'Suspender' : 'Activar'} a ${user.email}`,
    });
  }

  if (onViewProperties) {
    actions.push({
      key: 'viewProperties',
      label: 'Ver propiedades',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      variant: 'ghost',
      show: (user) => user.role === 'AGENT' && Boolean(user.publishedPropertiesCount && user.publishedPropertiesCount > 0),
      onClick: (user, e) => {
        e.stopPropagation();
        onViewProperties?.(user);
      },
      ariaLabel: (user) => `Ver propiedades de ${user.email}`,
    });
  }

  if (onViewProjects) {
    actions.push({
      key: 'viewProjects',
      label: 'Ver proyectos',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      variant: 'ghost',
      show: (user) => user.role === 'DEVELOPER' && Boolean(user.publishedProjectsCount && user.publishedProjectsCount > 0),
      onClick: (user, e) => {
        e.stopPropagation();
        onViewProjects?.(user);
      },
      ariaLabel: (user) => `Ver proyectos de ${user.email}`,
    });
  }

  if (canDelete && onDelete) {
    actions.push({
      key: 'delete',
      label: 'Eliminar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      variant: 'danger',
      show: () => true,
      onClick: (user, e) => {
        e.stopPropagation();
        onDelete?.(user);
      },
      ariaLabel: (user) => `Eliminar a ${user.email}`,
    });
  }

  return actions;
}

/**
 * Common action creators for international users
 */
export function createInternationalUserActions(
  handlers: {
    onViewDetail?: (user: InternationalUserListItem) => void;
    onApprove?: (user: InternationalUserListItem) => void;
    onReject?: (user: InternationalUserListItem) => void;
  },
  canReview: boolean = false
): GenericAction<InternationalUserListItem>[] {
  const { onViewDetail, onApprove, onReject } = handlers;

  const actions: GenericAction<InternationalUserListItem>[] = [];

  if (canReview && onApprove) {
    actions.push({
      key: 'approve',
      label: 'Aprobar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      variant: 'primary',
      show: (user) => user.verificationStatus !== 'VERIFIED',
      onClick: (user, e) => {
        e.stopPropagation();
        onApprove?.(user);
      },
      ariaLabel: (user) => `Aprobar a ${user.firstName} ${user.lastName}`,
    });
  }

  if (canReview && onReject) {
    actions.push({
      key: 'reject',
      label: 'Rechazar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      variant: 'danger',
      show: (user) => user.verificationStatus !== 'REJECTED',
      onClick: (user, e) => {
        e.stopPropagation();
        onReject?.(user);
      },
      ariaLabel: (user) => `Rechazar a ${user.firstName} ${user.lastName}`,
    });
  }

  return actions;
}
