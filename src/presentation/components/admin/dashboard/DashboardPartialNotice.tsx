'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardPartialNoticeProps {
  sections: { id: string; label: string }[];
  onRetry: () => void;
  isRetrying: boolean;
}

/** Avisa qué bloques fallaron para que no se confundan "—" con "cero". */
export function DashboardPartialNotice({
  sections,
  onRetry,
  isRetrying,
}: DashboardPartialNoticeProps) {
  if (sections.length === 0) return null;

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm text-amber-800">
          Datos incompletos: no se pudo cargar{' '}
          <span className="font-medium">{sections.map((s) => s.label).join(', ')}</span>. Los
          pendientes de esas áreas pueden no aparecer.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
        Reintentar
      </button>
    </div>
  );
}