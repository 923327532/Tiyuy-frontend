'use client';

import { INPUT_STYLES } from '../constants';

interface FilterDateProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function FilterDate({
  id,
  value,
  onChange,
}: FilterDateProps) {
  return (
    <input
      id={id}
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={INPUT_STYLES}
    />
  );
}
