'use client';

import type { KeyboardEventHandler, RefObject } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  shouldShowResults: boolean;
  hasResults: boolean;
  activeIndex: number;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClear: () => void;
}

export function SearchInput({
  inputRef,
  query,
  shouldShowResults,
  hasResults,
  activeIndex,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="
          pointer-events-none absolute left-3
          top-1/2 h-4 w-4
          -translate-y-1/2
          text-slate-400
        "
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="search"
        role="combobox"
        autoComplete="off"
        placeholder="Buscar módulos..."
        value={query}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        aria-label="Buscar en el panel administrativo"
        aria-expanded={shouldShowResults}
        aria-controls="admin-search-results"
        aria-autocomplete="list"
        aria-activedescendant={
          shouldShowResults && hasResults
            ? `admin-search-option-${activeIndex}`
            : undefined
        }
        className="
          h-10 w-full rounded-xl
          border border-white/10
          bg-white/[0.06]
          py-2 pl-10 pr-20
          text-sm text-white
          placeholder:text-slate-400
          outline-none
          transition-all duration-200

          hover:border-white/20
          hover:bg-white/[0.09]

          focus:border-cyan-400/50
          focus:bg-white/[0.09]
          focus:ring-2
          focus:ring-cyan-400/10

          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {/* ACCIONES DEL INPUT */}
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {query && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg text-slate-400
              transition
              hover:bg-white/10 hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-400
            "
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <kbd
          className="
            hidden items-center gap-1
            rounded-md border border-white/10
            bg-white/[0.05]
            px-1.5 py-1
            text-[10px] font-medium
            text-slate-400
            sm:inline-flex
          "
        >
          <span>/</span>
        </kbd>
      </div>
    </div>
  );
}
