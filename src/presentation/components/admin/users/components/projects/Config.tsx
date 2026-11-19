'use client';

export const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Activo',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  PUBLISHED: {
    label: 'Publicado',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  PENDING: {
    label: 'En revisión',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  COMPLETED: {
    label: 'Completado',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  },
  PAUSED: {
    label: 'Pausado',
    className: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  },
  DRAFT: {
    label: 'Borrador',
    className: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  },
  REJECTED: {
    label: 'Rechazado',
    className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  },
  SUSPENDED: {
    label: 'Suspendido',
    className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  },
};

export const DEFAULT_STATUS = {
  label: 'Sin estado',
  className: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

export const PHASE_CONFIG: Record<
  'PLANNING' | 'CONSTRUCTION' | 'PRE_SALE' | 'SALE' | 'COMPLETED',
  { label: string; className: string }
> = {
  PLANNING: { label: 'Planificación', className: 'bg-slate-100 text-slate-700' },
  CONSTRUCTION: { label: 'En construcción', className: 'bg-blue-100 text-blue-700' },
  PRE_SALE: { label: 'Preventa', className: 'bg-purple-100 text-purple-700' },
  SALE: { label: 'En venta', className: 'bg-emerald-100 text-emerald-700' },
  COMPLETED: { label: 'Completado', className: 'bg-emerald-100 text-emerald-700' },
};