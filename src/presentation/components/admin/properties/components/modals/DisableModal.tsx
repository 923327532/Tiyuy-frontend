'use client';

import { useState } from 'react';
import { AlertTriangle, Ban } from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import '@/presentation/components/admin/users/components/delete-user/styles/DeleteUserModal.css';

interface DisableModalProps {
  property: PropertyModerationItem;
  isPending: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function DisableModal({ property, isPending, onConfirm, onCancel }: DisableModalProps) {
  const [reason, setReason] = useState('');
  const canSubmit = reason.trim().length > 0 && !isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (canSubmit) onConfirm(reason);
  };

  return (
    <form onSubmit={handleSubmit} className="delete-user-modal__surface">
      <header className="delete-user-modal__header">
        <div className="delete-user-modal__icon">
          <Ban className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="delete-user-modal__header-content">
          <h3 className="delete-user-modal__title">¿Deshabilitar propiedad?</h3>
          <p className="delete-user-modal__description">
            La publicación <strong>{property.title}</strong> dejará de estar visible.
            Podrá reactivarse tras revisión administrativa.
          </p>
        </div>
      </header>

      <div className="delete-user-modal__warning">
        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
        <span>El propietario será notificado automáticamente.</span>
      </div>

      <div className="delete-user-modal__body">
        <div className="delete-user-modal__field">
          <label className="delete-user-modal__label" htmlFor="disable-reason">
            Motivo para deshabilitar <span className="delete-user-modal__label-optional">(requerido)</span>
          </label>
          <textarea
            id="disable-reason"
            className="delete-user-modal__textarea"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Ej.: La propiedad incumple las políticas de publicación..."
            disabled={isPending}
            required
          />
        </div>
      </div>

      <footer className="delete-user-modal__actions">
        <button
          type="button"
          className="delete-user-modal__btn delete-user-modal__btn--cancel"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="delete-user-modal__btn delete-user-modal__btn--confirm"
          disabled={!canSubmit}
        >
          {isPending ? (
            <>
              <span className="delete-user-modal__spinner" aria-hidden="true" />
              Deshabilitando...
            </>
          ) : (
            'Deshabilitar'
          )}
        </button>
      </footer>
    </form>
  );
}
