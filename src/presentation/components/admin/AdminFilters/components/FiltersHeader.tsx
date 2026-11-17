'use client';

import { SlidersHorizontal, X } from 'lucide-react';

interface FiltersHeaderProps {
  hasActiveFilters: boolean;
  onClear: () => void;
}

export function FiltersHeader({
  hasActiveFilters,
  onClear,
}: FiltersHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl border border-cyan-400/20
            bg-cyan-400/10
          "
        >
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Filtros
          </h3>
          <p className="text-xs text-slate-400">
            Encuentra información rápidamente
          </p>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="
            inline-flex items-center gap-1.5 rounded-lg
            px-3 py-2 text-xs font-medium text-slate-400
            transition-colors hover:bg-white/[0.07]
            hover:text-cyan-300
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-cyan-400
          "
        >
          <X className="h-3.5 w-3.5" />
          Limpiar
        </button>
      )}
    </div>
  );
}
