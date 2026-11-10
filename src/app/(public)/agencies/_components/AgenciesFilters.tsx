import type { FormEvent } from 'react';
import { LoaderCircle, MapPin, Search } from 'lucide-react';
import { CITIES } from './types';

interface Props {
  draft: string;
  onDraftChange: (v: string) => void;
  cityDraft: string;
  onCityDraftChange: (city: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function AgenciesFilters({
  draft,
  onDraftChange,
  cityDraft,
  onCityDraftChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-[0_18px_44px_rgba(17,24,39,0.09)] sm:grid-cols-[minmax(0,1fr)_minmax(210px,0.42fr)_auto] sm:gap-3 sm:p-4"
    >
      <div className="min-w-0 rounded-xl px-3 focus-within:bg-[var(--bg-secondary)]">
        <label
          htmlFor="agency-search"
          className="block pt-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-tertiary)]"
        >
          Nombre de agencia
        </label>
        <div className="flex items-center gap-3">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
          <input
            id="agency-search"
            type="search"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Ej. nombre de la inmobiliaria"
            aria-label="Buscar agencia por nombre"
            className="h-10 w-full min-w-0 rounded-sm bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          />
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 focus-within:border-[var(--brand-primary)]">
        <label
          htmlFor="agency-city"
          className="block pt-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-tertiary)]"
        >
          Ubicación
        </label>
        <div className="flex items-center gap-3">
          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
          <select
            id="agency-city"
            value={cityDraft}
            onChange={(event) => onCityDraftChange(event.target.value)}
            aria-label="Filtrar agencias por ciudad"
            className="h-10 w-full min-w-0 cursor-pointer rounded-sm bg-transparent text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <option value="">Todas las ciudades</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="inline-flex h-[60px] items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary-hover)] px-6 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(74,154,62,0.2)] transition-all hover:-translate-y-0.5 hover:brightness-95 hover:shadow-[0_8px_18px_rgba(74,154,62,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-65 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {loading ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <Search aria-hidden="true" className="h-4 w-4" />
        )}
        {loading ? 'Buscando...' : 'Buscar agencias'}
      </button>
    </form>
  );
}