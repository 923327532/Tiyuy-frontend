'use client';

import { Search, X } from 'lucide-react';
import { FILTER_TABS, type InternationalStatusFilter } from '../../config/international.constants';
import type { InternationalCounts } from '../../types/international.types';
import './styles/InternationalFilters.css';

interface Props {
  value: InternationalStatusFilter;
  onChange: (value: InternationalStatusFilter) => void;
  counts: InternationalCounts;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function InternationalFilters({ value, onChange, counts, searchQuery, onSearchChange }: Props) {
  return (
    <section className="intl-filters" aria-label="Filtros de verificación internacional">
      <div className="intl-filters__main">
        
        {/* Search */}
        <div className="intl-filters__search">
          <Search className="intl-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, correo, documento o país..."
            aria-label="Buscar solicitudes internacionales"
            className="intl-filters__input"
          />
          {searchQuery && (
            <button
              type="button"
              className="intl-filters__search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Borrar búsqueda"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="intl-filters__group">
          <span className="intl-filters__label">Estado</span>
          <div className="intl-filters__tabs" role="tablist">
            {FILTER_TABS.map((tab) => {
              const active = value === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChange(tab.key)}
                  className={`intl-filters__tab ${active ? 'intl-filters__tab--active' : ''}`.trim()}
                >
                  <span className="intl-filters__tab-label">{tab.label}</span>
                  <span className="intl-filters__tab-count">{counts[tab.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}