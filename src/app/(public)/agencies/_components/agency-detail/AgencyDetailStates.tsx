import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export function AgencyDetailLoadingState() {
  return (
    <main
      aria-busy="true"
      aria-label="Cargando perfil de agencia"
      className="min-h-screen bg-[var(--bg-secondary)]"
    >
      <div className="h-64 animate-pulse bg-[var(--bg-tertiary)] motion-reduce:animate-none sm:h-72" />
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8 lg:px-12">
        <div className="h-32 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="h-64 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />
          <div className="h-64 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />
        </div>
        <span className="sr-only">Cargando información de la agencia.</span>
      </div>
    </main>
  );
}

interface AgencyDetailErrorStateProps {
  isError: boolean;
  onRetry: () => void;
}

export function AgencyDetailErrorState({
  isError,
  onRetry,
}: AgencyDetailErrorStateProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--bg-secondary)] px-5 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-10 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
          <AlertCircle aria-hidden="true" className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
          {isError ? 'No pudimos cargar esta agencia' : 'Agencia no encontrada'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {isError
            ? 'Hubo un problema al consultar la información. Comprueba tu conexión e inténtalo nuevamente.'
            : 'No hay información disponible para este perfil.'}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {isError && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-primary-hover)] px-5 text-sm font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              Reintentar
            </button>
          )}
          <Link
            href="/agencies"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-color)] px-5 text-sm font-semibold text-[var(--brand-primary-hover)] transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            Volver al directorio
          </Link>
        </div>
      </div>
    </main>
  );
}
