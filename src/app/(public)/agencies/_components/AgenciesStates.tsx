import { AlertCircle, Building2, SearchX } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClear: () => void;
}

interface ErrorStateProps {
  onRetry: () => void;
}

export function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando inmobiliarias"
      className="flex min-h-[320px] flex-col items-center justify-center py-20"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-[var(--brand-primary)]/15" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[var(--brand-primary)]" />
        <Building2
          aria-hidden="true"
          className="h-6 w-6 text-[var(--brand-primary)]"
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
        Cargando directorio
      </p>
      <p className="mt-1 text-sm text-[var(--text-tertiary)]">
        Estamos preparando las inmobiliarias disponibles.
      </p>
      <span className="sr-only">Por favor, espera.</span>
    </div>
  );
}

export function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-secondary)]">
        {hasFilters ? (
          <SearchX
            aria-hidden="true"
            className="h-8 w-8 text-[var(--text-tertiary)]"
          />
        ) : (
          <Building2
            aria-hidden="true"
            className="h-8 w-8 text-[var(--text-tertiary)]"
          />
        )}
      </div>

      <h3 className="mt-6 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        {hasFilters
          ? 'No encontramos resultados'
          : 'Directorio en preparación'}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        {hasFilters
          ? 'No encontramos inmobiliarias que coincidan con los criterios de búsqueda. Prueba con otro nombre o selecciona una ciudad diferente.'
          : 'En este momento no hay inmobiliarias registradas para mostrar. Vuelve a consultar más adelante.'}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition-colors duration-200 hover:bg-[var(--brand-primary)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
        <AlertCircle
          aria-hidden="true"
          className="h-8 w-8 text-red-600 dark:text-red-400"
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        No pudimos cargar el directorio
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        Ocurrió un problema al consultar las inmobiliarias. Comprueba tu conexión e inténtalo nuevamente.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(74,154,62,0.16)] transition-all duration-200 hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_6px_16px_rgba(74,154,62,0.22)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}