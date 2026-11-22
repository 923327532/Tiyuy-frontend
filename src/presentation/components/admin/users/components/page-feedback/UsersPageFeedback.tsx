'use client';

interface LoadingStateProps {
  message?: string;
}

export function UsersLoadingState({ message = 'Cargando usuarios...' }: LoadingStateProps) {
  return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f2e3a]" />
      <span className="ml-3 text-slate-600 text-sm">{message}</span>
    </div>
  );
}

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export function UsersErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : 'Error desconocido';
  return (
    <div className="p-8 text-center">
      <div className="text-red-600 mb-3 font-medium text-sm">Error: {message}</div>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-[#0f2e3a] text-white hover:bg-[#164453] transition-colors text-sm"
      >
        Reintentar
      </button>
    </div>
  );
}

interface EmptyStateProps {
  onClear: () => void;
  title?: string;
  description?: string;
}

export function UsersEmptyState({
  onClear,
  title = 'No se encontraron usuarios',
  description = 'Intenta ajustar tu búsqueda o criterios de filtro.',
}: EmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h4 className="text-base font-medium text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-500 mb-3 text-sm">{description}</p>
      <button
        type="button"
        onClick={onClear}
        className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
