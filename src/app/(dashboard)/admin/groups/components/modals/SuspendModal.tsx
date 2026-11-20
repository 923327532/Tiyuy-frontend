'use client';

import { PauseCircle } from 'lucide-react';

import { Modal } from '@/presentation/components/ui/Modal';
import type { Group, Channel } from '../../types';
import '@/presentation/components/admin/users/components/role-change/styles/RoleChangeModal.css';

interface SuspendModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Group | Channel | null;
  reason: string;
  setReason: (value: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function SuspendModal({
  isOpen,
  onClose,
  item,
  reason,
  setReason,
  onConfirm,
  isPending,
}: SuspendModalProps) {
  if (!item) return null;

  const isChannel = 'city' in item;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
        className="role-change-modal__surface"
      >
        <header className="role-change-modal__header">
          <div className="role-change-modal__header-icon">
            <PauseCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="role-change-modal__header-content">
            <h3 className="role-change-modal__title">
              Suspender {isChannel ? 'canal' : 'grupo'}
            </h3>
            <p className="role-change-modal__subtitle" title={item.name}>
              {item.name}
            </p>
          </div>
        </header>

        <div className="role-change-modal__body">
          <p className="text-xs leading-relaxed text-slate-500">
            Esta acción hará que el {isChannel ? 'canal' : 'grupo'} no esté disponible
            para todos los usuarios.
          </p>

          <div className="role-change-modal__field">
            <label className="role-change-modal__label" htmlFor="suspend-reason">
              Razón de la suspensión <span className="role-change-modal__required">*</span>
            </label>
            <textarea
              id="suspend-reason"
              className="role-change-modal__textarea"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder={`Describe por qué se suspende este ${isChannel ? 'canal' : 'grupo'}...`}
              disabled={isPending}
              required
            />
          </div>
        </div>

        <footer className="role-change-modal__actions">
          <button
            type="button"
            className="role-change-modal__btn role-change-modal__btn--cancel"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="role-change-modal__btn role-change-modal__btn--confirm"
            disabled={!reason.trim() || isPending}
          >
            {isPending ? 'Suspendiendo...' : 'Suspender'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
