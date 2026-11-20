'use client';

import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'Buscar por nombre o RUC...' }: SearchFieldProps) {
  return (
    <div className="users-filters__search">
      <Search className="users-filters__search-icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="users-filters__input"
        aria-label="Buscar inmobiliarias"
      />
      {value && (
        <button
          type="button"
          className="users-filters__search-clear"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}