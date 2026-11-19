'use client';

import React, { useState, useEffect, useRef, forwardRef, useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Options */
  options: SelectOption[];
  /** Optional field name */
  name?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required indicator */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Allow empty selection */
  allowEmpty?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      name,
      placeholder = 'Selecciona una opción',
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      className = '',
      allowEmpty = true,
      id,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText && !error ? `${selectId}-helper` : undefined;

    const selectedOption = options.find((o) => o.value === value);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    const handleOptionClick = (optionValue: string) => {
      if (disabled) return;
      onChange(optionValue);
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          setOpen(!open);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) setOpen(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (open) setOpen(false);
          break;
        case 'Escape':
          setOpen(false);
          break;
      }
    };

    return (
      <div
        ref={(node) => {
          selectRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className="relative w-full"
        {...props}
      >
        {name && <input type="hidden" name={name} value={value} />}

        {label && (
          <label
            id={`${selectId}-label`}
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200 text-sm flex items-center justify-between gap-2 text-left
            ${
              disabled
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : error
                  ? 'border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-500'
            }
            ${className}
          `}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-describedby={errorId || helperId}
          aria-disabled={disabled}
        >
          <span
            className={`
              truncate flex-1
              ${selectedOption ? 'text-slate-900' : 'text-slate-400'}
            `}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`
              w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200
              ${open ? 'rotate-180' : ''}
            `}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1"
            role="listbox"
            aria-label={label}
          >
            {allowEmpty && (
              <button
                type="button"
                onClick={() => handleOptionClick('')}
                className={`
                  w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors
                  ${value === '' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
                role="option"
                aria-selected={value === ''}
              >
                <span className="truncate">{placeholder}</span>
                {value === '' && <Check className="w-4 h-4 shrink-0 text-brand-500" strokeWidth={3} aria-hidden="true" />}
              </button>
            )}

            {options.map((opt) => {
              const isSelected = opt.value === value;
              const isDisabled = Boolean(opt.disabled);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => !isDisabled && handleOptionClick(opt.value)}
                  disabled={isDisabled}
                  className={`
                    w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors
                    ${
                      isDisabled
                        ? 'text-slate-300 cursor-not-allowed'
                        : isSelected
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-brand-500" strokeWidth={3} aria-hidden="true" />}
                </button>
              );
            })}

            {options.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No hay opciones disponibles
              </div>
            )}
          </div>
        )}

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

/** MultiSelect - For multiple selections */
export interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'allowEmpty'> {
  /** Selected values */
  value: string[];
  /** Change handler */
  onChange: (value: string[]) => void;
  /** Maximum selections */
  maxSelections?: number;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      value,
      onChange,
      options,
      name,
      placeholder = 'Selecciona opciones',
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      className = '',
      maxSelections,
      id,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText && !error ? `${selectId}-helper` : undefined;

    const selectedOptions = options.filter((o) => value.includes(o.value));

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    const handleToggle = (optionValue: string) => {
      if (disabled) return;

      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : maxSelections && value.length >= maxSelections
          ? value
          : [...value, optionValue];

      onChange(newValue);
    };

    const handleRemove = (optionValue: string) => {
      if (disabled) return;
      onChange(value.filter((v) => v !== optionValue));
    };

    return (
      <div
        ref={(node) => {
          selectRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className="relative w-full"
        {...props}
      >
        {name && <input type="hidden" name={name} value={value.join(',')} />}

        {label && (
          <label
            id={`${selectId}-label`}
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200 text-sm flex items-center justify-between
            ${
              disabled
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : error
                  ? 'border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-500'
            }
            ${className}
          `}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-describedby={errorId || helperId}
          aria-disabled={disabled}
        >
          <div className="flex flex-wrap items-center gap-1.5 min-h-[20px]">
            {selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700"
              >
                {opt.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(opt.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(opt.value);
                    }
                  }}
                  className="p-0.5 rounded hover:bg-brand-100 transition-colors cursor-pointer"
                  aria-label={`Quitar ${opt.label}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </span>
            ))}
            {value.length === 0 && (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={`
              w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ml-2
              ${open ? 'rotate-180' : ''}
            `}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1"
            role="listbox"
            aria-label={label}
          >
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              const isDisabled = Boolean(opt.disabled);
              const isMaxed = Boolean(maxSelections && value.length >= maxSelections && !isSelected);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => !isDisabled && !isMaxed && handleToggle(opt.value)}
                  disabled={isDisabled || isMaxed}
                  className={`
                    w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors
                    ${
                      isDisabled || isMaxed
                        ? 'text-slate-300 cursor-not-allowed'
                        : isSelected
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || isMaxed}
                >
                  <span className="truncate flex-1">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-brand-500" strokeWidth={3} aria-hidden="true" />}
                </button>
              );
            })}

            {options.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No hay opciones disponibles
              </div>
            )}
          </div>
        )}

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';