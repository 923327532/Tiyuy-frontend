'use client';

import { Check, SlidersHorizontal, X } from 'lucide-react';
import {
  PROJECT_LOCATION_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_UNITS_OPTIONS,
} from './projects.config';
import '@/presentation/components/admin/agents/styles/AgentAdvancedFilters.css';

interface Props {
  typeFilter: string;
  locationFilter: string;
  maxPrice: number;
  unitsFilter: string;
  onTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onMaxPriceChange: (value: number) => void;
  onUnitsChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

function formatPrice(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export function ProjectsAdvancedFilters({
  typeFilter,
  locationFilter,
  maxPrice,
  unitsFilter,
  onTypeChange,
  onLocationChange,
  onMaxPriceChange,
  onUnitsChange,
  onApply,
  onClear,
  onClose,
}: Props) {
  return (
    <section className="agent-advanced-filters" aria-label="Filtros avanzados de proyectos">
      <header className="agent-advanced-filters__header">
        <div className="agent-advanced-filters__title">
          <SlidersHorizontal className="agent-advanced-filters__title-icon" aria-hidden="true" />
          <h3>Filtros Avanzados</h3>
        </div>
        <button
          type="button"
          className="agent-advanced-filters__close"
          onClick={onClose}
          aria-label="Cerrar filtros avanzados"
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <div className="agent-advanced-filters__grid">
        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Tipo de proyecto</span>
          <select className="users-filters__select" value={typeFilter} onChange={(e) => onTypeChange(e.target.value)}>
            {PROJECT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Ubicación</span>
          <select className="users-filters__select" value={locationFilter} onChange={(e) => onLocationChange(e.target.value)}>
            {PROJECT_LOCATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Unidades</span>
          <select className="users-filters__select" value={unitsFilter} onChange={(e) => onUnitsChange(e.target.value)}>
            {PROJECT_UNITS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Precio máximo: {formatPrice(maxPrice || 1000000)}</span>
          <input
            type="range"
            min={0}
            max={1000000}
            step={50000}
            value={maxPrice || 1000000}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full accent-teal-700"
          />
        </label>

        <div className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label" aria-hidden="true">&nbsp;</span>
          <button type="button" className="agent-advanced-filters__apply" onClick={onApply}>
            <Check aria-hidden="true" />
            Aplicar filtros
          </button>
        </div>
      </div>

      <footer className="agent-advanced-filters__footer">
        <button type="button" className="agent-advanced-filters__reset" onClick={onClear}>
          Limpiar filtros
        </button>
      </footer>
    </section>
  );
}
