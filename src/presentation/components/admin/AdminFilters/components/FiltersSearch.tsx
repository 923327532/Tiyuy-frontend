'use client';

import { Search, X } from 'lucide-react';

import { INPUT_STYLES } from '../constants';

interface FiltersSearchProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function FiltersSearch({
  value,
  placeholder,
  onChange,
  onClear,
}: FiltersSearchProps) {
  return (
    <div className="relative">
      <Search
        className="
          pointer-events-none absolute left-3.5 top-1/2
          h-4 w-4 -translate-y-1/2 text-slate-500
        "
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar registros"
        className={`${INPUT_STYLES} pl-10 pr-10`}
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar búsqueda"
          className="
            absolute right-3 top-1/2
            -translate-y-1/2 text-slate-500
            transition-colors hover:text-white
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
