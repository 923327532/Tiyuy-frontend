'use client';

import { useState, type FormEvent } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { CITIES } from './types';

interface Props {
  draft: string;
  onDraftChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  city: string;
  onCityChange: (city: string) => void;
}

// Opciones calculadas fuera del componente para evitar recrear el array en cada render
const CITY_OPTIONS = [
  { value: '', label: 'Todas las ciudades' },
  ...CITIES.map((c) => ({ value: c, label: c })),
];

export default function AgenciesFilters({
  draft,
  onDraftChange,
  onSubmit,
  city,
  onCityChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="relative z-20 flex flex-col gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center"
    >
      {/* Búsqueda */}
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <Search
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-[var(--brand-primary)]"
        />

        <input
          type="search"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Buscar inmobiliaria..."
          aria-label="Buscar inmobiliaria por nombre"
          className="h-12 w-full min-w-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus-visible:ring-0"
        />
      </div>

      {/* Separador */}
      <div className="hidden h-9 w-px bg-[var(--border-color)] sm:block" />

      {/* Selector de ciudad */}
      <div className="relative min-w-0 sm:w-56 sm:shrink-0">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Filtrar por ciudad"
          aria-expanded={open}
          aria-haspopup="listbox"
          className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-sm transition-colors duration-200 hover:border-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          <span className="flex min-w-0 items-center gap-2">
            <MapPin
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[var(--brand-primary)]"
            />

            <span
              className={`truncate ${
                city
                  ? 'font-medium text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {city || 'Todas las ciudades'}
            </span>
          </span>

          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <>
            {/* Overlay transparente para cerrar al hacer clic fuera */}
            <button
              type="button"
              aria-label="Cerrar selector de ciudades"
              tabIndex={-1}
              className="fixed inset-0 z-30 cursor-default"
              onClick={() => setOpen(false)}
            />

            <div
              role="listbox"
              aria-label="Ciudades disponibles"
              className="absolute left-0 right-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
            >
              {CITY_OPTIONS.map(({ value, label }) => {
                const isSelected = city === value;

                return (
                  <button
                    key={value || 'all'}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onCityChange(value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-primary)] ${
                      isSelected
                        ? 'bg-[var(--brand-primary)]/10 font-semibold text-[var(--brand-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{label}</span>

                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Botón de búsqueda */}
      <button
        type="submit"
        className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-7 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(74,154,62,0.18)] transition-all duration-200 hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_6px_16px_rgba(74,154,62,0.24)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        Buscar
      </button>
    </form>
  );
}