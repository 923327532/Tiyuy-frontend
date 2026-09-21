'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Selector (dropdown) estilizado acorde al diseño de Tiyuy.
 * Reemplaza el <select> nativo del navegador por una lista
 * personalizada con el verde de la marca, bordes redondeados
 * y el mismo look del componente Input.
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecciona una opción',
  label,
  required = false,
  error,
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="w-full relative" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full px-5 py-3.5 rounded-xl border transition-all duration-200 text-sm flex items-center justify-between gap-2 text-left bg-[var(--bg-secondary)] ${
          error
            ? 'border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
            : 'border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent'
        } disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed cursor-pointer ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selectedOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[var(--text-tertiary)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full max-h-60 overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-[var(--brand-primary)]" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>⚠ {error}</p>
      )}
    </div>
  );
};
