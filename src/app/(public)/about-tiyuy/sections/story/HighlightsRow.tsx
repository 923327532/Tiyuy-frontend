'use client';

import { highlights } from './story.data';

export function HighlightsRow() {
  return (
    <dl className="grid grid-cols-1 divide-y divide-neutral-200 border-y border-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {highlights.map(({ value, label }, index) => (
        <div
          key={label}
          className="flex flex-col-reverse gap-2 py-6 px-4 sm:px-6"
        >
          <dt className="text-sm font-medium leading-snug text-neutral-600">
            {label}
          </dt>
          <dd className="text-4xl font-semibold tabular-nums tracking-[-0.03em] text-neutral-950 md:text-5xl">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}