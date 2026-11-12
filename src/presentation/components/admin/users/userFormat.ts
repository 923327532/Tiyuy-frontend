import type { UserListItem } from '@/core/domain/entities/Admin';

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const relativeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

export function toDate(value?: Date | string | null): Date | null {
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

export function formatRelative(value?: Date | string | null): string {
  const date = toDate(value);
  if (!date) return 'Sin accesos';

  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  if (Math.abs(minutes) < 1) return 'Ahora';
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour');

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day');

  return dateFormatter.format(date);
}

export function formatMoney(amount: number, currency: 'PEN' | 'USD'): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount ?? 0);
}

export function getFullName(user: Pick<UserListItem, 'firstName' | 'lastName' | 'email'>): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
}

export function getInitials(user: Pick<UserListItem, 'firstName' | 'lastName' | 'email'>): string {
  if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  return (user.email?.[0] ?? '?').toUpperCase();
}