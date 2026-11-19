'use client';

import { Home } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { UserPropertiesModalProps } from '@/presentation/components/admin/users/types/users.types';
import { PropertyItem } from './components/PropertyItem';

import './styles/UserPropertiesModal.css';

export function UserPropertiesModal({
  data,
  isLoading,
  isOpen,
  onClose,
}: UserPropertiesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="user-properties-modal__surface">
        <header className="user-properties-modal__header">
          <div className="user-properties-modal__header-icon">
            <Home className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="user-properties-modal__header-content">
            <h3 className="user-properties-modal__title">Propiedades del usuario</h3>
            {data && (
              <p className="user-properties-modal__subtitle">
                <span className="user-properties-modal__total">{data.totalProperties}</span>{' '}
                propiedades registradas
              </p>
            )}
          </div>
        </header>

        <div className="user-properties-modal__content">
          {isLoading ? (
            <div className="user-properties-modal__loading">
              <div className="user-properties-modal__spinner" aria-hidden="true" />
              <span>Cargando propiedades...</span>
            </div>
          ) : data ? (
            data.properties.length === 0 ? (
              <div className="user-properties-modal__empty">
                <div className="user-properties-modal__empty-icon">
                  <Home className="w-8 h-8" aria-hidden="true" />
                </div>
                <p className="user-properties-modal__empty-text">
                  El usuario no tiene propiedades publicadas
                </p>
              </div>
            ) : (
              <div className="user-properties-modal__list">
                {data.properties.map((item, index) => (
                  <PropertyItem
                    key={item.id ?? index}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="user-properties-modal__empty">
              <div className="user-properties-modal__empty-icon">
                <Home className="w-8 h-8" aria-hidden="true" />
              </div>
              <p className="user-properties-modal__empty-text">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
