'use client';

import { INPUT_STYLES } from '../constants';
import type { DateRangeValue } from '../types';

interface FilterDateRangeProps {
  label: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

export function FilterDateRange({
  label,
  value,
  onChange,
}: FilterDateRangeProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <span className="mb-1.5 block text-[11px] text-slate-500">
          Desde
        </span>

        <input
          type="date"
          aria-label={`${label}: desde`}
          value={value.from}
          onChange={(event) =>
            onChange({ ...value, from: event.target.value })
          }
          className={INPUT_STYLES}
        />
      </div>

      <div>
        <span className="mb-1.5 block text-[11px] text-slate-500">
          Hasta
        </span>

        <input
          type="date"
          aria-label={`${label}: hasta`}
          value={value.to}
          onChange={(event) =>
            onChange({ ...value, to: event.target.value })
          }
          min={value.from || undefined}
          className={INPUT_STYLES}
        />
      </div>
    </div>
  );
}
