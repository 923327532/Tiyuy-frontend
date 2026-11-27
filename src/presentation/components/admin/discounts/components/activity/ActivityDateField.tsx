'use client';

import { CalendarDays } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Campo de fecha con el mismo lenguaje visual que los selects de filtros. */
export function ActivityDateField({ label, value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
      <span>{label}</span>
      <span className="users-filters__select-wrapper" style={{ minWidth: '10.5rem' }}>
        <CalendarDays className="users-filters__select-icon" aria-hidden="true" />
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="users-filters__input activity-date-input"
          aria-label={`Fecha ${label.toLowerCase()}`}
        />
      </span>
    </label>
  );
}
