import type { InternationalUserListItem } from '@/core/domain/entities/Admin';

export function getInitials(user: InternationalUserListItem): string {
  const first = user.firstName?.charAt(0) ?? '';
  const last = user.lastName?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

export function getFullName(user: InternationalUserListItem): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || '—';
}

export function formatDate(date?: string | Date | null): string {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
