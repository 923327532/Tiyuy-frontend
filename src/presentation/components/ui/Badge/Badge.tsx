'use client';

import React, { forwardRef } from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
  /** Size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Whether to show as dot indicator */
  dot?: boolean;
  /** Custom className */
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
};

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1 text-base',
};

const dotColors = {
  default: 'bg-slate-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
  brand: 'bg-brand-500',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 font-medium rounded-full border
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`
              w-1.5 h-1.5 rounded-full flex-shrink-0
              ${dotColors[variant]}
            `}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/** StatusBadge - Specialized badge for entity status */
export interface StatusBadgeProps {
  /** Status value */
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'verified' | 'unverified' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  /** Size */
  size?: 'xs' | 'sm' | 'md';
  /** Show label text */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
}

const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeProps['variant']; label: string; dot: boolean }> = {
  active: { variant: 'success', label: 'Activo', dot: true },
  inactive: { variant: 'neutral', label: 'Inactivo', dot: true },
  pending: { variant: 'warning', label: 'Pendiente', dot: false },
  suspended: { variant: 'danger', label: 'Suspendido', dot: true },
  verified: { variant: 'success', label: 'Verificado', dot: false },
  unverified: { variant: 'warning', label: 'Sin verificar', dot: false },
  approved: { variant: 'success', label: 'Aprobado', dot: false },
  rejected: { variant: 'danger', label: 'Rechazado', dot: false },
  processing: { variant: 'info', label: 'Procesando', dot: false },
  completed: { variant: 'success', label: 'Completado', dot: false },
  failed: { variant: 'danger', label: 'Fallido', dot: false },
};

export function StatusBadge({ status, size = 'sm', showLabel = true, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size={size} dot={config.dot && showLabel} className={className}>
      {showLabel && config.label}
    </Badge>
  );
}

/** RoleBadge - Specialized badge for user roles */
export interface RoleBadgeProps {
  role: 'ADMIN' | 'USER' | 'AGENT' | 'DEVELOPER' | string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const roleConfig: Record<string, { variant: BadgeProps['variant']; label: string; icon?: React.ReactNode }> = {
  ADMIN: { variant: 'danger', label: 'Administrador' },
  USER: { variant: 'neutral', label: 'Usuario' },
  AGENT: { variant: 'info', label: 'Agente' },
  DEVELOPER: { variant: 'brand', label: 'Promotor' },
};

export function RoleBadge({ role, size = 'sm', className = '' }: RoleBadgeProps) {
  const config = roleConfig[role] || { variant: 'default', label: role };

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}