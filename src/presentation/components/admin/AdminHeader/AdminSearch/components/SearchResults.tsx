'use client';

import type { AdminSearchRoute } from '../types';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchResultItem } from './SearchResultItem';
import { SearchResultsFooter } from './SearchResultsFooter';

interface SearchResultsProps {
  shouldShowResults: boolean;
  hasResults: boolean;
  query: string;
  routes: AdminSearchRoute[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (href: string) => void;
}

export function SearchResults({
  shouldShowResults,
  hasResults,
  query,
  routes,
  activeIndex,
  onHover,
  onSelect,
}: SearchResultsProps) {
  if (!shouldShowResults) return null;

  return (
    <div
      id="admin-search-results"
      role="listbox"
      aria-label="Resultados de búsqueda"
      className="
        absolute left-0 right-0 top-full z-[60]
        mt-2 max-h-80 overflow-y-auto
        rounded-xl border border-[var(--border-admin-sidebar)]
        bg-[var(--bg-admin-sidebar-hover)]
        shadow-[0_12px_40px_rgba(0,0,0,0.35)]
        animate-menu-drop-in
        motion-reduce:animate-none
      "
    >
      {/* ENCABEZADO */}
      <div
        className="
          flex items-center justify-between
          border-b border-[var(--border-admin-sidebar)]
          px-4 py-3
        "
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-admin-sidebar-heading)]">
          Resultados
        </span>

        {hasResults && (
          <span className="rounded-full bg-[var(--bg-admin-sidebar-active)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-admin-accent)]">
            {routes.length} encontrados
          </span>
        )}
      </div>

      {!hasResults ? (
        <SearchEmptyState query={query} />
      ) : (
        <div className="p-2" role="none">
          {routes.map((route, index) => (
            <SearchResultItem
              key={`${route.href}-${route.label}`}
              route={route}
              index={index}
              isActive={activeIndex === index}
              onHover={onHover}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      <SearchResultsFooter />
    </div>
  );
}
