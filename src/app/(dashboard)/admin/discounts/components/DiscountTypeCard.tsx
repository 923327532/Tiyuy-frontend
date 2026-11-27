'use client';

import { ArrowUpRight, Globe, Landmark, RefreshCw, ScrollText, User, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DiscountType = 'GLOBAL' | 'USER' | 'AGENT' | 'AGENCY' | 'PLAN' | 'REUSABLE';

export interface DiscountOption {
  type: DiscountType;
  label: string;
  description: string;
  gradient: string;
  bullets: string[];
}

const ICONS: Record<DiscountType, LucideIcon> = {
  GLOBAL: Globe,
  USER: User,
  AGENT: UserCheck,
  AGENCY: Landmark,
  PLAN: ScrollText,
  REUSABLE: RefreshCw,
};

interface DiscountTypeCardProps {
  option: DiscountOption;
  onClick: () => void;
}

/** Card de tipo de descuento con el mismo lenguaje visual que Usuarios/Propiedades. */
export default function DiscountTypeCard({ option, onClick }: DiscountTypeCardProps) {
  const Icon = ICONS[option.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8CED5] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${option.gradient} text-white shadow-sm`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-300 transition-colors duration-200 group-hover:bg-teal-50 group-hover:text-teal-600">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <h4 className="mt-4 text-sm font-bold text-slate-900 transition-colors group-hover:text-[#164E63]">
        {option.label}
      </h4>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{option.description}</p>

      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {option.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
            {bullet}
          </li>
        ))}
      </ul>
    </button>
  );
}
