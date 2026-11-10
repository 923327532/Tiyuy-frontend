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
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="min-h-[260px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-[var(--bg-tertiary)] motion-reduce:animate-none" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--bg-tertiary)] motion-reduce:animate-none" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--bg-tertiary)] motion-reduce:animate-none" />
            </div>
          </div>
          <div className="mt-6 h-9 animate-pulse rounded bg-[var(--bg-tertiary)] motion-reduce:animate-none" />
          <div className="mt-3 h-3 w-4/5 animate-pulse rounded bg-[var(--bg-tertiary)] motion-reduce:animate-none" />
          <div className="mt-7 border-t border-[var(--border-light)] pt-4">
            <div className="h-8 animate-pulse rounded bg-[var(--bg-tertiary)] motion-reduce:animate-none" />
          </div>
          <span className="sr-only">Cargando directorio de agencias.</span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-14 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--brand-primary-light)]">
        {hasFilters ? (
          <SearchX
            aria-hidden="true"
            className="h-6 w-6 text-[var(--brand-primary-hover)]"
          />
        ) : (
          <Building2
            aria-hidden="true"
            className="h-6 w-6 text-[var(--brand-primary-hover)]"
          />
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        {hasFilters
          ? 'No encontramos resultados'
          : 'Aún no hay agencias en el directorio'}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        {hasFilters
          ? 'No hay agencias que coincidan con estos criterios. Revisa el nombre o la ciudad y vuelve a intentarlo.'
          : 'No hay agencias registradas disponibles para mostrar en este momento.'}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-color)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-primary-hover)] transition-colors hover:bg-[var(--brand-primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
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
      className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-14 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--bg-tertiary)]">
        <AlertCircle
          aria-hidden="true"
          className="h-6 w-6 text-[var(--text-secondary)]"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        No pudimos cargar el directorio
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        Ocurrió un problema al consultar las inmobiliarias. Comprueba tu conexión e inténtalo nuevamente.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary-hover)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}