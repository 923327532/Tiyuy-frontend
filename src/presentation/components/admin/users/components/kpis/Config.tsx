'use client';

import type { ReactNode } from 'react';

export interface KPIsProps {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
}

export type KpiTone = 'active' | 'pending' | 'suspended' | 'total';

export interface KpiItemProps {
  tone: KpiTone;
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  statusLabel: string;
  progress?: number;
  index?: number;
}

export const TONE_CONFIG: Record<KpiTone, { accent: string; accentSoft: string; accentMuted: string }> = {
  active: {
    accent: 'var(--admin-metric-active-accent)',
    accentSoft: 'var(--admin-metric-active-soft)',
    accentMuted: 'var(--admin-metric-active-text)',
  },
  pending: {
    accent: 'var(--admin-metric-pending-accent)',
    accentSoft: 'var(--admin-metric-pending-soft)',
    accentMuted: 'var(--admin-metric-pending-text)',
  },
  suspended: {
    accent: 'var(--admin-metric-danger-accent)',
    accentSoft: 'var(--admin-metric-danger-soft)',
    accentMuted: 'var(--admin-metric-danger-text)',
  },
  total: {
    accent: 'var(--admin-metric-total-accent)',
    accentSoft: 'var(--admin-metric-total-soft)',
    accentMuted: 'var(--admin-metric-total-text)',
  },
};

export function normalizeCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

export function calculatePercentage(value: number, total: number): number | undefined {
  if (total <= 0) return undefined;
  return Math.min(100, Math.round((value / total) * 100));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value);
}