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
    accent: '#36866c',
    accentSoft: '#dceae4',
    accentMuted: '#36866c',
  },
  pending: {
    accent: '#c58a3a',
    accentSoft: '#fbefd9',
    accentMuted: '#a66b1d',
  },
  suspended: {
    accent: '#c45d68',
    accentSoft: '#f9e5e8',
    accentMuted: '#b94b59',
  },
  total: {
    accent: '#164e63',
    accentSoft: '#e3edf1',
    accentMuted: '#164e63',
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