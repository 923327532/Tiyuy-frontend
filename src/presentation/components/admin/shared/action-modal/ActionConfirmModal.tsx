'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';

import './action-confirm-modal.css';

export type ActionConfirmVariant = 'success' | 'warning' | 'danger';

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void | Promise<void>;
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  variant: ActionConfirmVariant;
  confirmLabel: string;
  pendingLabel?: string;
  isPending?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reason?: string;
  onReasonChange?: (value: string) => void;
  warning?: React.ReactNode;
  requireReason?: boolean;
  resetKey?: string | number;
}

/**
 * Modal de confirmación compartido por Users y Projects.
 * Replica estructural y visualmente los modales de acción del módulo Users:
 * cabecera con icono, motivo opcional/obligatorio, advertencia opcional y
 * botones Cancelar / Confirmar con estado de procesamiento.
 */
export function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  variant,
  confirmLabel,
  pendingLabel = 'Procesando...',
  isPending = false,
  reasonLabel = 'Motivo',
  reasonPlaceholder = 'Indica el motivo...',
  reason,
  onReasonChange,
  warning,
  requireReason = false,
  resetKey,
}: ActionConfirmModalProps) {
  const [internalReason, setInternalReason] = useState('');
  const reasonValue = reason ?? internalReason;
  // Siempre 2 entradas: evita el error de React si `resetKey` no se pasa en algunos módulos.
  const resetValue = resetKey ?? '';

  useEffect(() => {
    if (!isOpen) setInternalReason('');
  }, [isOpen, resetValue]);

  const handleReasonChange = (value: string) => {
    if (onReasonChange) onReasonChange(value);
    else setInternalReason(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (requireReason && !reasonValue.trim()) return;
    await onConfirm(reasonValue);
    onClose();
  };

  const labelSuffix = requireReason ? (
    <span className="action-confirm-modal__label-required">*</span>
  ) : (
    <span className="action-confirm-modal__label-optional">(opcional)</span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className={`action-confirm-modal__surface action-confirm-modal__surface--${variant}`}
      >
        <header className="action-confirm-modal__header">
          <div className={`action-confirm-modal__icon action-confirm-modal__icon--${variant}`}>
            {icon}
          </div>
          <div className="action-confirm-modal__header-content">
            <h3 className="action-confirm-modal__title">{title}</h3>
            <div className="action-confirm-modal__description">{description}</div>
          </div>
        </header>

        {warning && <div className="action-confirm-modal__warning">{warning}</div>}

        <div className="action-confirm-modal__body">
          <div className="action-confirm-modal__field">
            <label htmlFor="action-confirm-reason" className="action-confirm-modal__label">
              {reasonLabel}
              {labelSuffix}
            </label>
            <textarea
              id="action-confirm-reason"
              value={reasonValue}
              onChange={(event) => handleReasonChange(event.target.value)}
              className={`action-confirm-modal__textarea action-confirm-modal__textarea--${variant}`}
              rows={3}
              placeholder={reasonPlaceholder}
              required={requireReason}
              disabled={isPending}
            />
          </div>
        </div>

        <footer className="action-confirm-modal__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="action-confirm-modal__btn action-confirm-modal__btn--cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || (requireReason && !reasonValue.trim())}
            className={`action-confirm-modal__btn action-confirm-modal__btn--confirm action-confirm-modal__btn--${variant}`}
          >
            {isPending ? (
              <>
                <span className="action-confirm-modal__spinner" aria-hidden="true" />
                {pendingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
