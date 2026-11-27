import { Globe, Landmark, RefreshCw, ScrollText, User, UserCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DiscountType = 'GLOBAL' | 'USER' | 'AGENT' | 'AGENCY' | 'PLAN' | 'REUSABLE';

export type DiscountAccent = 'users' | 'agents' | 'agencies';

export interface DiscountOption {
  type: DiscountType;
  label: string;
  description: string;
  accent: DiscountAccent;
  bullets: string[];
}

export interface DiscountSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: DiscountAccent;
  options: DiscountOption[];
}

export interface DiscountAccentStyle {
  icon: string;
  hoverBorder: string;
  sectionIcon: string;
}

export const DISCOUNT_TYPE_ICONS: Record<DiscountType, LucideIcon> = {
  GLOBAL: Globe,
  USER: User,
  AGENT: UserCheck,
  AGENCY: Landmark,
  PLAN: ScrollText,
  REUSABLE: RefreshCw,
};

export const DISCOUNT_ACCENTS: Record<DiscountAccent, DiscountAccentStyle> = {
  users: {
    icon: 'bg-indigo-50 text-indigo-600 border border-indigo-200/70',
    hoverBorder: 'hover:border-indigo-300',
    sectionIcon: 'bg-indigo-50 text-indigo-600 border border-indigo-200/70',
  },
  agents: {
    icon: 'bg-emerald-50 text-emerald-600 border border-emerald-200/70',
    hoverBorder: 'hover:border-emerald-300',
    sectionIcon: 'bg-emerald-50 text-emerald-600 border border-emerald-200/70',
  },
  agencies: {
    icon: 'bg-violet-50 text-violet-600 border border-violet-200/70',
    hoverBorder: 'hover:border-violet-300',
    sectionIcon: 'bg-violet-50 text-violet-600 border border-violet-200/70',
  },
};

export const DISCOUNT_SECTIONS: DiscountSection[] = [
  {
    id: 'users',
    title: 'Descuentos de Usuarios',
    description: 'Códigos y beneficios dirigidos a usuarios finales.',
    icon: Users,
    accent: 'users',
    options: [
      {
        type: 'GLOBAL',
        label: 'Global',
        description: 'Código válido para todos los usuarios',
        accent: 'users',
        bullets: ['Aplica a cualquier usuario', 'Sin restricción de agente', 'Activación inmediata'],
      },
      {
        type: 'USER',
        label: 'Usuario',
        description: 'Descuento asignado a un usuario específico',
        accent: 'users',
        bullets: ['Asignado a un usuario', 'Un solo uso', 'Control individual'],
      },
      {
        type: 'REUSABLE',
        label: 'Reutilizable',
        description: 'Código con múltiples usos permitidos',
        accent: 'users',
        bullets: ['Múltiples usos', 'Alta capacidad', 'Código compartible'],
      },
    ],
  },
  {
    id: 'agents',
    title: 'Descuentos de Agentes',
    description: 'Beneficios para agentes y sus planes de suscripción.',
    icon: UserCheck,
    accent: 'agents',
    options: [
      {
        type: 'AGENT',
        label: 'Agente',
        description: 'Descuento asignado a un agente inmobiliario',
        accent: 'agents',
        bullets: ['Asignado a un agente', 'Suscripción personalizada', 'Gestión directa'],
      },
      {
        type: 'PLAN',
        label: 'Plan',
        description: 'Descuento en un plan específico para un agente',
        accent: 'agents',
        bullets: ['Descuento por plan', 'Precio personalizado', 'Suscripción con descuento'],
      },
    ],
  },
  {
    id: 'agencies',
    title: 'Descuentos de Inmobiliarias',
    description: 'Descuentos aplicables a toda una inmobiliaria.',
    icon: Landmark,
    accent: 'agencies',
    options: [
      {
        type: 'AGENCY',
        label: 'Inmobiliaria',
        description: 'Descuento para toda una inmobiliaria',
        accent: 'agencies',
        bullets: ['Aplica a toda la agencia', 'Descuento masivo', 'Configuración flexible'],
      },
    ],
  },
];
