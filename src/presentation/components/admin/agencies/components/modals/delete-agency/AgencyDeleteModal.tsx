'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import './styles/AgencyDeleteModal.css';

interface Props {
  agency: InmobiliariaWithStats | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isPending?: boolean;
}

export function AgencyDeleteModal({ agency, isOpen, onClose, onConfirm, isPending }: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen, agency?.id]);

  if (!agency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="agency-delete-modal__surface">
        <header className="agency-delete-modal__header">
          <div className="agency-delete-modal__icon">
            <Trash2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="agency-delete-modal__header-content">
            <h3 className="agency-delete-modal__title">Eliminar inmobiliaria</h3>
            <p className="agency-delete-modal__description">
              ¿Estás seguro de que quieres eliminar <strong>{agency.name}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
        </header>

        <div className="agency-delete-modal__warning">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          <span>Esta acción eliminará permanentemente la inmobiliaria, todos sus proyectos, agentes asociados, descuentos y el historial de actividad. Los agentes quedarán sin inmobiliaria.</span>
        </div>

        <div className="agency-delete-modal__body">
          <div className="agency-delete-modal__field">
            <label htmlFor="delete-agency-reason" className="agency-delete-modal__label">
              Motivo
              <span className="agency-delete-modal__label-optional">(opcional)</span>
            </label>
            <textarea
              id="delete-agency-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="agency-delete-modal__textarea"
              rows={3}
              placeholder="Indica el motivo de la eliminación..."
              disabled={isPending}
            />
          </div>
        </div>

        <footer className="agency-delete-modal__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="agency-delete-modal__btn agency-delete-modal__btn--cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="agency-delete-modal__btn agency-delete-modal__btn--confirm"
          >
            {isPending ? (
              <>
                <span className="agency-delete-modal__spinner" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              'Eliminar permanentemente'
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}