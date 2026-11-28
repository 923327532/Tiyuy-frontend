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
          text-[var(--text-admin-sidebar-muted)]
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
          border border-[var(--border-admin-sidebar)]
          bg-[var(--bg-admin-sidebar-hover)]
          py-2 pl-10 pr-20
          text-sm text-[var(--text-admin-sidebar)]
          placeholder:text-[var(--text-admin-sidebar-muted)]
          outline-none
          transition-all duration-200

          hover:border-[var(--border-admin-sidebar)]
          hover:bg-[var(--bg-admin-sidebar-active)]

          focus:border-[var(--color-admin-accent)]
          focus:bg-[var(--bg-admin-sidebar-active)]
          focus:ring-2
          focus:ring-[var(--color-admin-accent)]

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
              rounded-lg text-[var(--text-admin-sidebar-muted)]
              transition
              hover:bg-[var(--bg-admin-sidebar-active)] hover:text-[var(--text-admin-sidebar)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--color-admin-accent)]
            "
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <kbd
          className="
            hidden items-center gap-1
            rounded-md border border-[var(--border-admin-sidebar)]
            bg-[var(--bg-admin-sidebar-hover)]
            px-1.5 py-1
            text-[10px] font-medium
            text-[var(--text-admin-sidebar-muted)]
            sm:inline-flex
          "
        >
          <span>/</span>
        </kbd>
      </div>
    </div>
  );
}
