'use client';

import { Check, SlidersHorizontal, X } from 'lucide-react';

interface AgentsAdvancedFiltersProps {
  dateRange: { start?: Date; end?: Date };
  minRevenue: string;
  onDateRangeChange: (range: { start?: Date; end?: Date }) => void;
  onMinRevenueChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function AgentsAdvancedFilters({
  dateRange,
  minRevenue,
  onDateRangeChange,
  onMinRevenueChange,
  onApply,
  onClear,
  onClose,
}: AgentsAdvancedFiltersProps) {
  return (
    <section className="agent-advanced-filters" aria-label="Filtros avanzados de agentes">
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
          <span className="agent-advanced-filters__label">Fecha desde</span>
          <input
            type="date"
            className="users-filters__input"
            value={dateRange.start ? dateRange.start.toISOString().slice(0, 10) : ''}
            onChange={(e) => {
              onDateRangeChange({ ...dateRange, start: e.target.value ? new Date(e.target.value) : undefined });
            }}
          />
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Fecha hasta</span>
          <input
            type="date"
            className="users-filters__input"
            value={dateRange.end ? dateRange.end.toISOString().slice(0, 10) : ''}
            onChange={(e) => {
              onDateRangeChange({ ...dateRange, end: e.target.value ? new Date(e.target.value) : undefined });
            }}
          />
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Ingresos mínimos (mes)</span>
          <input
            type="number"
            min={0}
            placeholder="0"
            className="users-filters__input"
            value={minRevenue}
            onChange={(e) => onMinRevenueChange(e.target.value)}
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
