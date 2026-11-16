'use client';

import React from 'react';
import { Button } from '@/presentation/components/ui/Button/Button';

export interface EmptyStateProps {
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'brand';
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Custom className */
  className?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'py-8 px-4',
  md: 'py-12 px-6',
  lg: 'py-16 px-8',
};

const iconSizes = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  return (
    <div className={`text-center ${sizeStyles[size]} ${className}`}>
      {icon && (
        <div className={`mx-auto mb-4 text-slate-300 ${iconSizes[size]}`}>
          {icon}
        </div>
      )}

      <h3 className={`font-semibold ${size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl'} text-slate-900`}>
        {title}
      </h3>

      {description && (
        <p className={`mt-2 ${size === 'sm' ? 'text-sm' : 'text-base'} text-slate-500 max-w-md mx-auto`}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && (
            <Button
              variant={action.variant || 'primary'}
              size={size === 'sm' ? 'sm' : 'md'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              variant="ghost"
              size={size === 'sm' ? 'sm' : 'md'}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** Pre-built empty states for common scenarios */

export function EmptySearch({
  query,
  onClear,
  className = '',
}: { query: string; onClear?: () => void; className?: string }) {
  return (
    <EmptyState
      title="No se encontraron resultados"
      description={`No hay coincidencias para "${query}". Intenta con otros términos.`}
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      action={onClear ? { label: 'Limpiar búsqueda', onClick: onClear, variant: 'outline' } : undefined}
      className={className}
    />
  );
}

export function EmptyData({
  title = 'No hay datos disponibles',
  description = 'No se encontraron registros que coincidan con tus criterios.',
  action,
  className = '',
}: { title?: string; description?: string; action?: EmptyStateProps['action']; className?: string }) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      action={action}
      className={className}
    />
  );
}

export function EmptyUsers({
  onAddUser,
  className = '',
}: { onAddUser?: () => void; className?: string }) {
  return (
    <EmptyState
      title="No hay usuarios registrados"
      description="Comienza agregando el primer usuario a la plataforma."
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      }
      action={onAddUser ? { label: 'Agregar usuario', onClick: onAddUser, variant: 'brand' } : undefined}
      className={className}
    />
  );
}

export function EmptyProperties({
  onAddProperty,
  className = '',
}: { onAddProperty?: () => void; className?: string }) {
  return (
    <EmptyState
      title="No hay propiedades publicadas"
      description="Comienza publicando tu primera propiedad en la plataforma."
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      action={onAddProperty ? { label: 'Publicar propiedad', onClick: onAddProperty, variant: 'brand' } : undefined}
      className={className}
    />
  );
}

export function EmptyProjects({
  onAddProject,
  className = '',
}: { onAddProject?: () => void; className?: string }) {
  return (
    <EmptyState
      title="No hay proyectos inmobiliarios"
      description="Crea tu primer proyecto para empezar a gestionar desarrollos inmobiliarios."
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      action={onAddProject ? { label: 'Crear proyecto', onClick: onAddProject, variant: 'brand' } : undefined}
      className={className}
    />
  );
}

export function EmptyActivity({
  className = '',
}: { className?: string }) {
  return (
    <EmptyState
      title="No hay actividad reciente"
      description="La actividad aparecerá aquí cuando haya eventos en la plataforma."
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      size="sm"
      className={className}
    />
  );
}