import type { UserListItem } from '@/core/domain/entities/Admin';

/**
 * Role label mapping for regular users
 */
export const ROLE_LABELS: Record<UserListItem['role'], string> = {
  ADMIN: 'Administrador',
  AGENT: 'Agente',
  DEVELOPER: 'Inmobiliaria',
  USER: 'Usuario',
};

/**
 * Role badge variant mapping
 */
export const ROLE_BADGE_VARIANTS: Record<UserListItem['role'], 'danger' | 'info' | 'brand' | 'neutral'> = {
  ADMIN: 'danger',
  AGENT: 'info',
  DEVELOPER: 'brand',
  USER: 'neutral',
};
