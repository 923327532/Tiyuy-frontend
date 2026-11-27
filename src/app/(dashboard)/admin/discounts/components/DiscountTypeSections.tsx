'use client';

import { Landmark, UserCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import DiscountTypeCard from './DiscountTypeCard';
import type { DiscountOption, DiscountType } from './DiscountTypeCard';

interface DiscountSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  options: DiscountOption[];
}

const SECTIONS: DiscountSection[] = [
  {
    id: 'users',
    title: 'Descuentos de Usuarios',
    description: 'Códigos y beneficios dirigidos a usuarios finales.',
    icon: Users,
    iconClass: 'bg-blue-50 text-blue-600',
    options: [
      {
        type: 'GLOBAL',
        label: 'Global',
        description: 'Código válido para todos los usuarios',
        gradient: 'from-indigo-500 to-blue-600',
        bullets: ['Aplica a cualquier usuario', 'Sin restricción de agente', 'Activación inmediata'],
      },
      {
        type: 'USER',
        label: 'Usuario',
        description: 'Descuento asignado a un usuario específico',
        gradient: 'from-blue-500 to-cyan-600',
        bullets: ['Asignado a un usuario', 'Un solo uso', 'Control individual'],
      },
      {
        type: 'REUSABLE',
        label: 'Reutilizable',
        description: 'Código con múltiples usos permitidos',
        gradient: 'from-rose-500 to-pink-600',
        bullets: ['Múltiples usos', 'Alta capacidad', 'Código compartible'],
      },
    ],
  },
  {
    id: 'agents',
    title: 'Descuentos de Agentes',
    description: 'Beneficios para agentes y sus planes de suscripción.',
    icon: UserCheck,
    iconClass: 'bg-teal-50 text-teal-600',
    options: [
      {
        type: 'AGENT',
        label: 'Agente',
        description: 'Descuento asignado a un agente inmobiliario',
        gradient: 'from-teal-500 to-emerald-600',
        bullets: ['Asignado a un agente', 'Suscripción personalizada', 'Gestión directa'],
      },
      {
        type: 'PLAN',
        label: 'Plan',
        description: 'Descuento en un plan específico para un agente',
        gradient: 'from-orange-500 to-amber-600',
        bullets: ['Descuento por plan', 'Precio personalizado', 'Suscripción con descuento'],
      },
    ],
  },
  {
    id: 'agencies',
    title: 'Descuentos de Inmobiliarias',
    description: 'Descuentos aplicables a toda una inmobiliaria.',
    icon: Landmark,
    iconClass: 'bg-violet-50 text-violet-600',
    options: [
      {
        type: 'AGENCY',
        label: 'Inmobiliaria',
        description: 'Descuento para toda una inmobiliaria',
        gradient: 'from-violet-500 to-purple-600',
        bullets: ['Aplica a toda la agencia', 'Descuento masivo', 'Configuración flexible'],
      },
    ],
  },
];

interface DiscountTypeSectionsProps {
  onSelect: (type: DiscountType) => void;
}

/** Agrupa los tipos de descuento en apartados independientes, sin modificar los modales. */
export default function DiscountTypeSections({ onSelect }: DiscountTypeSectionsProps) {
  return (
    <div className="space-y-5">
      {SECTIONS.map((section) => {
        const SectionIcon = section.icon;

        return (
          <section
            key={section.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${section.iconClass}`}>
                <SectionIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{section.title}</h4>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                    {section.options.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.options.map((option) => (
                <DiscountTypeCard
                  key={option.type}
                  option={option}
                  onClick={() => onSelect(option.type)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
