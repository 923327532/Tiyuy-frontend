'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import {
  getNotificationTemplates,
  type NotificationTemplate,
} from '../../utils/notificationTemplates';
import '@/presentation/components/admin/users/components/role-change/styles/RoleChangeModal.css';

interface NotifyModalProps {
  property: PropertyModerationItem;
  isOpen?: boolean;
  isPending: boolean;
  onSend: (subject: string, message: string, includeDetails: boolean) => void;
  onCancel: () => void;
}

export function NotifyModal({
  property,
  isOpen = true,
  isPending,
  onSend,
  onCancel,
}: NotifyModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);
  const templates: NotificationTemplate[] = getNotificationTemplates(property);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    onSend(subject, message, includeDetails);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="role-change-modal__surface">
        <header className="role-change-modal__header">
          <div className="role-change-modal__header-icon">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="role-change-modal__header-content">
            <h3 className="role-change-modal__title">Notificar propietario</h3>
            <p className="role-change-modal__subtitle" title={property.ownerEmail}>
              {property.ownerEmail}
            </p>
          </div>
        </header>

        <div className="role-change-modal__body">
          <div className="role-change-modal__field">
            <span className="role-change-modal__label">Plantillas rápidas</span>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => {
                    setSubject(template.subject);
                    setMessage(template.message);
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <div className="role-change-modal__field">
            <label className="role-change-modal__label" htmlFor="notify-subject">
              Asunto <span className="role-change-modal__required">*</span>
            </label>
            <input
              id="notify-subject"
              className="role-change-modal__select"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Asunto del mensaje"
              disabled={isPending}
              required
            />
          </div>

          <div className="role-change-modal__field">
            <label className="role-change-modal__label" htmlFor="notify-message">
              Mensaje <span className="role-change-modal__required">*</span>
            </label>
            <textarea
              id="notify-message"
              className="role-change-modal__textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
              disabled={isPending}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              className="rounded border-slate-300"
              checked={includeDetails}
              onChange={(event) => setIncludeDetails(event.target.checked)}
            />
            Incluir detalles de la propiedad en el correo
          </label>
        </div>

        <footer className="role-change-modal__actions">
          <button
            type="button"
            className="role-change-modal__btn role-change-modal__btn--cancel"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="role-change-modal__btn role-change-modal__btn--confirm"
            disabled={isPending || !subject.trim() || !message.trim()}
          >
            {isPending ? 'Enviando...' : 'Enviar notificación'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
