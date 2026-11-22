'use client';

import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Required indicator */
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    required = false,
    id,
    readOnly,
    disabled,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    const inputClasses = [
      'w-full px-4 py-3 rounded-xl border transition-colors duration-200 text-base',
      'placeholder:text-slate-400 placeholder:text-sm',
      leftIcon ? 'pl-12' : '',
      rightIcon ? 'pr-12' : '',
      error
        ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50 text-slate-900'
        : readOnly
          ? 'border-slate-200 bg-slate-50 text-slate-600 cursor-default focus:outline-none'
          : disabled
            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
            : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-500 bg-white text-slate-900',
      'disabled:bg-slate-50 disabled:cursor-not-allowed',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            readOnly={readOnly}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId || helperId}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
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
      </div>
    );
  }
);

Input.displayName = 'Input';

/** SearchInput - Specialized input for search */
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type' | 'onChange'> {
  /** Placeholder text */
  placeholder?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Clear handler */
  onClear?: () => void;
  /** Loading state */
  isLoading?: boolean;
}

import { Search, X, Loader } from 'lucide-react';

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    placeholder = 'Buscar...',
    onClear,
    isLoading = false,
    value,
    onChange,
    className = '',
    disabled,
    id,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleClear = () => {
      onClear?.();
    };

    return (
      <div className="relative w-full">
        <label htmlFor={inputId} className="sr-only">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />

          <input
            ref={ref}
            id={inputId}
            type="search"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full pl-10 pr-10 py-3 rounded-xl border transition-all duration-200 text-base
              placeholder:text-slate-400
              ${isLoading ? 'pr-12' : ''}
              ${value && onClear ? 'pr-12' : ''}
              ${disabled
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-500 bg-white text-slate-900'
              }
              ${className}
            `}
            autoComplete="off"
            {...props}
          />

          {isLoading && (
            <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" aria-hidden="true" />
          )}

          {value && onClear && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

/** Textarea - For multi-line input */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error,
    helperText,
    className = '',
    required = false,
    id,
    disabled,
    ...props
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText && !error ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200 text-base resize-y min-h-[100px]
            placeholder:text-slate-400
            ${error
              ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50 text-slate-900'
              : disabled
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-500 bg-white text-slate-900'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
          {...props}
        />

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

Textarea.displayName = 'Textarea';