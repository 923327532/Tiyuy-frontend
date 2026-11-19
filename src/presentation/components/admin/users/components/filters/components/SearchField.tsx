'use client';

import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'Buscar por email, nombre o DNI...' }: SearchFieldProps) {
  return (
    <div className="users-filters__search">
      <Search className="users-filters__search-icon" aria-hidden="true" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar usuarios por email, nombre o DNI"
        className="users-filters__input"
      />

      {value && (
        <button
          type="button"
          className="users-filters__search-clear"
          onClick={() => onChange('')}
          aria-label="Borrar búsqueda"
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
