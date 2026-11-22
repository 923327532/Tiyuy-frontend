import { Search } from 'lucide-react';
import type { SearchConfig } from '../types';

/** Search input component */
export function SearchInput({
  value,
  onChange,
  placeholder,
  config,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  config: SearchConfig;
}) {
  return (
    <div className="generic-table__search-wrapper">
      <Search className="generic-table__search-icon" aria-hidden="true" />
      <input
        type="search"
        className="generic-table__search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="generic-table__search-clear"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
