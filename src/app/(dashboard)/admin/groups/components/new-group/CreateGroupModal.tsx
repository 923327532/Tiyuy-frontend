'use client';

import { ArrowLeft } from 'lucide-react';

import { Modal } from '@/presentation/components/ui/Modal';

import { NewGroupForm } from './NewGroupForm';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="ngp-page">
        <header className="ngp-header">
          <button
            type="button"
            onClick={onClose}
            className="ngp-header__back-btn"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="ngp-header__info">
            <h1 className="ngp-header__title">Crear Nuevo Grupo</h1>
            <p className="ngp-header__subtitle">
              Completa la información para crear un nuevo grupo social
            </p>
          </div>
        </header>

        <div className="ngp-card">
          <NewGroupForm onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
}

export default CreateGroupModal;
