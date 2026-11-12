import type { LucideIcon } from 'lucide-react';

export type AttentionSeverity = 'critical' | 'warning' | 'info';

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  count: number;
  severity: AttentionSeverity;
  href: string;
  actionLabel: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: LucideIcon;
  unavailable?: boolean;
  /** Muestra un skeleton en la tarjeta mientras carga su fuente de datos. */
  loading?: boolean;
  /** Barra de proporción opcional (value: 0–100) con su lectura en texto. */
  progress?: { value: number; label: string };
}

export interface RevenueSeriesPoint {
  label: string;
  value: number;
}