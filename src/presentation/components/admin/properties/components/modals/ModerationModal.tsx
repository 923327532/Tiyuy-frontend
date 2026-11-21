'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, PauseCircle, ShieldCheck, XCircle } from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import type { ModerationAction } from '../../types/properties.types';
import '@/presentation/components/admin/users/components/toggle-status/styles/ToggleStatusModal.css';
import './ModerationModal.css';

interface ModerationModalProps {
  property: PropertyModerationItem;
  action: ModerationAction;
  isOpen?: boolean;
  isPending: boolean;
  onConfirm: (action: ModerationAction, reason?: string, notifyOwner?: boolean) => void;
  onCancel: () => void;
}

const ACTION_CONFIG: Record<
  ModerationAction,
  {
    title: string;
    label: string;
    confirm: string;
    variant: 'reactivate' | 'suspend' | 'reject';
    icon: typeof CheckCircle2;
    helper: string;
  }
> = {
  APPROVE: {
    title: '¿Aprobar propiedad?',
    label: 'Aprobar y publicar',
    confirm: 'Aprobar propiedad',
    variant: 'reactivate',
    icon: CheckCircle2,
    helper: 'La publicación quedará visible públicamente en el portal.',
  },
  SUSPEND: {
    title: '¿Suspender propiedad?',
    label: 'Suspender temporalmente',
    confirm: 'Suspender propiedad',
    variant: 'suspend',
    icon: PauseCircle,
    helper: 'La publicación dejará de mostrarse temporalmente hasta su revisión.',
  },
  REJECT: {
    title: '¿Rechazar propiedad?',
    label: 'Rechazar publicación',
    confirm: 'Rechazar propiedad',
    variant: 'reject',
    icon: XCircle,
    helper: 'La publicación será rechazada y se notificará el motivo al propietario.',
  },
};

export function ModerationModal({
  property,
  action,
  isOpen = true,
  isPending,
  onConfirm,
  onCancel,
}: ModerationModalProps) {
  const [selectedAction, setSelectedAction] = useState<ModerationAction>(action);
  const [reason, setReason] = useState('');
  const [notifyOwner, setNotifyOwner] = useState(true);

  useEffect(() => {
    setSelectedAction(action);
    setReason('');
    setNotifyOwner(true);
  }, [action, property.id]);

  const needsReason = selectedAction !== 'APPROVE';
  const config = ACTION_CONFIG[selectedAction];
  const Icon = config.icon;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (needsReason && !reason.trim()) return;
    onConfirm(selectedAction, reason, notifyOwner);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <form
        onSubmit={handleSubmit}
        className={`toggle-status-modal__surface toggle-status-modal__surface--${config.variant}`}
      >
        <header className="toggle-status-modal__header">
          <div className={`toggle-status-modal__icon toggle-status-modal__icon--${config.variant}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="toggle-status-modal__header-content">
            <h3 className="toggle-status-modal__title">{config.title}</h3>
            <p className="toggle-status-modal__description">
              <strong className="font-semibold text-slate-800">{property.title}</strong>
              {' · '}
              {property.district || 'Sin distrito'} (#{property.id}). {config.helper}
            </p>
          </div>
        </header>

        <div className="toggle-status-modal__body">
          <div className="moderation-modal__fields">
            <div className="toggle-status-modal__field">
              <label className="toggle-status-modal__label" htmlFor="moderation-action">
                Acción de moderación
              </label>
              <select
                id="moderation-action"
                className="moderation-modal__select"
                value={selectedAction}
                disabled={isPending}
                onChange={(event) => setSelectedAction(event.target.value as ModerationAction)}
              >
                {Object.entries(ACTION_CONFIG).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {needsReason && (
              <div className="toggle-status-modal__field">
                <label className="toggle-status-modal__label" htmlFor="moderation-reason">
                  Motivo
                  <span className="toggle-status-modal__label-optional">(requerido)</span>
                </label>
                <textarea
                  id="moderation-reason"
                  className={`toggle-status-modal__textarea toggle-status-modal__textarea--${config.variant}`}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                  placeholder="Indica el motivo de la moderación..."
                  disabled={isPending}
                  required
                />
              </div>
            )}

            <label className="moderation-modal__checkbox-card">
              <input
                type="checkbox"
                className="moderation-modal__checkbox"
                checked={notifyOwner}
                disabled={isPending}
                onChange={(event) => setNotifyOwner(event.target.checked)}
              />
              <ShieldCheck className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
              <span>Notificar al propietario sobre el cambio de estado</span>
            </label>
          </div>
        </div>

        <footer className="toggle-status-modal__actions">
          <button
            type="button"
            className="toggle-status-modal__btn toggle-status-modal__btn--cancel"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`toggle-status-modal__btn toggle-status-modal__btn--confirm toggle-status-modal__btn--${config.variant}`}
            disabled={isPending || (needsReason && !reason.trim())}
          >
            {isPending ? (
              <>
                <span className="toggle-status-modal__spinner" aria-hidden="true" />
                Procesando...
              </>
            ) : (
              config.confirm
            )}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
