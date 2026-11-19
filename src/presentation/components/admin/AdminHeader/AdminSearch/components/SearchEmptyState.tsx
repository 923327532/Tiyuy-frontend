'use client';

import { Search } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="px-4 py-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
        <Search className="h-5 w-5 text-slate-500" />
      </div>

      <p className="text-sm font-medium text-white">
        No encontramos resultados
      </p>

      <p className="mt-1 text-xs text-slate-400">
        No hay módulos relacionados con &quot;{query}&quot;.
      </p>
    </div>
  );
}
