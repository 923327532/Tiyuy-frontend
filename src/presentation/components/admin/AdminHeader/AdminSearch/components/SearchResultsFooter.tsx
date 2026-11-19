'use client';

import { ArrowDown, ArrowUp, CornerDownLeft } from 'lucide-react';

export function SearchResultsFooter() {
  return (
    <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <ArrowUp className="h-3 w-3" />
          <ArrowDown className="h-3 w-3" />
          Navegar
        </span>

        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <CornerDownLeft className="h-3 w-3" />
          Abrir
        </span>
      </div>

      <span className="text-[10px] text-slate-500">
        ESC para cerrar
      </span>
    </div>
  );
}
