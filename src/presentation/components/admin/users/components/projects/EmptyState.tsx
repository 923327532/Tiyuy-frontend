'use client';

import { Building2, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  message = 'Este usuario todavía no tiene proyectos asociados a su cuenta.',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
        <Building2 className="h-6 w-6 text-slate-400" aria-hidden="true" />
      </div>

      <h4 className="text-sm font-semibold text-slate-800">
        Sin proyectos registrados
      </h4>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#164E63] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0F3D50]"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'No fue posible obtener la información de los proyectos.',
  onRetry,
}: { message?: string; onRetry?: () => void } = {}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FolderOpen className="mb-3 h-8 w-8 text-slate-300" />

      <p className="text-sm font-semibold text-slate-700">
        No hay datos disponibles
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}