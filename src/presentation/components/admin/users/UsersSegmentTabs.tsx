'use client';

import { useRef } from 'react';
import { SEGMENTS } from './userSegments';
import type { UserSegment } from './userTypes';

export type SegmentFilter = UserSegment | 'ALL';

interface UsersSegmentTabsProps {
  value: SegmentFilter;
  onChange: (value: SegmentFilter) => void;
  /** Conteos por categoría. Lo ideal es que vengan del backend, no de la página cargada. */
  counts?: Partial<Record<SegmentFilter, number>>;
}

const TABS: { id: SegmentFilter; label: string }[] = [
  { id: 'ALL', label: 'Todos' },
  ...SEGMENTS.map((segment) => ({ id: segment.id as SegmentFilter, label: segment.label })),
];

export function UsersSegmentTabs({ value, onChange, counts }: UsersSegmentTabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    onChange(TABS[next].id);
    refs.current[TABS[next].id]?.focus();
  };

  const active = SEGMENTS.find((segment) => segment.id === value);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categorías de usuarios"
        className="flex gap-1 overflow-x-auto border-b border-slate-200"
      >
        {TABS.map((tab, index) => {
          const selected = tab.id === value;
          const count = counts?.[tab.id];

          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0f2e3a]/30 ${
                selected
                  ? 'border-[#0f2e3a] text-[#0f2e3a]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                    selected ? 'bg-[#0f2e3a] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {active && <p className="mt-3 text-xs text-slate-500">{active.description}</p>}
    </div>
  );
}