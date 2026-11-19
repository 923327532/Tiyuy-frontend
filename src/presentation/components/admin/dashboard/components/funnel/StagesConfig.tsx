'use client';

import {
  Eye,
  MousePointerClick,
  Target,
  CheckCircle2,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface FunnelStageConfig {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  background: string;
  text: string;
  bar: string;
}

export const STAGES: FunnelStageConfig[] = [
  {
    id: 'impressions',
    label: 'Impresiones',
    description: 'Visualizaciones de campañas',
    icon: Eye,
    color: '#164E63',
    background: 'bg-[#E0F2FE]',
    text: 'text-[#164E63]',
    bar: 'bg-[#164E63]',
  },
  {
    id: 'clicks',
    label: 'Clics',
    description: 'Interacciones recibidas',
    icon: MousePointerClick,
    color: '#6479B8',
    background: 'bg-[#E8EAF6]',
    text: 'text-[#5965A8]',
    bar: 'bg-[#858FC4]',
  },
  {
    id: 'leads',
    label: 'Leads',
    description: 'Contactos generados',
    icon: Target,
    color: '#61988C',
    background: 'bg-[#DCEAE9]',
    text: 'text-[#477A72]',
    bar: 'bg-[#61988C]',
  },
  {
    id: 'conversions',
    label: 'Conversiones',
    description: 'Resultados conseguidos',
    icon: CheckCircle2,
    color: '#36866C',
    background: 'bg-[#E1F1EA]',
    text: 'text-[#36866C]',
    bar: 'bg-[#36866C]',
  },
];