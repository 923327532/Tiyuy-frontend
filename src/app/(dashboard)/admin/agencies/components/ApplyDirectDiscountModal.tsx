'use client';

import { BadgePercent, X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { DeveloperDiscountTarget } from '@/core/domain/entities/Admin';
import { SECONDARY_BUTTON } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import {
  CHECKBOX,
  FIELD_INPUT,
  FIELD_LABEL,
  FIELD_TEXTAREA,
  PANEL,
  PRIMARY_BUTTON,
} from './agencyModalStyles';

interface DirectDiscount {
  discountPercentage: string;
  reason: string;
  notifyAgency: boolean;
  applyToAllAgents: boolean;
  maxAgents: string;
  expiresAt: string;
}

interface ApplyDirectDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgency: DeveloperDiscountTarget | null;
  directDiscount: DirectDiscount;
  setDirectDiscount: (discount: DirectDiscount) => void;
  onApply: () => void;
  isPending: boolean;
}

export default function ApplyDirectDiscountModal({
  isOpen,
  onClose,
  selectedAgency,
  directDiscount,
  setDirectDiscount,
  onApply,
  isPending,
}: ApplyDirectDiscountModalProps) {
  const canApply = Boolean(directDiscount.discountPercentage.trim()) && Boolean(directDiscount.reason.trim());

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            <BadgePercent className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title="Aplicar Descuento Directo">
              Aplicar Descuento Directo
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
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800 ring-1 ring-inset ring-amber-600/20">
              <span aria-hidden="true">⚠️</span>
              <span>
                Este descuento se aplicará directamente al plan actual de la inmobiliaria. Será
                inmediato y afectará el próximo cobro.
              </span>
            </div>

            <section className={PANEL}>
              <label htmlFor="direct-percentage" className={FIELD_LABEL}>
                Porcentaje de Descuento (%)
              </label>
              <div className="relative">
                <input
                  id="direct-percentage"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={directDiscount.discountPercentage}
                  onChange={(event) =>
                    setDirectDiscount({ ...directDiscount, discountPercentage: event.target.value })
                  }
                  placeholder="Ej: 15"
                  className={`${FIELD_INPUT} pr-10`}
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-sm font-semibold text-slate-400">
                  %
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Plan actual:{' '}
                <span className="font-semibold text-slate-700">
                  {selectedAgency?.currentPlan || 'Sin plan'}
                </span>
                <br />
                Ingresos últimos 30 días:{' '}
                <span className="font-semibold text-slate-700">
                  S/ {selectedAgency?.revenue30Days?.toLocaleString() || '0'}
                </span>
              </p>
            </section>

            <section className={PANEL}>
              <label htmlFor="direct-reason" className={FIELD_LABEL}>
                Motivo del Descuento
              </label>
              <textarea
                id="direct-reason"
                value={directDiscount.reason}
                onChange={(event) =>
                  setDirectDiscount({ ...directDiscount, reason: event.target.value })
                }
                placeholder="Ej: Descuento por fidelidad, compensación por servicio..."
                rows={3}
                className={FIELD_TEXTAREA}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Este motivo quedará registrado en el historial de la inmobiliaria.
              </p>
            </section>

            <section className={PANEL}>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={directDiscount.notifyAgency}
                  onChange={(event) =>
                    setDirectDiscount({ ...directDiscount, notifyAgency: event.target.checked })
                  }
                  className={CHECKBOX}
                />
                Notificar a la inmobiliaria por email
              </label>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <label htmlFor="apply-all" className="flex items-start gap-2.5">
                  <input
                    id="apply-all"
                    type="checkbox"
                    checked={directDiscount.applyToAllAgents}
                    onChange={(event) =>
                      setDirectDiscount({ ...directDiscount, applyToAllAgents: event.target.checked })
                    }
                    className={`${CHECKBOX} mt-0.5`}
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-700">
                      Aplicar descuento a todos los agentes de esta inmobiliaria
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      El descuento se asignará automáticamente a cada agente activo.
                    </span>
                  </span>
                </label>

                {directDiscount.applyToAllAgents && (
                  <div className="mt-4 grid grid-cols-1 gap-4 pl-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="max-agents" className={FIELD_LABEL}>
                        Cantidad máxima de agentes
                      </label>
                      <input
                        id="max-agents"
                        type="number"
                        min="1"
                        value={directDiscount.maxAgents}
                        onChange={(event) =>
                          setDirectDiscount({ ...directDiscount, maxAgents: event.target.value })
                        }
                        placeholder="Ej: 15 (vacío = todos)"
                        className={FIELD_INPUT}
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        Máximo de agentes que pueden acceder al descuento.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="discount-expiry" className={FIELD_LABEL}>
                        Fecha de expiración
                      </label>
                      <input
                        id="discount-expiry"
                        type="datetime-local"
                        value={directDiscount.expiresAt}
                        onChange={(event) =>
                          setDirectDiscount({ ...directDiscount, expiresAt: event.target.value })
                        }
                        className={FIELD_INPUT}
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        Después de esta fecha, el descuento no podrá ser usado.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <footer className="user-detail-modal__footer">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={isPending || !canApply}
            className={PRIMARY_BUTTON}
          >
            {isPending ? 'Aplicando...' : 'Aplicar Descuento'}
          </button>
        </footer>
      </div>
    </Modal>
  );
}
