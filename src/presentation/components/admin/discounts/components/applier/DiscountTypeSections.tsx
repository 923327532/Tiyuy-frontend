'use client';

import {
  DISCOUNT_ACCENTS,
  DISCOUNT_SECTIONS,
  type DiscountSection,
  type DiscountType,
} from './discountTheme';
import DiscountActionCard from './DiscountActionCard';

interface Props {
  onSelect: (type: DiscountType) => void;
}

function Section({ section, onSelect }: Props & { section: DiscountSection }) {
  const Icon = section.icon;
  const style = DISCOUNT_ACCENTS[section.accent];

  return (
    <section aria-label={section.title}>
      <div className="mb-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 pb-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.sectionIcon}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h4 className="text-sm font-semibold text-slate-800">{section.title}</h4>
          <span className="rounded-full border border-slate-200/80 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {section.options.length}
          </span>
          <p className="hidden text-xs text-slate-500 sm:inline">{section.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {section.options.map((option) => (
          <DiscountActionCard
            key={option.type}
            option={option}
            onClick={() => onSelect(option.type)}
          />
        ))}
      </div>
    </section>
  );
}

/** Tres apartados apilados con la misma grilla y la misma tarjeta en los seis casos. */
export default function DiscountTypeSections({ onSelect }: Props) {
  return (
    <div className="space-y-6">
      {DISCOUNT_SECTIONS.map((section) => (
        <Section key={section.id} section={section} onSelect={onSelect} />
      ))}
    </div>
  );
}
