'use client';

import { Tag, X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { DeveloperDiscountTarget } from '@/core/domain/entities/Admin';
import { SECONDARY_BUTTON } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import {
  FIELD_INPUT,
  FIELD_LABEL,
  PANEL,
  PRIMARY_BUTTON,
} from './agencyModalStyles';

interface NewDiscount {
  code: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

interface CreateAgencyDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgency: DeveloperDiscountTarget | null;
  newDiscount: NewDiscount;
  setNewDiscount: (discount: NewDiscount) => void;
  onCreate: () => void;
  isPending: boolean;
}

export default function CreateAgencyDiscountModal({
  isOpen,
  onClose,
  selectedAgency,
  newDiscount,
  setNewDiscount,
  onCreate,
  isPending,
}: CreateAgencyDiscountModalProps) {
  const canCreate = Boolean(newDiscount.code.trim()) && Boolean(newDiscount.discountPercentage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            <Tag className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title="Crear Código de Descuento">
              Crear Código de Descuento
            </h3>
            <p className="user-detail-modal__email" title={`Para: ${selectedAgency?.name ?? '—'}`}>
              Para: {selectedAgency?.name ?? '—'} (RUC: {selectedAgency?.ruc ?? '—'})
            </p>
            <div className="user-detail-modal__badges">
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">
                Descuento
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="user-detail-modal__close-btn"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="user-detail-modal__content">
          <div className="space-y-4">
            <section className={PANEL}>
              <label htmlFor="discount-code" className={FIELD_LABEL}>
                Código de Descuento
              </label>
              <input
                id="discount-code"
                type="text"
                value={newDiscount.code}
                onChange={(event) =>
                  setNewDiscount({ ...newDiscount, code: event.target.value.toUpperCase() })
                }
                placeholder="Ej: INMO20OFF"
                className={`${FIELD_INPUT} font-mono`}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Este código será único para esta inmobiliaria.
              </p>
            </section>

            <section className={PANEL}>
              <label htmlFor="discount-percentage" className={FIELD_LABEL}>
                Porcentaje de Descuento (%)
              </label>
              <div className="relative">
                <input
                  id="discount-percentage"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={newDiscount.discountPercentage}
                  onChange={(event) =>
                    setNewDiscount({ ...newDiscount, discountPercentage: event.target.value })
                  }
                  placeholder="Ej: 20"
                  className={`${FIELD_INPUT} pr-10`}
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-sm font-semibold text-slate-400">
                  %
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Si el plan cuesta S/100, con 20% de descuento costará S/80.
              </p>
            </section>

            <section className={PANEL}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="discount-start" className={FIELD_LABEL}>
                    Fecha Inicio
                  </label>
                  <input
                    id="discount-start"
                    type="date"
                    value={newDiscount.startDate}
                    onChange={(event) =>
                      setNewDiscount({ ...newDiscount, startDate: event.target.value })
                    }
                    className={FIELD_INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="discount-end" className={FIELD_LABEL}>
                    Fecha Fin
                  </label>
                  <input
                    id="discount-end"
                    type="date"
                    value={newDiscount.endDate}
                    onChange={(event) =>
                      setNewDiscount({ ...newDiscount, endDate: event.target.value })
                    }
                    className={FIELD_INPUT}
                  />
                </div>
              </div>
            </section>

            <section className={PANEL}>
              <label htmlFor="discount-limit" className={FIELD_LABEL}>
                Límite de Usos (opcional)
              </label>
              <input
                id="discount-limit"
                type="number"
                min="1"
                value={newDiscount.usageLimit}
                onChange={(event) =>
                  setNewDiscount({ ...newDiscount, usageLimit: event.target.value })
                }
                placeholder="Dejar vacío para ilimitado"
                className={FIELD_INPUT}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Cuántas veces puede usar este código la inmobiliaria.
              </p>
            </section>
          </div>
        </div>

        <footer className="user-detail-modal__footer">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={isPending || !canCreate}
            className={PRIMARY_BUTTON}
          >
            {isPending ? 'Creando...' : 'Crear Descuento'}
          </button>
        </footer>
      </div>
    </Modal>
  );
}
