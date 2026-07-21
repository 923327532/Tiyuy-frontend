'use client';
import { useState, useEffect, useRef } from 'react';
import { Briefcase, Building, Home, Info, Key, Move, ShoppingBag, Tag } from 'lucide-react';


interface BasicInfoStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  propertyId?: number;
  validationErrors?: Record<string, string>;
}

export function BasicInfoStep({ formData, onChange, validationErrors }: BasicInfoStepProps) {
  const isActive = (field: string, value: string) => formData[field] === value;

  const PROPERTY_TYPES = [
    { value: 'APARTMENT', label: 'Departamento', icon: (<Building className="w-6 h-6" />) },
    { value: 'HOUSE', label: 'Casa', icon: (<Home className="w-6 h-6" />) },
    { value: 'LAND', label: 'Terreno', icon: (<Move className="w-6 h-6" />) },
    { value: 'OFFICE', label: 'Oficina', icon: (<Briefcase className="w-6 h-6" />) },
    { value: 'COMMERCIAL', label: 'Local Comercial', icon: (<ShoppingBag className="w-6 h-6" />) },
    { value: 'ROOM', label: 'Habitacion', icon: (<Home className="w-6 h-6" />) },
  ];

  const TRANSACTION_LABELS: Record<string, string> = {
    SALE: 'Venta',
    RENT: 'Alquiler',
  };

  // Custom currency selector component
  function CurrencySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const options = [
      { value: 'PEN', label: 'S/ PEN' },
      { value: 'USD', label: '$ USD' },
    ];
    const selected = options.find(o => o.value === value);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
      <div className="relative sm:w-40" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text-primary)] cursor-pointer transition-all hover:border-[var(--brand-primary)] shadow-sm font-medium"
        >
          <span>{selected?.label || 'S/ PEN'}</span>
          <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[var(--brand-primary-light)] hover:text-[var(--brand-primary)] ${value === opt.value ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-semibold' : 'text-[var(--text-primary)]'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .bis-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }

        .transaction-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-card);
          font-weight: 600;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .transaction-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          background: var(--brand-primary-light);
        }
        .transaction-btn.active {
          border-color: var(--brand-primary);
          background: var(--brand-primary);
          color: #fff;
          box-shadow: 0 4px 14px rgba(0,166,62,0.3);
        }

        .type-btn {
          padding: 16px 12px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-card);
          font-weight: 600;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
        }
        .type-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          background: var(--brand-primary-light);
        }
        .type-btn:hover svg { color: var(--brand-primary); }
        .type-btn.active {
          border-color: var(--brand-primary);
          background: var(--brand-primary-light);
          color: rgba(0,0,0,0.8);
        }
        .type-btn.active svg { color: var(--brand-primary); }

        .field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 10px;
          display: block;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 14px;
          color: var(--text-primary);
          background: var(--bg-card);
          transition: all 0.2s ease;
          outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .form-input::placeholder { color: var(--text-muted); }
        .form-input:focus {
          border-color: var(--brand-primary);
          background: var(--bg-card);
          box-shadow: 0 0 0 3px var(--brand-primary-light);
        }

        .form-select {
          padding: 13px 16px;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 14px;
          color: var(--text-primary);
          background: var(--bg-card);
          transition: all 0.2s ease;
          outline: none;
          cursor: pointer;
          appearance: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .form-select:focus {
          border-color: var(--brand-primary);
          background: var(--bg-card);
          box-shadow: 0 0 0 3px var(--brand-primary-light);
        }

        .section-divider {
          width: 28px;
          height: 2.5px;
          background: var(--brand-primary);
          border-radius: 2px;
          margin-bottom: 14px;
        }
      `}</style>

      <div className="bis-wrap space-y-8">

        {/* ── TRANSACCIÓN ── */}
        <div>
          <div className="section-divider" />
          <label className="field-label">¿Que deseas hacer?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange('transactionType', 'SALE')}
              className={`transaction-btn ${isActive('transactionType', 'SALE') ? 'active' : ''}`}
            >
              <Tag className="w-4 h-4" />
              Vender
            </button>
            <button
              type="button"
              onClick={() => onChange('transactionType', 'RENT')}
              className={`transaction-btn ${isActive('transactionType', 'RENT') ? 'active' : ''}`}
            >
              <Key className="w-4 h-4" />
              Alquilar
            </button>
          </div>
          {validationErrors?.transactionType && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.transactionType}</p>
          )}
        </div>

        {/* ── TIPO DE PROPIEDAD ── */}
        <div>
          <div className="section-divider" />
          <label className="field-label">Tipo de propiedad</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange('type', type.value)}
                className={`type-btn ${isActive('type', type.value) ? 'active' : ''}`}
              >
                <span style={{ color: isActive('type', type.value) ? 'var(--brand-primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
                  {type.icon}
                </span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          {validationErrors?.type && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.type}</p>
          )}
        </div>

        {/* ── PRECIO ── */}
        <div>
          <div className="section-divider" />
          <label className="field-label">Precio</label>
          <div className="flex flex-col sm:flex-row gap-3">
              <CurrencySelector
                value={formData.currency}
                onChange={(v) => onChange('currency', v)}
              />
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => onChange('price', Number(e.target.value))}
              required
              className={`form-input flex-1 ${validationErrors?.price ? 'border-red-500' : ''}`}
              placeholder="Ingresa el precio"
            />
          </div>
          {validationErrors?.price && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.price}</p>
          )}
        </div>

        {/* ── DESCRIPCIÓN ── */}
        <div>
          <div className="section-divider" />
          <label className="field-label">Descripcion</label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={5}
            className={`form-input resize-none ${validationErrors?.description ? 'border-red-500' : ''}`}
            placeholder="Describe tu propiedad... (mín. 30 caracteres)"
          />
          {validationErrors?.description ? (
            <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-green-400 shrink-0" />
              Una buena descripcion ayuda a vender mas rapido (mín. 30 caracteres)
            </p>
          )}
        </div>

      </div>
    </div>
  );
}