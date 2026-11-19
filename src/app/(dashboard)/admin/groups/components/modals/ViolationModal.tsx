'use client';

import { AlertTriangle } from 'lucide-react';

import { Modal } from '@/presentation/components/ui/Modal';
import type { Group, Channel } from '../../types';
import '@/presentation/components/admin/users/components/delete-user/styles/DeleteUserModal.css';

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Group | Channel | null;
  violationType: string;
  setViolationType: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

const VIOLATION_TYPES = [
  { value: 'CONTENT_VIOLATION', label: 'Contenido Inapropiado' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'HARASSMENT', label: 'Acoso' },
  { value: 'HATE_SPEECH', label: 'Discurso de Odio' },
  { value: 'COPYRIGHT', label: 'Violación de Copyright' },
  { value: 'OTHER', label: 'Otro' },
];

export function ViolationModal({
  isOpen,
  onClose,
  item,
  violationType,
  setViolationType,
  message,
  setMessage,
  onConfirm,
  isPending,
}: ViolationModalProps) {
  if (!item) return null;

  const isChannel = 'city' in item;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
        className="delete-user-modal__surface"
      >
        <header className="delete-user-modal__header">
          <div className="delete-user-modal__icon">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="delete-user-modal__header-content">
            <h3 className="delete-user-modal__title">
              Notificación de violación
            </h3>
            <p className="delete-user-modal__description" title={item.name}>
              {item.name} · {isChannel ? 'Canal' : 'Grupo'}
            </p>
          </div>
        </header>

        <div className="delete-user-modal__warning">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          <span>El administrador será notificado sobre esta violación.</span>
        </div>

        <div className="delete-user-modal__body">
          <div className="delete-user-modal__field">
            <label className="delete-user-modal__label" htmlFor="violation-type">
              Tipo de violación
            </label>
            <select
              id="violation-type"
              className="delete-user-modal__select"
              value={violationType}
              onChange={(event) => setViolationType(event.target.value)}
              disabled={isPending}
            >
              {VIOLATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="delete-user-modal__field">
            <label className="delete-user-modal__label" htmlFor="violation-message">
              Mensaje para el administrador <span className="delete-user-modal__label-optional">(requerido)</span>
            </label>
            <textarea
              id="violation-message"
              className="delete-user-modal__textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder={`Detalla la violación de políticas de este ${isChannel ? 'canal' : 'grupo'}...`}
              disabled={isPending}
              required
            />
          </div>
        </div>

        <footer className="delete-user-modal__actions">
          <button
            type="button"
            className="delete-user-modal__btn delete-user-modal__btn--cancel"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="delete-user-modal__btn delete-user-modal__btn--confirm"
            disabled={!message.trim() || isPending}
          >
            {isPending ? (
              <>
                <span className="delete-user-modal__spinner" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              'Enviar notificación'
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
