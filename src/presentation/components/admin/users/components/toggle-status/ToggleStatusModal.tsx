'use client';

import { useEffect, useState } from 'react';
import { UserCheck, UserX } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { ToggleStatusModalProps } from '@/presentation/components/admin/users/types/users.types';

import './styles/ToggleStatusModal.css';

export function ToggleStatusModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ToggleStatusModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen, user?.id]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(reason);
  };

  const isSuspendAction = user.enabled;
  const actionVariant = isSuspendAction ? 'suspend' : 'reactivate';
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className={`toggle-status-modal__surface toggle-status-modal__surface--${actionVariant}`}
      >
        <header className="toggle-status-modal__header">
          <div className={`toggle-status-modal__icon toggle-status-modal__icon--${actionVariant}`}>
            {isSuspendAction ? (
              <UserX className="w-5 h-5" aria-hidden="true" />
            ) : (
              <UserCheck className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          <div className="toggle-status-modal__header-content">
            <h3 className="toggle-status-modal__title">
              {isSuspendAction ? '¿Suspender usuario?' : '¿Reactivar usuario?'}
            </h3>
            <p className="toggle-status-modal__description">
              {isSuspendAction
                ? `¿Estás seguro de que deseas deshabilitar temporalmente al usuario ${fullName} (${user.email})?`
                : `¿Estás seguro de que deseas habilitar nuevamente al usuario ${fullName} (${user.email})?`}
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
              onChange={(e) => setReason(e.target.value)}
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
            ) : isSuspendAction ? (
              'Suspender usuario'
            ) : (
              'Reactivar usuario'
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
