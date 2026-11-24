'use client';

import { Check, SlidersHorizontal, X } from 'lucide-react';
import {
  CAMPAIGN_OWNER_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  type CampaignsFilterCriteria,
} from '../../config/campaigns.config';
import '@/presentation/components/admin/agents/styles/AgentAdvancedFilters.css';

interface Props {
  filters: CampaignsFilterCriteria;
  onChange: (field: keyof CampaignsFilterCriteria, value: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function CampaignsAdvancedFilters({ filters, onChange, onApply, onClear, onClose }: Props) {
  return (
    <section className="agent-advanced-filters" aria-label="Filtros avanzados de campañas">
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
          <span className="agent-advanced-filters__label">Tipo de campaña</span>
          <select
            className="users-filters__select"
            value={filters.promotionType}
            onChange={(e) => onChange('promotionType', e.target.value)}
          >
            {CAMPAIGN_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Anunciante</span>
          <select
            className="users-filters__select"
            value={filters.ownerRole}
            onChange={(e) => onChange('ownerRole', e.target.value)}
          >
            {CAMPAIGN_OWNER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Fecha de inicio (desde)</span>
          <input
            type="date"
            className="users-filters__input"
            value={filters.startDateFrom}
            onChange={(e) => onChange('startDateFrom', e.target.value)}
          />
        </label>

        <label className="agent-advanced-filters__field">
          <span className="agent-advanced-filters__label">Fecha de inicio (hasta)</span>
          <input
            type="date"
            className="users-filters__input"
            value={filters.startDateTo}
            onChange={(e) => onChange('startDateTo', e.target.value)}
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
