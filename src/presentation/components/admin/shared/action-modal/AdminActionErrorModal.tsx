'use client';

import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import './action-confirm-modal.css';

export interface AdminActionErrorState {
  isOpen: boolean;
  title: string;
  message: string;
  hint?: string;
}

interface AdminActionErrorModalProps {
  error: AdminActionErrorState | null;
  onClose: () => void;
}

export function extractBackendErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.response?.data?.error ||
    fallback
  );
}

export function AdminActionErrorModal({ error, onClose }: AdminActionErrorModalProps) {
  if (!error) return null;

  return (
    <Modal isOpen={error.isOpen} onClose={onClose}>
      <div className="action-confirm-modal__surface action-confirm-modal__surface--warning">
        <header className="action-confirm-modal__header">
          <div className="action-confirm-modal__icon action-confirm-modal__icon--warning">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="action-confirm-modal__header-content">
            <h3 className="action-confirm-modal__title">{error.title}</h3>
            <div className="action-confirm-modal__description">{error.message}</div>
          </div>
        </header>

        {error.hint && (
          <div className="action-confirm-modal__warning">{error.hint}</div>
        )}

        <footer className="action-confirm-modal__actions">
          <button
            type="button"
            onClick={onClose}
            className="action-confirm-modal__btn action-confirm-modal__btn--confirm action-confirm-modal__btn--warning"
          >
            Entendido
          </button>
        </footer>
      </div>
    </Modal>
  );
}