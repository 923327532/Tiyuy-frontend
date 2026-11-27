'use client';

import { ArrowUpRight } from 'lucide-react';

import { DISCOUNT_ACCENTS, DISCOUNT_TYPE_ICONS, type DiscountOption } from './discountTheme';

interface Props {
  option: DiscountOption;
  onClick: () => void;
}

/** Tarjeta única y uniforme para los seis tipos de descuento del aplicador. */
export function DiscountActionCard({ option, onClick }: Props) {
  const Icon = DISCOUNT_TYPE_ICONS[option.type];
  const accent = DISCOUNT_ACCENTS[option.accent];

  return (
    <article
      className={`group flex h-full flex-col justify-between rounded-xl border border-slate-200/85 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-teal-500/25 ${accent.hoverBorder}`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex h-full w-full flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200/60 bg-slate-50 text-slate-400 transition-colors group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div className="min-w-0">
          <h4 className="mt-3 text-[15px] font-semibold text-slate-900">{option.label}</h4>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{option.description}</p>
        </div>

        <ul className="mt-3.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          {option.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-md bg-slate-100/85 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </button>
    </article>
  );
}

export default DiscountActionCard;
