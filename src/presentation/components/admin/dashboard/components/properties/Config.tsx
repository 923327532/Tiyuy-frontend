'use client';

import { Building2, CheckCircle2, Clock3, Archive } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export const RADIUS = 68;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface DonutStage {
  id: string;
  label: string;
  hint: string;
  statuses: readonly string[];
  color: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
}

export const STAGES: DonutStage[] = [
  {
    id: 'published',
    label: 'Publicadas',
    hint: 'Visibles en el portal',
    statuses: ['PUBLISHED'],
    color: '#164E63',
    icon: CheckCircle2,
    iconBackground: 'bg-[#DCEAE9]',
    iconColor: 'text-[#36866C]',
  },
  {
    id: 'pending',
    label: 'En revisión',
    hint: 'Esperan moderación',
    statuses: ['PENDING'],
    color: '#C58A3A',
    icon: Clock3,
    iconBackground: 'bg-[#FFF1DC]',
    iconColor: 'text-[#C58A3A]',
  },
  {
    id: 'closed',
    label: 'Cerradas',
    hint: 'Vendidas o alquiladas',
    statuses: ['SOLD', 'RENTED'],
    color: '#7183B8',
    icon: Archive,
    iconBackground: 'bg-[#E8EAF6]',
    iconColor: 'text-[#7183B8]',
  },
] as const;

export interface DonutSegment {
  id: string;
  label: string;
  hint: string;
  value: number;
  color: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  offset: number;
  length: number;
  percentage: number;
}

export const INACTIVE_SEGMENT: Omit<DonutSegment, 'value' | 'offset' | 'length' | 'percentage'> = {
  id: 'inactive',
  label: 'Inactivas',
  hint: 'Borrador, pausadas, rechazadas o vencidas',
  color: '#CBD5E1',
  icon: Building2,
  iconBackground: 'bg-[#E8F0F3]',
  iconColor: 'text-slate-500',
};