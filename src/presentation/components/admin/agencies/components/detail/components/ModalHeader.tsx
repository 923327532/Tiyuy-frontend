'use client';

import { X } from 'lucide-react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';

interface ModalHeaderProps {
  agency: InmobiliariaWithStats | null;
  onClose: () => void;
}

export function ModalHeader({ agency, onClose }: ModalHeaderProps) {
  if (!agency) return null;

  const initial = agency.name?.[0] || 'I';
  const isEnabled = agency.enabled !== false;
  const status = agency.status || 'INACTIVE';

  let stateLabel = 'Inactiva';
  let chip = 'bg-slate-100 text-slate-700 ring-slate-500/10';
  let dot = 'bg-slate-500';

  if (!isEnabled) {
    stateLabel = 'Inactiva';
  } else if (status === 'ACTIVE') {
    stateLabel = 'Activa';
    chip = 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    dot = 'bg-emerald-500';
  } else if (status === 'SUSPENDED') {
    stateLabel = 'Suspendida';
    chip = 'bg-rose-50 text-rose-700 ring-rose-600/20';
    dot = 'bg-rose-500';
  }

  return (
    <header className="user-detail-modal__header">
      <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
        {initial}
      </span>

      <div className="user-detail-modal__identity">
        <h3 className="user-detail-modal__name" title={agency.name}>
          {agency.name}
        </h3>
        <p className="user-detail-modal__email" title={`RUC: ${agency.ruc || '—'}`}>
          RUC: {agency.ruc || '—'}
        </p>

        <div className="user-detail-modal__badges">
          <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">
            Inmobiliaria
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
            {stateLabel}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="user-detail-modal__close-btn"
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </header>
  );
}
