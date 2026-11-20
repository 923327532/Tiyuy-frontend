'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import './styles/AgencyConfirmStatusModal.css';

interface Props {
  agency: InmobiliariaWithStats | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  action: 'activate' | 'suspend' | 'block';
}

const actionConfig = {
  activate: {
    icon: CheckCircle,
    iconVariant: 'activate' as const,
    title: 'Activar inmobiliaria',
    message: '¿Estás seguro de que quieres activar esta inmobiliaria?',
    confirmLabel: 'Activar',
    warningVariant: 'activate' as const,
    warningMessage: 'La inmobiliaria recuperará acceso completo a la plataforma.',
    btnVariant: 'activate' as const,
  },
  suspend: {
    icon: PauseCircle,
    iconVariant: 'suspend' as const,
    title: 'Suspender inmobiliaria',
    message: '¿Estás seguro de que quieres suspender esta inmobiliaria?',
    confirmLabel: 'Suspender',
    warningVariant: 'suspend' as const,
    warningMessage: 'La inmobiliaria no podrá crear nuevos proyectos ni agentes hasta que se reactive.',
    btnVariant: 'suspend' as const,
  },
  block: {
    icon: XCircle,
    iconVariant: 'block' as const,
    title: 'Bloquear inmobiliaria',
    message: '¿Estás seguro de que quieres bloquear esta inmobiliaria? Esta acción es más severa que suspender.',
    confirmLabel: 'Bloquear',
    warningVariant: 'block' as const,
    warningMessage: 'La inmobiliaria perderá acceso a todas las funcionalidades y sus agentes no podrán operar.',
    btnVariant: 'block' as const,
  },
};

export function AgencyConfirmStatusModal({ agency, isOpen, onClose, onConfirm, isPending, action }: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen, agency?.id]);

  if (!agency) return null;

  const config = actionConfig[action];
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className={`agency-confirm-status-modal__surface agency-confirm-status-modal__surface--${action}`}>
        <header className="agency-confirm-status-modal__header">
          <div className={`agency-confirm-status-modal__icon agency-confirm-status-modal__icon--${action}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="agency-confirm-status-modal__header-content">
            <h3 className="agency-confirm-status-modal__title">{config.title}</h3>
            <p className="agency-confirm-status-modal__description">
              {config.message}
            </p>
          </div>
        </header>

        <div className="agency-confirm-status-modal__body">
          <p className="agency-confirm-status-modal__message">
            {config.message.replace('¿Estás seguro de que quieres ', '').replace('?', '')}
          </p>

          <div className="agency-confirm-status-modal__agency-info">
            <p className="agency-confirm-status-modal__agency-name">{agency.name}</p>
            <p className="agency-confirm-status-modal__agency-ruc">RUC: {agency.ruc || '—'}</p>
          </div>

          <div className={`agency-confirm-status-modal__warning agency-confirm-status-modal__warning--${action}`}>
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <span>{config.warningMessage}</span>
          </div>

          <div className="agency-confirm-status-modal__field">
            <label htmlFor="confirm-status-reason" className="agency-confirm-status-modal__label">
              Motivo
              <span className="agency-confirm-status-modal__label-optional">(opcional)</span>
            </label>
            <textarea
              id="confirm-status-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="agency-confirm-status-modal__textarea"
              rows={3}
              placeholder="Indica el motivo del cambio de estado..."
              disabled={isPending}
            />
          </div>
        </div>

        <footer className="agency-confirm-status-modal__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="agency-confirm-status-modal__btn agency-confirm-status-modal__btn--cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`agency-confirm-status-modal__btn agency-confirm-status-modal__btn--confirm agency-confirm-status-modal__btn--confirm--${action}`}
          >
            {isPending ? (
              <>
                <span className="agency-confirm-status-modal__spinner" aria-hidden="true" />
                Procesando...
              </>
            ) : (
              config.confirmLabel
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}