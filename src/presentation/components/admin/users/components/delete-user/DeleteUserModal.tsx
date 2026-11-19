'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { DeleteUserModalProps } from '@/presentation/components/admin/users/types/users.types';

import './styles/DeleteUserModal.css';

export function DeleteUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteUserModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen, user?.id]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(reason);
  };

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="delete-user-modal__surface">
        <header className="delete-user-modal__header">
          <div className="delete-user-modal__icon">
            <Trash2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="delete-user-modal__header-content">
            <h3 className="delete-user-modal__title">¿Eliminar usuario?</h3>
            <p className="delete-user-modal__description">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{fullName}</strong> (
              {user.email})? Esta acción no se puede deshacer.
            </p>
          </div>
        </header>

        <div className="delete-user-modal__warning">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          <span>Esta acción eliminará permanentemente todos los datos del usuario</span>
        </div>

        <div className="delete-user-modal__body">
          <div className="delete-user-modal__field">
            <label htmlFor="delete-user-reason" className="delete-user-modal__label">
              Motivo
              <span className="delete-user-modal__label-optional">(opcional)</span>
            </label>
            <textarea
              id="delete-user-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="delete-user-modal__textarea"
              rows={3}
              placeholder="Indica el motivo de la eliminación..."
              disabled={isPending}
            />
          </div>
        </div>

        <footer className="delete-user-modal__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="delete-user-modal__btn delete-user-modal__btn--cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="delete-user-modal__btn delete-user-modal__btn--confirm"
          >
            {isPending ? (
              <>
                <span className="delete-user-modal__spinner" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              'Eliminar usuario'
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
