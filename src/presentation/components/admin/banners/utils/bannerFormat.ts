/** Formateadores y reglas de estado para el panel de banners. */

import type { Banner } from '@/core/domain/entities/Admin';

export type BannerStatus = 'active' | 'scheduled' | 'paused' | 'expired';

export const BANNER_STATUS_LABELS: Record<BannerStatus, string> = {
  active: 'Activo',
  scheduled: 'Programado',
  paused: 'Pausado',
  expired: 'Expirado',
};

export const BANNER_STATUS_STYLES: Record<BannerStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
  scheduled: 'bg-sky-50 text-sky-700 ring-sky-200/70',
  paused: 'bg-slate-100 text-slate-600 ring-slate-200/70',
  expired: 'bg-amber-50 text-amber-700 ring-amber-200/70',
};

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Fecha de calendario local (evita el desfase de Z al interpretar ISO). */
export function parseBannerDate(value?: string | null): Date | null {
  if (!value) return null;
  const text = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (match && text.length <= 10) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
    return null;
  }
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatBannerDate(value?: string | null): string {
  const date = parseBannerDate(value);
  if (!date) return '-';
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function getBannerStatus(banner: Banner, now = Date.now()): BannerStatus {
  if (!banner.isActive) return 'paused';

  const end = parseBannerDate(banner.endDate);
  if (end && end.getTime() < now) return 'expired';

  const start = parseBannerDate(banner.startDate);
  if (start && start.getTime() > now) return 'scheduled';

  return 'active';
}

export function formatNumber(value?: number | null): string {
  return (value ?? 0).toLocaleString('es-PE');
}

export function formatCompact(value?: number | null): string {
  const amount = value ?? 0;
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${formatNumber(abs)}`;
}

export function calculateBannerCtr(clicks?: number | null, impressions?: number | null): number {
  return impressions && impressions > 0 ? ((clicks ?? 0) / impressions) * 100 : 0;
}

export function formatBannerCtr(clicks?: number | null, impressions?: number | null): string {
  return `${calculateBannerCtr(clicks, impressions).toFixed(2)}%`;
}
