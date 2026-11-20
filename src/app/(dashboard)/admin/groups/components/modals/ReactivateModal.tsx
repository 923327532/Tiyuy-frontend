'use client';

import { RefreshCw } from 'lucide-react';

import { Modal } from '@/presentation/components/ui/Modal';
import type { Group, Channel } from '../../types';
import '@/presentation/components/admin/users/components/toggle-status/styles/ToggleStatusModal.css';

interface ReactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Group | Channel | null;
  itemType: 'group' | 'channel';
  reason: string;
  setReason: (value: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function ReactivateModal({
  isOpen,
  onClose,
  item,
  itemType,
  reason,
  setReason,
  onConfirm,
  isPending,
}: ReactivateModalProps) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
        className="toggle-status-modal__surface toggle-status-modal__surface--reactivate"
      >
        <header className="toggle-status-modal__header">
          <div className="toggle-status-modal__icon toggle-status-modal__icon--reactivate">
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="toggle-status-modal__header-content">
            <h3 className="toggle-status-modal__title">
              Reactivar {itemType === 'group' ? 'grupo' : 'canal'}
            </h3>
            <p className="toggle-status-modal__description">
              ¿Estás seguro de reactivar <strong>{item.name}</strong>? estará disponible
              para todos los usuarios nuevamente.
            </p>
          </div>
        </header>

        <div className="toggle-status-modal__body">
          <div className="toggle-status-modal__field">
            <label htmlFor="reactivate-reason" className="toggle-status-modal__label">
              Motivo
              <span className="toggle-status-modal__label-optional">(opcional)</span>
            </label>
            <textarea
              id="reactivate-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="toggle-status-modal__textarea toggle-status-modal__textarea--reactivate"
              rows={3}
              placeholder="Indica el motivo de la reactivación..."
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
            className="toggle-status-modal__btn toggle-status-modal__btn--confirm toggle-status-modal__btn--reactivate"
          >
            {isPending ? (
              <>
                <span className="toggle-status-modal__spinner" aria-hidden="true" />
                Reactivando...
              </>
            ) : (
              `Reactivar ${itemType === 'group' ? 'Grupo' : 'Canal'}`
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
