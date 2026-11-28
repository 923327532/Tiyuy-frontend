'use client';

import { Search } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="px-4 py-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-admin-sidebar-active)]">
        <Search className="h-5 w-5 text-[var(--text-admin-sidebar-muted)]" />
      </div>

      <p className="text-sm font-medium text-[var(--text-admin-sidebar)]">
        No encontramos resultados
      </p>

      <p className="mt-1 text-xs text-[var(--text-admin-sidebar-muted)]">
        No hay módulos relacionados con &quot;{query}&quot;.
      </p>
    </div>
  );
}
