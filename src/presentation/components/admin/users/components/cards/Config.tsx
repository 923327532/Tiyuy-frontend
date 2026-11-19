'use client';

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  AGENT: 'Agente',
  DEVELOPER: 'Desarrollador',
  USER: 'Usuario',
};

export const ROLE_VARIANTS: Record<string, 'danger' | 'info' | 'brand' | 'neutral'> = {
  ADMIN: 'danger',
  AGENT: 'info',
  DEVELOPER: 'brand',
  USER: 'neutral',
};

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value);
}

export function getInitials(user: { firstName?: string | null; lastName?: string | null }): string {
  const first = user.firstName?.charAt(0) ?? '';
  const last = user.lastName?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

export function getFullName(user: {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
}

export function getUserLocation(user: {
  district?: string | null;
  city?: string | null;
  country?: string | null;
}): string {
  const parts = [user.district, user.city, user.country].filter(Boolean);
  return parts.join(', ') || 'Ubicación no disponible';
}

export function formatRegistered(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatLastAccess(date: string | Date | null | undefined): string {
  if (!date) return 'Nunca';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function shouldShowProduction(user: {
  role?: string;
  publishedPropertiesCount?: number;
  publishedProjectsCount?: number;
}): boolean {
  return (
    user.role === 'DEVELOPER' ||
    user.role === 'AGENT' ||
    (user.publishedPropertiesCount ?? 0) > 0 ||
    (user.publishedProjectsCount ?? 0) > 0
  );
}