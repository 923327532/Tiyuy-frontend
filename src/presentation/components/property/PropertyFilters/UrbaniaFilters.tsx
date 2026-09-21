'use client';
import { useState, useRef, useEffect } from 'react';
import { LocationSearch } from '@/presentation/components/forms/LocationSearch/LocationSearch';

interface UrbaniaFiltersProps {
  initialFilters: any;
  onFilterChange: (filters: any) => void;
  propertyType: string;
}

const FILTERS_BY_TYPE: Record<string, string[]> = {
  departamentos: ['PRECIO', 'DORMITORIOS', 'BAÑOS', 'ÁREA', 'ESTACIONAMIENTO'],
  casas: ['PRECIO', 'DORMITORIOS', 'BAÑOS', 'ÁREA', 'ESTACIONAMIENTO', 'TERRENO'],
  terrenos: ['PRECIO', 'ÁREA', 'FRONTIS'],
  oficinas: ['PRECIO', 'ÁREA', 'ESTACIONAMIENTO'],
  locales: ['PRECIO', 'ÁREA', 'FRONTIS'],
  habitaciones: ['PRECIO', 'TIPO_BAÑO'],
};

// Dropdown personalizado con opciones con diseño
function StyledDropdown({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || 'Sin preferencia';

  return (
    <div className="relative" ref={ref}>
      {/* Trigger con diseño consistente */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent flex items-center justify-between cursor-pointer transition-all"
      >
        <span>{selectedLabel}</span>
        <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Opciones con diseño */}
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`w-full px-4 py-3 text-sm text-left transition-colors cursor-pointer flex items-center gap-3 ${
                value === opt.value
                  ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--brand-primary-light-hover)] hover:text-[var(--brand-primary)]'
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {/* Indicador circular tipo radio */}
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                value === opt.value
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)]'
              }`}>
                {value === opt.value && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function UrbaniaFilters({ initialFilters, onFilterChange, propertyType }: UrbaniaFiltersProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [includeMaintenance, setIncludeMaintenance] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const visibleFilters = FILTERS_BY_TYPE[propertyType] || ['PRECIO'];

  const handleSubmit = () => {
    onFilterChange({
      ...filters,
      currency,
      includeMaintenance,
      location: selectedLocation,
    });
  };

  const handleClear = () => {
    setFilters({});
    setIncludeMaintenance(false);
    setSelectedLocation(null);
    onFilterChange({});
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setFilters({ ...filters, location });
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)] p-4 space-y-5">

      {/* PRECIO */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-[var(--text-primary)]">Precio</span>
          <div className="flex items-center gap-3">
            <button
              className="text-sm text-[var(--brand-primary)] hover:opacity-80 font-medium"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              ≡ {showMoreFilters ? 'Menos filtros' : 'Más filtros'}
            </button>
            <button className="text-sm text-[var(--brand-primary)] hover:opacity-80 font-medium">
              Crear alerta
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currency === 'PEN' ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
            }`}
            onClick={() => setCurrency('PEN')}
          >
            Soles
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currency === 'USD' ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
            }`}
            onClick={() => setCurrency('USD')}
          >
            USD
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Desde"
            className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Hasta"
            className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        <label className="flex items-center mt-3 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2 accent-[var(--brand-primary)]"
            checked={includeMaintenance}
            onChange={(e) => setIncludeMaintenance(e.target.checked)}
          />
          <span className="text-sm text-[var(--text-secondary)]">Incluir Mantenimiento en el precio final.</span>
        </label>
      </div>

      <hr className="border-[var(--border-light)]" />

      {/* DORMITORIOS */}
      {visibleFilters.includes('DORMITORIOS') && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Dormitorios</label>
          <StyledDropdown
            label="Dormitorios"
            value={filters.bedrooms || ''}
            onChange={(val) => setFilters({ ...filters, bedrooms: val })}
            options={[
              { value: '', label: 'Sin preferencia' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
        </div>
      )}

      {/* BAÑOS */}
      {visibleFilters.includes('BAÑOS') && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Baños</label>
          <StyledDropdown
            label="Baños"
            value={filters.bathrooms || ''}
            onChange={(val) => setFilters({ ...filters, bathrooms: val })}
            options={[
              { value: '', label: 'Sin preferencia' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
          />
        </div>
      )}

      {/* TIPO_BAÑO - Solo para habitaciones */}
      {visibleFilters.includes('TIPO_BAÑO') && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Tipo de baño</label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer hover:bg-[var(--bg-tertiary)] p-2 rounded-lg">
              <input
                type="radio"
                name="tipoBano"
                value="propio"
                className="mr-3 accent-[var(--brand-primary)]"
                onChange={(e) => setFilters({ ...filters, hasPrivateBathroom: true })}
                checked={filters.hasPrivateBathroom === true}
              />
              <span className="text-sm text-[var(--text-secondary)]">Baño propio</span>
            </label>
            <label className="flex items-center cursor-pointer hover:bg-[var(--bg-tertiary)] p-2 rounded-lg">
              <input
                type="radio"
                name="tipoBano"
                value="compartido"
                className="mr-3 accent-[var(--brand-primary)]"
                onChange={(e) => setFilters({ ...filters, hasPrivateBathroom: false })}
                checked={filters.hasPrivateBathroom === false}
              />
              <span className="text-sm text-[var(--text-secondary)]">Baño compartido</span>
            </label>
          </div>
        </div>
      )}

      {/* ÁREA */}
      {visibleFilters.includes('ÁREA') && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Área m²</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Desde"
              className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
            />
            <input
              type="number"
              placeholder="Hasta"
              className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* ESTACIONAMIENTO */}
      {visibleFilters.includes('ESTACIONAMIENTO') && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Estacionamiento</label>
          <StyledDropdown
            label="Estacionamiento"
            value={filters.parking || ''}
            onChange={(val) => setFilters({ ...filters, parking: val })}
            options={[
              { value: '', label: 'Sin preferencia' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
          />
        </div>
      )}

      {/* TERRENO */}
      {visibleFilters.includes('TERRENO') && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Terreno m²</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Desde"
              className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              onChange={(e) => setFilters({ ...filters, minLand: e.target.value })}
            />
            <input
              type="number"
              placeholder="Hasta"
              className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              onChange={(e) => setFilters({ ...filters, maxLand: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* MÁS FILTROS - FRONTIS */}
      {showMoreFilters && visibleFilters.includes('FRONTIS') && (
        <>
          <hr className="border-[var(--border-light)]" />
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Frontis (m)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Desde"
                className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                onChange={(e) => setFilters({ ...filters, minFrontis: e.target.value })}
              />
              <input
                type="number"
                placeholder="Hasta"
                className="px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                onChange={(e) => setFilters({ ...filters, maxFrontis: e.target.value })}
              />
            </div>
          </div>
        </>
      )}

      <hr className="border-[var(--border-light)]" />

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
          className="flex-1 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] px-4 py-3 rounded-lg font-medium text-[var(--text-primary)] text-sm transition-colors"
          onClick={handleClear}
        >
          Limpiar
        </button>
        <button
          className="flex-1 bg-[var(--brand-primary)] hover:opacity-90 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-opacity"
          onClick={handleSubmit}
        >
          Ver resultados
        </button>
      </div>
    </div>
  );
}