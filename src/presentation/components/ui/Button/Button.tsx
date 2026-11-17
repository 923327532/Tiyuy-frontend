'use client';

import React, { forwardRef } from 'react';
import { Loader } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'brand';
  /** Size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Loading state */
  isLoading?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Custom className */
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-500',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400',
  outline: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  brand: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-400',
};

const sizeStyles = {
  xs: 'px-2.5 py-1.5 text-xs gap-1',
  sm: 'px-3 py-2 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-5 py-3 text-lg gap-2',
  xl: 'px-6 py-4 text-xl gap-2.5',
};

const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/** IconButton - For icon-only buttons */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'default' | 'ghost' | 'danger';
  /** Size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
  /** Icon */
  icon: React.ReactNode;
  /** Aria label (required for accessibility) */
  ariaLabel: string;
  /** Custom className */
  className?: string;
}

const iconVariantStyles = {
  default: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-400',
};

const iconSizeStyles = {
  xs: 'p-1.5',
  sm: 'p-2',
  md: 'p-2.5',
  lg: 'p-3',
};

const iconSizeMap = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({
    variant = 'default',
    size = 'md',
    isLoading = false,
    icon,
    ariaLabel,
    className = '',
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-xl transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${iconVariantStyles[variant]}
          ${iconSizeStyles[size]}
          ${className}
        `}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <span className={iconSizeMap[size]} aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

/** ButtonGroup - For grouping related buttons */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = '', ...props }: ButtonGroupProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}