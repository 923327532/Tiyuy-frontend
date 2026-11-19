import type { UserListItem, InternationalUserListItem } from '@/core/domain/entities/Admin';
import type { UserTypeConfig, GenericUser } from '../types';
import { getFullName, getInitials } from '@/presentation/components/admin/users/utils/users.utils';
import { getFullName as getIntlFullName, getInitials as getIntlInitials } from '@/presentation/components/admin/international/components/list/cards/InternationalCardConfig';
import { DOC_TYPE_LABELS } from '@/presentation/components/admin/international/config/international.constants';

/**
 * Configuration for regular users (UserListItem)
 * Used for: Agents, Developers, Regular Users, Admins
 */
export const REGULAR_USER_CONFIG: UserTypeConfig<UserListItem> = {
  type: 'regular',
  getDisplayName: getFullName,
  getEmail: (user) => user.email,
  getInitials,
  getAvatarUrl: (user) => user.profilePhotoUrl,
  getCountry: (user) => user.country,
  getDocumentType: (user) => 'DNI',
  getDocumentNumber: (user) => user.dni,
  getRegisteredAt: (user) => user.createdAt,
  getStatus: (user) => ({
    label: user.enabled ? 'Activo' : 'Suspendido',
    variant: user.enabled ? 'success' : 'danger',
  }),
  isDisabled: (user) => !user.enabled,
  getRowKey: (user) => user.id,
};

/**
 * Configuration for international users (InternationalUserListItem)
 * Used for: Extranjeros/Foreigners
 */
export const INTERNATIONAL_USER_CONFIG: UserTypeConfig<InternationalUserListItem> = {
  type: 'international',
  getDisplayName: getIntlFullName,
  getEmail: (user) => user.email,
  getInitials: getIntlInitials,
  getAvatarUrl: (user) => user.selfieImageUrl, // Use selfie as avatar for international users
  getCountry: (user) => user.issuingCountry,
  getDocumentType: (user) => DOC_TYPE_LABELS[user.internationalDocumentType] ?? user.internationalDocumentType ?? '—',
  getDocumentNumber: (user) => user.internationalDocumentNumber,
  getRegisteredAt: (user) => user.createdAt,
  getStatus: (user) => {
    switch (user.verificationStatus) {
      case 'VERIFIED':
        return { label: 'Verificado', variant: 'success' };
      case 'PENDING':
        return { label: 'Pendiente', variant: 'warning' };
      case 'REJECTED':
        return { label: 'Rechazado', variant: 'danger' };
      case 'MANUAL_REVIEW':
        return { label: 'Revisión manual', variant: 'info' };
      default:
        return { label: user.verificationStatus, variant: 'neutral' };
    }
  },
  isDisabled: (user) => !user.enabled,
  getRowKey: (user) => user.userId,
};

/**
 * Type guard to check if user is international
 */
export function isInternationalUser(user: GenericUser): user is InternationalUserListItem {
  return 'userId' in user && 'internationalDocumentType' in user;
}

/**
 * Type guard to check if user is regular
 */
export function isRegularUser(user: GenericUser): user is UserListItem {
  return 'id' in user && 'dni' in user && 'role' in user;
}

/**
 * Get the appropriate config based on user type
 */
export function getUserTypeConfig(user: GenericUser): UserTypeConfig<GenericUser> {
  if (isInternationalUser(user)) {
    return INTERNATIONAL_USER_CONFIG as UserTypeConfig<GenericUser>;
  }
  return REGULAR_USER_CONFIG as UserTypeConfig<GenericUser>;
}
