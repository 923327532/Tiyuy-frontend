'use client';

import { Bell, X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
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

interface NotificationData {
  subject: string;
  message: string;
  sendEmail: boolean;
  sendInApp: boolean;
}

interface NotifyAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgency: InmobiliariaWithStats | null;
  notificationData: NotificationData;
  setNotificationData: (data: NotificationData) => void;
  onSend: () => void;
  isPending: boolean;
}

export default function NotifyAgencyModal({
  isOpen,
  onClose,
  selectedAgency,
  notificationData,
  setNotificationData,
  onSend,
  isPending,
}: NotifyAgencyModalProps) {
  const canSend =
    Boolean(notificationData.subject.trim()) &&
    Boolean(notificationData.message.trim()) &&
    (notificationData.sendEmail || notificationData.sendInApp);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title="Notificar Inmobiliaria">
              Notificar Inmobiliaria
            </h3>
            <p className="user-detail-modal__email" title={`Para: ${selectedAgency?.name ?? '—'}`}>
              Para: {selectedAgency?.name ?? '—'} (RUC: {selectedAgency?.ruc ?? '—'})
            </p>
            <div className="user-detail-modal__badges">
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">
                Notificación
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
              <label htmlFor="notify-subject" className={FIELD_LABEL}>
                Asunto
              </label>
              <input
                id="notify-subject"
                type="text"
                value={notificationData.subject}
                onChange={(event) =>
                  setNotificationData({ ...notificationData, subject: event.target.value })
                }
                placeholder="Ej: Actualización de plan, Recordatorio de pago..."
                className={FIELD_INPUT}
              />
            </section>

            <section className={PANEL}>
              <label htmlFor="notify-message" className={FIELD_LABEL}>
                Mensaje
              </label>
              <textarea
                id="notify-message"
                value={notificationData.message}
                onChange={(event) =>
                  setNotificationData({ ...notificationData, message: event.target.value })
                }
                placeholder="Escribe el mensaje que deseas enviar a la inmobiliaria..."
                rows={5}
                className={FIELD_TEXTAREA}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Este mensaje será enviado a los administradores de la inmobiliaria.
              </p>
            </section>

            <section className={PANEL}>
              <p className="mb-3 text-xs font-semibold text-slate-700">Canales de envío</p>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={notificationData.sendEmail}
                    onChange={(event) =>
                      setNotificationData({ ...notificationData, sendEmail: event.target.checked })
                    }
                    className={CHECKBOX}
                  />
                  Enviar por email
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={notificationData.sendInApp}
                    onChange={(event) =>
                      setNotificationData({ ...notificationData, sendInApp: event.target.checked })
                    }
                    className={CHECKBOX}
                  />
                  Enviar notificación en la aplicación
                </label>
              </div>
            </section>

            <section className={PANEL}>
              <p className="mb-2 text-xs font-semibold text-slate-700">
                Información de la inmobiliaria
              </p>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Plan actual</dt>
                  <dd className="font-medium text-slate-900">
                    {selectedAgency?.currentPlan || 'Sin plan'}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Agentes activos</dt>
                  <dd className="font-medium text-slate-900">{selectedAgency?.activeAgents || 0}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:col-span-2">
                  <dt className="text-slate-500">Última actividad</dt>
                  <dd className="font-medium text-slate-900">
                    {selectedAgency?.lastActivity
                      ? new Date(selectedAgency.lastActivity).toLocaleDateString('es-PE')
                      : 'Sin actividad registrada'}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <footer className="user-detail-modal__footer">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancelar
          </button>
          <button type="button" onClick={onSend} disabled={isPending || !canSend} className={PRIMARY_BUTTON}>
            {isPending ? 'Enviando...' : 'Enviar Notificación'}
          </button>
        </footer>
      </div>
    </Modal>
  );
}
