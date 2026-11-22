/**
 * Users Utilities - Funciones de utilidad para el panel de usuarios
 */

import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserIdentityLike } from '@/presentation/components/admin/users/types/users.types';

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const numberFormatter = new Intl.NumberFormat('es-PE');
const relativeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

function toDate(value?: Date | string | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: Date | string | null): string {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : '—';
}

export function formatDateTime(value?: Date | string | null): string {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : '—';
}

export function formatRegistered(value?: Date | string | null): string {
  return formatDate(value);
}

export function formatRelative(value?: Date | string | null): string {
  const date = toDate(value);
  if (!date) return 'Sin accesos';

  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  const abs = Math.abs(minutes);

  if (abs < 1) return 'Ahora';
  if (abs < 60) return relativeFormatter.format(minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour');

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day');

  return dateFormatter.format(date);
}

export function formatLastAccess(value?: Date | string | null): string {
  return formatRelative(value);
}

export function formatMoney(amount: number, currency: 'PEN' | 'USD'): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount ?? 0);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function getFullName(user: Pick<UserIdentityLike, 'firstName' | 'lastName' | 'email'>): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
}

export function getInitials(user: Pick<UserIdentityLike, 'firstName' | 'lastName' | 'email'>): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  return (user.email?.[0] ?? '?').toUpperCase();
}

/** Roles que publican propiedades/proyectos */
export const PUBLISHER_ROLES = new Set(['AGENT', 'DEVELOPER']);

export function shouldShowProduction(user: UserListItem): boolean {
  const role = user.role ?? 'USER';
  return (
    PUBLISHER_ROLES.has(role) ||
    user.publishedPropertiesCount > 0 ||
    user.publishedProjectsCount > 0
  );
}

export function getUserLocation(user: UserListItem): string {
  return [user.city, user.country].filter(Boolean).join(', ');
}

/** Verifica si un número es válido para mostrar */
export function isValidNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

/** Calcula porcentaje activo */
export function calculateActivePercent(active: number, total: number): number | null {
  if (total <= 0 || !isValidNumber(active)) return null;
  return Math.min(100, Math.round((active / total) * 100));
}

/** Formatea fecha actual en español (Perú) */
export function formatCurrentDate(): string {
  const formatted = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Formatea fecha corta: 18 nov. 2026 */
export function formatShortDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = new Intl.DateTimeFormat('es-PE', { month: 'short' })
    .format(now)
    .replace('.', '');

  return `${day} ${month}. ${now.getFullYear()}`;
}