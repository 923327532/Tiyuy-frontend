'use client';

import { useState, useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';

const Counter = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 20 
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void; 
  min?: number; 
  max?: number; 
}) => {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const commitValue = (v: string) => {
    const parsed = parseInt(v, 10);
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const newVal = Math.max(min, value - 1);
            onChange(newVal);
          }}
          className="w-10 h-10 rounded-lg border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors shrink-0 text-[var(--text-secondary)]"
          disabled={value <= min}
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-20">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={(e) => {
              if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
                setInputValue(String(min));
                onChange(min);
              } else {
                commitValue(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="w-full text-center text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--input-border)] rounded-lg py-2 px-2 hide-arrows outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            min={min}
            max={max}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const newVal = Math.min(max, value + 1);
            onChange(newVal);
          }}
          className="w-10 h-10 rounded-lg border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors shrink-0 text-[var(--text-secondary)]"
          disabled={value >= max}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface CharacteristicsStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors?: Record<string, string>;
}

export function CharacteristicsStep({ formData, onChange, validationErrors }: CharacteristicsStepProps) {
  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-[var(--input-border)] text-sm text-[var(--text-primary)] bg-[var(--bg-card)] outline-none';

  // Selector de opciones - modo chips cuando hay más de 4 opciones
  const OptionSelector = ({ 
    label, 
    value, 
    onChange, 
    options 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    options: { label: string; value: string }[]; 
  }) => {
    const isChipMode = options.length > 4;
    return (
      <div>
        <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
          {label}
        </label>
        <div className={isChipMode ? 'flex flex-wrap gap-1.5' : 'flex gap-2'}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                font-semibold transition-all border
                ${isChipMode 
                  ? 'px-3.5 py-1.5 text-[12px] rounded-lg' 
                  : 'flex-1 py-2.5 rounded-lg text-sm'}
                ${value === option.value
                  ? 'text-white border-[var(--brand-primary)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'}
              `}
              style={{
                backgroundColor: value === option.value ? 'var(--brand-primary)' : undefined,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const NumberInput = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    suffix = '',
    prefix = '',
    optional = false 
  }: {
    label: string;
    value: string | number | undefined | null;
    onChange: (value: string) => void;
    placeholder: string;
    suffix?: string;
    prefix?: string;
    optional?: boolean;
  }) => {
    const [localValue, setLocalValue] = useState<string>(() => String(value ?? ''));
    const committedRef = useRef(String(value ?? ''));

    useEffect(() => {
      const strVal = String(value ?? '');
      if (strVal !== committedRef.current) {
        setLocalValue(strVal);
        committedRef.current = strVal;
      }
    }, [value]);

    const commit = () => {
      const v = localValue.trim();
      committedRef.current = v || '';
      if (v === '' || isNaN(Number(v))) {
        setLocalValue('');
        onChange('');
      } else {
        onChange(v);
      }
    };

    return (
      <div>
        <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
          {label} {optional && <span className="text-[var(--text-muted)] font-normal normal-case">(opcional)</span>}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] text-sm">
              {prefix}
            </span>
          )}
          <input
            type="text"
            inputMode="numeric"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder={placeholder}
            className={`${inputClass} ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''} hide-arrows`}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Renderizar según el tipo de propiedad
  const renderPropertyCharacteristics = () => {
    switch (formData.type) {
      case 'ROOM':
        return (
          <>
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                Características de la habitación
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Especifica los servicios disponibles
              </p>

              <div className="space-y-6">
                <OptionSelector
                  label="Tipo de baño"
                  value={formData.bathroomType || 'PRIVATE'}
                  onChange={(value) => onChange('bathroomType', value)}
                  options={[
                    { label: 'Baño propio', value: 'PRIVATE' },
                    { label: 'Baño compartido', value: 'SHARED' },
                  ]}
                />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <NumberInput
                        label="Área de la habitación"
                        value={formData.roomArea}
                        onChange={(value) => onChange('roomArea', value)}
                        placeholder="0"
                        suffix="m²"
                      />
                      {validationErrors?.roomArea && <p className="mt-1 text-sm text-red-600">{validationErrors.roomArea}</p>}
                    </div>
                    <NumberInput
                      label="Capacidad máxima"
                      value={formData.maxCapacity}
                      onChange={(value) => onChange('maxCapacity', value)}
                      placeholder="1"
                      suffix="personas"
                    />
                  </div>
              </div>
            </section>
          </>
        );

      case 'LAND':
        return (
          <>
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                Características del terreno
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Especifica las medidas, servicios y zonificacion del lote
              </p>

              <div className="space-y-6">
                {/* ── MEDIDAS ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Medidas del lote</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <NumberInput
                        label="Área total (m2) *"
                        value={formData.totalArea}
                        onChange={(value) => onChange('totalArea', value)}
                        placeholder="0"
                        suffix="m²"
                      />
                      {validationErrors?.totalArea && <p className="mt-1 text-sm text-red-600">{validationErrors.totalArea}</p>}
                    </div>
                    <NumberInput
                      label="Área construida (opcional)"
                      value={formData.builtArea}
                      onChange={(value) => onChange('builtArea', value)}
                      placeholder="0"
                      suffix="m²"
                      optional={true}
                    />
                    <NumberInput
                      label="Frente"
                      value={formData.frontage}
                      onChange={(value) => onChange('frontage', value)}
                      placeholder="0"
                      suffix="ml"
                    />
                    <NumberInput
                      label="Fondo"
                      value={formData.depth}
                      onChange={(value) => onChange('depth', value)}
                      placeholder="0"
                      suffix="ml"
                    />
                    <NumberInput
                      label="Perimetro"
                      value={formData.perimeter}
                      onChange={(value) => onChange('perimeter', value)}
                      placeholder="0"
                      suffix="ml"
                    />
                  </div>
                </div>

                {/* ── TOPOGRAFIA ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Topografia</h3>
                  <OptionSelector
                    label="Tipo de terreno"
                    value={formData.topography || 'FLAT'}
                    onChange={(value) => onChange('topography', value)}
                    options={[
                      { label: 'Plano', value: 'FLAT' },
                      { label: 'Ligera pendiente', value: 'SLIGHT_SLOPE' },
                      { label: 'Inclinado', value: 'STEEP' },
                      { label: 'Accidentado', value: 'IRREGULAR' },
                    ]}
                  />
                </div>

                {/* ── SERVICIOS BASICOS ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Servicios basicos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ['hasWater', 'Agua'],
                      ['hasElectricity', 'Electricidad'],
                      ['hasSewerage', 'Desague'],
                      ['hasGas', 'Gas natural'],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
                        <input
                          type="checkbox"
                          checked={(formData as any)[key] || false}
                          onChange={(e) => onChange(key, e.target.checked)}
                          className="rounded text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                        />
                        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── ZONIFICACION Y DOCUMENTOS ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Zonificacion y documentos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <OptionSelector
                      label="Zonificacion / Uso de suelo"
                      value={formData.zoning || 'RESIDENTIAL'}
                      onChange={(value) => onChange('zoning', value)}
                      options={[
                        { label: 'Residencial', value: 'RESIDENTIAL' },
                        { label: 'Comercial', value: 'COMMERCIAL' },
                        { label: 'Industrial', value: 'INDUSTRIAL' },
                        { label: 'Agricola', value: 'AGRICULTURAL' },
                        { label: 'Rustico', value: 'RUSTIC' },
                        { label: 'Mixto', value: 'MIXED' },
                      ]}
                    />
                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.hasPropertyTitle || false}
                          onChange={(e) => onChange('hasPropertyTitle', e.target.checked)}
                          className="rounded text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                        />
                        <span className="text-sm text-[var(--text-secondary)]">Cuenta con titulo de propiedad</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );

      case 'OFFICE':
        return (
          <>
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                Características de la oficina
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Detalles del espacio comercial
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Counter
                    label="Baños"
                    value={formData.bathrooms || 1}
                    onChange={(value) => onChange('bathrooms', value)}
                    min={0}
                    max={10}
                  />
                  <Counter
                    label="Estacionamientos"
                    value={formData.parking || 0}
                    onChange={(value) => onChange('parking', value)}
                    min={0}
                    max={50}
                  />
                  <Counter
                    label="Piso de la oficina"
                    value={formData.officeFloors || 1}
                    onChange={(value) => onChange('officeFloors', value)}
                    min={1}
                    max={20}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <NumberInput
                      label="Área total"
                      value={formData.totalArea}
                      onChange={(value) => onChange('totalArea', value)}
                      placeholder="0"
                      suffix="m²"
                    />
                    {validationErrors?.totalArea && <p className="mt-1 text-sm text-red-600">{validationErrors.totalArea}</p>}
                  </div>
                  <NumberInput
                    label="Área útil"
                    value={formData.usableArea}
                    onChange={(value) => onChange('usableArea', value)}
                    placeholder="0"
                    suffix="m²"
                  />
                </div>

                <OptionSelector
                  label="Tipo de oficina"
                  value={formData.officeType || 'PRIVATE'}
                  onChange={(value) => onChange('officeType', value)}
                  options={[
                    { label: 'Privada', value: 'PRIVATE' },
                    { label: 'Coworking', value: 'COWORKING' },
                    { label: 'Servido', value: 'SERVED' },
                  ]}
                />
              </div>
            </section>
          </>
        );

      default: // APARTMENT, HOUSE, COMMERCIAL, etc.
        const isCommercial = formData.type === 'COMMERCIAL';
        return (
          <>
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                Características principales
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Indica la cantidad de ambientes disponibles
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Counter
                  label={isCommercial ? 'Ambientes' : 'Dormitorios'}
                  value={formData.bedrooms || 1}
                  onChange={(value) => onChange('bedrooms', value)}
                  min={0}
                  max={20}
                />
                <Counter
                  label="Baños"
                  value={formData.bathrooms || 1}
                  onChange={(value) => onChange('bathrooms', value)}
                  min={0}
                  max={20}
                />
                <Counter
                  label="Estacionamientos"
                  value={formData.parking || 0}
                  onChange={(value) => onChange('parking', value)}
                  min={0}
                  max={20}
                />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                Medidas del inmueble
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Especifica las áreas en metros cuadrados
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <NumberInput
                    label="Área total"
                    value={formData.totalArea}
                    onChange={(value) => onChange('totalArea', value)}
                    placeholder="0"
                    suffix="m²"
                  />
                  {validationErrors?.totalArea && <p className="mt-1 text-sm text-red-600">{validationErrors.totalArea}</p>}
                </div>
                <div>
                  <NumberInput
                    label="Área construida"
                    value={formData.builtArea}
                    onChange={(value) => onChange('builtArea', value)}
                    placeholder="0"
                    suffix="m²"
                  />
                  {validationErrors?.builtArea && <p className="mt-1 text-sm text-red-600">{validationErrors.builtArea}</p>}
                </div>
              </div>
            </section>

            {formData.type === 'APARTMENT' && (
              <section>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                  Detalles del departamento
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Información adicional específica para departamentos
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInput
                    label="Piso"
                    value={formData.floor}
                    onChange={(value) => onChange('floor', value)}
                    placeholder="1"
                  />
                  <NumberInput
                    label="Antigüedad (años)"
                    value={formData.age}
                    onChange={(value) => onChange('age', value)}
                    placeholder="0"
                    suffix="años"
                  />
                </div>
              </section>
            )}
          </>
        );
    }
  };

  return (
    <div className="space-y-8">
      <style>{`
        input[type="number"].hide-arrows::-webkit-outer-spin-button,
        input[type="number"].hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"].hide-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
      {renderPropertyCharacteristics()}

      {formData.type !== 'LAND' && (
        <section>
          <NumberInput
            label="Mantenimiento mensual"
            value={formData.maintenanceFee}
            onChange={(value) => onChange('maintenanceFee', value)}
            placeholder="0"
            prefix="$"
            optional={true}
          />
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Costo mensual de mantenimiento o cuota de condominio
          </p>
        </section>
      )}
    </div>
  );
}
