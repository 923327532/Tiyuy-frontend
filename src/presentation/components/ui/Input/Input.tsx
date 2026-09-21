import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', required, readOnly, ...props }, ref) => {
    // Strip ALL styling classes from external className — only keep layout/sizing classes
    // But preserve explicit bg-white if passed
    const cleanClassName = className
      .replace(/\bborder-\S+/g, '')
      .replace(/\bfocus:\S+/g, '')
      .replace(/\bplaceholder:\S+/g, '')
      .trim();

    const inputClasses = [
      'w-full px-5 py-3.5 rounded-xl border transition-all duration-200 text-base',
      'placeholder:text-[var(--text-tertiary)] placeholder:text-sm',
      leftIcon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : '',
      error
        ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50 text-[var(--text-primary)]'
        : readOnly
          ? 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] cursor-default focus:outline-none'
          : 'border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent bg-[var(--bg-secondary)] text-[var(--text-primary)]',
      'disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed',
      cleanClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            readOnly={readOnly}
            className={inputClasses}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p style={{color:'red', fontSize:'12px', marginTop:'4px'}}>⚠ {error}</p>
        ) : null}

        {helperText && !error && (
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
