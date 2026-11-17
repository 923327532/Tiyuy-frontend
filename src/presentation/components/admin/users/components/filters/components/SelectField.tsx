'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: ReactNode;
}

export function SelectField({ label, value, onChange, options, icon }: SelectFieldProps) {
  return (
    <label className="users-filters__select-wrapper">
      <span className="users-filters__sr-only">{label}</span>

      {icon ? <span className="users-filters__select-icon" aria-hidden="true">{icon}</span> : null}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="users-filters__select"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="users-filters__chevron" aria-hidden="true" />
    </label>
  );
}
