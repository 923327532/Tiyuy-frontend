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
          className="w-full flex items-center justify-between px-4 py-3 border-2 border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text-primary)] cursor-pointer transition-all hover:border-[var(--brand-primary)] shadow-sm font-medium"
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
    <div className="space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">

        {/* ── TRANSACCIÓN ── */}
        <div>
          <div className="w-7 h-0.5 bg-[var(--brand-primary)] rounded mb-2" />
          <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5 block">¿Que deseas hacer?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange('transactionType', 'SALE')}
              className={`flex-1 py-3 px-5 rounded-xl border-2 font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 ${
                isActive('transactionType', 'SALE')
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-[0_4px_14px_rgba(0,166,62,0.3)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]'
              }`}
            >
              <Tag className="w-4 h-4" />
              Vender
            </button>
            <button
              type="button"
              onClick={() => onChange('transactionType', 'RENT')}
              className={`flex-1 py-3 px-5 rounded-xl border-2 font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 ${
                isActive('transactionType', 'RENT')
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-[0_4px_14px_rgba(0,166,62,0.3)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]'
              }`}
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
          <div className="w-7 h-0.5 bg-[var(--brand-primary)] rounded mb-2" />
          <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5 block">Tipo de propiedad</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange('type', type.value)}
                className={`py-3 px-1.5 sm:py-4 sm:px-3 rounded-xl border-2 font-semibold text-[13px] cursor-pointer transition-all flex flex-col items-center gap-1 sm:gap-2 w-full ${
                  isActive('type', type.value)
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-black/80 [&>span:first-child]:text-[var(--brand-primary)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] [&:hover>span:first-child]:text-[var(--brand-primary)]'
                }`}
              >
                <span className={`transition-colors ${isActive('type', type.value) ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>
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
          <div className="w-7 h-0.5 bg-[var(--brand-primary)] rounded mb-2" />
          <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5 block">Precio</label>
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
              className={`w-full py-3 px-4 border-2 rounded-lg text-sm text-[var(--text-primary)] bg-[var(--bg-card)] transition-all outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_var(--brand-primary-light)] flex-1 ${
                validationErrors?.price ? 'border-red-500' : 'border-[var(--input-border)]'
              }`}
              placeholder="Ingresa el precio"
            />
          </div>
          {validationErrors?.price && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.price}</p>
          )}
        </div>

        {/* ── DESCRIPCIÓN ── */}
        <div>
          <div className="w-7 h-0.5 bg-[var(--brand-primary)] rounded mb-2" />
          <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5 block">Descripcion</label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={5}
            className={`w-full py-3 px-4 border-2 rounded-lg text-sm text-[var(--text-primary)] bg-[var(--bg-card)] transition-all outline-none resize-none placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_var(--brand-primary-light)] ${
              validationErrors?.description ? 'border-red-500' : 'border-[var(--input-border)]'
            }`}
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
  );
}