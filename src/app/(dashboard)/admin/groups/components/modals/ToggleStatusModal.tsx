'use client';

import { Ban, CheckCircle2 } from 'lucide-react';

import { Modal } from '@/presentation/components/ui/Modal';
import type { Group, Channel } from '../../types';
import '@/presentation/components/admin/users/components/toggle-status/styles/ToggleStatusModal.css';

interface ToggleStatusModalProps {
  item: Group | Channel | null;
  isOpen: boolean;
  reason: string;
  setReason: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function ToggleStatusModal({
  item,
  isOpen,
  reason,
  setReason,
  onClose,
  onConfirm,
  isPending,
}: ToggleStatusModalProps) {
  if (!item) return null;

  const isChannel = 'city' in item;
  const isDisableAction = item.isActive;
  const actionVariant = isDisableAction ? 'suspend' : 'reactivate';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
        className={`toggle-status-modal__surface toggle-status-modal__surface--${actionVariant}`}
      >
        <header className="toggle-status-modal__header">
          <div className={`toggle-status-modal__icon toggle-status-modal__icon--${actionVariant}`}>
            {isDisableAction ? (
              <Ban className="w-5 h-5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          <div className="toggle-status-modal__header-content">
            <h3 className="toggle-status-modal__title">
              {isDisableAction ? `¿Deshabilitar ${isChannel ? 'canal' : 'grupo'}?` : `¿Habilitar ${isChannel ? 'canal' : 'grupo'}?`}
            </h3>
            <p className="toggle-status-modal__description">
              {isDisableAction
                ? `¿Estás seguro de deshabilitar temporalmente ${item.name}? No estará disponible para los usuarios.`
                : `¿Estás seguro de habilitar nuevamente ${item.name}? Estará disponible para todos los usuarios.`}
            </p>
          </div>
        </header>

        <div className="toggle-status-modal__body">
          <div className="toggle-status-modal__field">
            <label htmlFor="toggle-status-reason" className="toggle-status-modal__label">
              Motivo
              <span className="toggle-status-modal__label-optional">(opcional)</span>
            </label>
            <textarea
              id="toggle-status-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={`toggle-status-modal__textarea toggle-status-modal__textarea--${actionVariant}`}
              rows={3}
              placeholder="Indica el motivo del cambio de estado..."
              disabled={isPending}
            />
          </div>
        </div>

        <footer className="toggle-status-modal__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="toggle-status-modal__btn toggle-status-modal__btn--cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`toggle-status-modal__btn toggle-status-modal__btn--confirm toggle-status-modal__btn--${actionVariant}`}
          >
            {isPending ? (
              <>
                <span className="toggle-status-modal__spinner" aria-hidden="true" />
                Procesando...
              </>
            ) : isDisableAction ? (
              'Deshabilitar'
            ) : (
              'Habilitar'
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
