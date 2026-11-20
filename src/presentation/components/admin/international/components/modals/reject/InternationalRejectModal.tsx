'use client';

import { ShieldX } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import './styles/InternationalRejectModal.css';

interface Props {
  isOpen: boolean;
  reason: string;
  isPending: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function InternationalRejectModal({
  isOpen,
  reason,
  isPending,
  onReasonChange,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="intl-reject-modal__surface">
        <header className="intl-reject-modal__header">
          <div className="intl-reject-modal__icon">
            <ShieldX className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="intl-reject-modal__header-content">
            <h3 className="intl-reject-modal__title">Rechazar documento</h3>
            <p className="intl-reject-modal__description">
              El usuario verá el motivo del rechazo y podrá volver a subir sus documentos.
            </p>
          </div>
        </header>

        <div className="intl-reject-modal__body">
          <div className="intl-reject-modal__field">
            <label htmlFor="intl-reject-reason" className="intl-reject-modal__label">
              Motivo
              <span className="intl-reject-modal__label-optional">(opcional)</span>
            </label>
            <textarea
              id="intl-reject-reason"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              rows={4}
              className="intl-reject-modal__textarea"
              placeholder="Describe el motivo del rechazo..."
              disabled={isPending}
            />
          </div>
        </div>

        <footer className="intl-reject-modal__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="intl-reject-modal__btn intl-reject-modal__btn--cancel"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="intl-reject-modal__btn intl-reject-modal__btn--confirm"
          >
            {isPending ? (
              <>
                <span className="intl-reject-modal__spinner" aria-hidden="true" />
                Rechazando...
              </>
            ) : (
              'Rechazar documento'
            )}
          </button>
        </footer>
      </div>
    </Modal>
  );
}
