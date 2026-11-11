'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  Check,
  ChevronDown,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { CITIES } from './types';

interface Props {
  draft: string;
  onDraftChange: (v: string) => void;
  cityDraft: string;
  onCityDraftChange: (city: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const CITY_OPTIONS = ['', ...CITIES];

export default function AgenciesFilters({
  draft,
  onDraftChange,
  cityDraft,
  onCityDraftChange,
  onSubmit,
  loading,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = Math.max(0, CITY_OPTIONS.indexOf(cityDraft));
  const optionId = (index: number) => `agency-city-option-${index}`;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const selectCity = (city: string) => {
    onCityDraftChange(city);
    closeMenu();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, CITY_OPTIONS.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(CITY_OPTIONS.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectCity(CITY_OPTIONS[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Filtros de búsqueda de agencias"
      className="relative rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6 lg:p-7"
    >
      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F8F2] text-[#4A9A3E]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4A9A3E]">
              Búsqueda personalizada
            </p>
            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
              Encuentra tu agencia ideal
            </h2>
          </div>
        </div>

        <span className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4A9A3E]" />
          Directorio Tiyuy
        </span>
      </div>

      {/* Campos de búsqueda */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(230px,0.65fr)_auto] lg:items-end lg:gap-0">
        {/* Nombre */}
        <div className="group min-w-0 rounded-xl border border-transparent px-4 py-3 transition-all duration-300 focus-within:border-stone-200 focus-within:bg-[#F9FAF8] lg:rounded-none lg:border-r lg:border-r-stone-200 lg:py-1 lg:pl-2 lg:pr-7">
          <label
            htmlFor="agency-search"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500"
          >
            Nombre de agencia
          </label>

          <div className="flex items-center gap-3">
            <Search
              aria-hidden="true"
              className="h-[19px] w-[19px] shrink-0 text-[#4A9A3E] transition-transform duration-300 group-focus-within:scale-110"
            />

            <input
              id="agency-search"
              type="search"
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="¿Qué agencia estás buscando?"
              aria-label="Buscar agencia por nombre"
              className="h-9 w-full min-w-0 bg-transparent text-sm font-medium text-stone-900 outline-none placeholder:font-normal placeholder:text-stone-400 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Ciudad */}
        <div
          ref={rootRef}
          className="group relative min-w-0 rounded-xl border border-stone-200 bg-[#F9FAF8] px-4 py-3 transition-all duration-300 focus-within:border-[#4A9A3E] focus-within:bg-white lg:rounded-none lg:border-0 lg:bg-transparent lg:px-7 lg:py-1"
        >
          <label
            id="agency-city-label"
            htmlFor="agency-city"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500"
          >
            Ubicación
          </label>

          <button
            ref={buttonRef}
            id="agency-city"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls="agency-city-listbox"
            aria-labelledby="agency-city-label"
            aria-activedescendant={open ? optionId(activeIndex) : undefined}
            onClick={() => {
              if (open) {
                setOpen(false);
              } else {
                openMenu();
              }
            }}
            onKeyDown={handleKeyDown}
            className="flex h-9 w-full items-center gap-3 bg-transparent text-sm font-medium text-stone-900 outline-none focus-visible:outline-none"
          >
            <MapPin
              aria-hidden="true"
              className="h-[19px] w-[19px] shrink-0 text-[#4A9A3E] transition-transform duration-300 group-focus-within:-translate-y-0.5"
            />

            <span className="min-w-0 flex-1 truncate text-left">
              {cityDraft || 'Todas las ciudades'}
            </span>

            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 ${
                open ? 'rotate-180 text-[#4A9A3E]' : ''
              }`}
            />
          </button>

          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl shadow-stone-900/10 ring-1 ring-black/5 lg:left-4 lg:right-4">
              <ul
                id="agency-city-listbox"
                role="listbox"
                aria-label="Ciudades disponibles"
                className="max-h-64 overflow-y-auto py-1.5"
              >
                {CITY_OPTIONS.map((city, index) => {
                  const isSelected = cityDraft === city;
                  const isActive = activeIndex === index;

                  return (
                    <li
                      key={city || 'all'}
                      id={optionId(index)}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectCity(city)}
                      className={`mx-1.5 flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-[#F4F8F2] text-[#3b7c31]'
                          : 'text-stone-700'
                      } ${isSelected ? 'font-semibold' : 'font-medium'}`}
                    >
                      <span>{city || 'Todas las ciudades'}</span>
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-[#4A9A3E]"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Acción */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-[#4A9A3E] px-7 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(74,154,62,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3b7c31] hover:shadow-[0_15px_30px_-12px_rgba(74,154,62,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61BF53] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none lg:ml-4 lg:min-w-[185px]"
        >
          {loading ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Search
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
            />
          )}

          {loading ? 'Buscando...' : 'Buscar agencias'}
        </button>
      </div>

      {/* Detalle inferior */}
      <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
        <span className="h-1 w-1 rounded-full bg-[#4A9A3E]" />
        <p className="text-[11px] leading-5 text-stone-500">
          Refina tu búsqueda y descubre agencias inmobiliarias por ubicación.
        </p>
      </div>
    </form>
  );
}
