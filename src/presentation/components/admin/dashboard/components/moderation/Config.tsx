'use client';

import { FileCheck, Flag, Clock3 } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface ModerationQueueItem {
  id: string;
  title: string;
  description: string;
  count: number;
  href: string;
  severity: 'critical' | 'warning' | 'info';
  actionLabel: string;
  icon: LucideIcon;
}

export const QUEUE_ITEMS_CONFIG = [
  {
    id: 'pending',
    title: 'Publicaciones por moderar',
    description: 'Esperan aprobación para salir al mercado',
    severity: 'warning' as const,
    actionLabel: 'Moderar',
    icon: FileCheck,
    href: '/admin/properties',
    count: 0,
  },
  {
    id: 'reports',
    title: 'Reportes de usuarios',
    description: 'Avisos denunciados por datos falsos o duplicados',
    severity: 'critical' as const,
    actionLabel: 'Revisar',
    icon: Flag,
    href: '/admin/properties',
    count: 0,
  },
  {
    id: 'featured',
    title: 'Destacados vencidos',
    description: 'Siguen ocupando un cupo que podrías vender',
    severity: 'info' as const,
    actionLabel: 'Gestionar',
    icon: Clock3,
    href: '/admin/properties',
    count: 0,
  },
];

export const SEVERITY_STYLES = {
  critical: {
    iconBackground: 'bg-[#FCE8E8]',
    iconColor: 'text-[#C45B5B]',
    badge: 'bg-[#FCE8E8] text-[#B94C4C]',
    indicator: 'bg-[#C45B5B]',
  },
  warning: {
    iconBackground: 'bg-[#FFF1DC]',
    iconColor: 'text-[#C58A3A]',
    badge: 'bg-[#FFF1DC] text-[#A96D22]',
    indicator: 'bg-[#C58A3A]',
  },
  info: {
    iconBackground: 'bg-[#E0F2FE]',
    iconColor: 'text-[#164E63]',
    badge: 'bg-[#E0F2FE] text-[#164E63]',
    indicator: 'bg-[#61988C]',
  },
} as const;