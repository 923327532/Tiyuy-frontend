'use client';

import { INPUT_STYLES } from '../constants';
import type { FilterOption } from '../types';

interface FilterMultiSelectProps {
  id: string;
  label: string;
  options?: FilterOption[];
  value: string[];
  onChange: (values: string[]) => void;
}

export function FilterMultiSelect({
  id,
  label,
  options,
  value,
  onChange,
}: FilterMultiSelectProps) {
  return (
    <select
      id={id}
      multiple
      value={value}
      onChange={(event) => {
        const values = Array.from(
          event.target.selectedOptions,
          (option) => option.value,
        );

        onChange(values);
      }}
      aria-label={label}
      className={`${INPUT_STYLES} min-h-28 cursor-pointer`}
    >
      {options?.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-[#163b48] text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
