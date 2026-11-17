'use client';

import { INPUT_STYLES } from '../constants';
import type { FilterOption } from '../types';

interface FilterSelectProps {
  id: string;
  label: string;
  options?: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterSelect({
  id,
  label,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${INPUT_STYLES} cursor-pointer`}
    >
      <option value="">
        Todos los {label.toLowerCase()}
      </option>

      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
