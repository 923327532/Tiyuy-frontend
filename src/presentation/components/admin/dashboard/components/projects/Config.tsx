'use client';

import { CheckCircle2, Clock3, PackageCheck, HardHat, Image as ImageIcon } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export const clamp = (value: number): number => Math.max(0, Math.min(100, value));

export function safeNumber(value?: number | null): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
}

export interface ProgressItemConfig {
  label: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  description: string;
}

export const PROGRESS_ITEMS: ProgressItemConfig[] = [
  {
    label: 'Avance promedio de obra',
    icon: HardHat,
    iconBackground: 'bg-[#E8EAF6]',
    iconColor: 'text-[#7183B8]',
    description: 'Progreso de construcción',
  },
  {
    label: 'Cobertura de imágenes',
    icon: ImageIcon,
    iconBackground: 'bg-[#E8F0F3]',
    iconColor: 'text-[#164E63]',
    description: 'Proyectos con imagen de portada',
  },
];

export interface SummaryItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
}

export const SUMMARY_ITEMS: SummaryItemConfig[] = [
  {
    id: 'active',
    label: 'Activos',
    icon: CheckCircle2,
    iconBackground: 'bg-[#DCEAE9]',
    iconColor: 'text-[#36866C]',
  },
  {
    id: 'pending',
    label: 'Pendientes',
    icon: Clock3,
    iconBackground: 'bg-[#FFF1DC]',
    iconColor: 'text-[#C58A3A]',
  },
  {
    id: 'completed',
    label: 'Entregados',
    icon: PackageCheck,
    iconBackground: 'bg-[#E8EAF6]',
    iconColor: 'text-[#7183B8]',
  },
];

export const UNIT_SEGMENTS = [
  { key: 'sold', label: 'Vendidas', color: 'bg-[#164E63]', statKey: 'soldUnits', fallbackKey: 'totalSoldUnits' },
  { key: 'available', label: 'Disponibles', color: 'bg-[#61988C]', statKey: 'availableUnits', fallbackKey: 'totalAvailableUnits' },
  { key: 'other', label: 'Otras', color: 'bg-[#CBD5E1]', statKey: '', fallbackKey: '' },
] as const;