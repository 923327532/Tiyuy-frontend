'use client';

import { useState } from 'react';
import { CheckCircle2, PauseCircle, ShieldCheck, XCircle } from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import type { ModerationAction } from '../../types/properties.types';
import '@/presentation/components/admin/users/components/role-change/styles/RoleChangeModal.css';

interface ModerationModalProps {
  property: PropertyModerationItem;
  action: ModerationAction;
  isPending: boolean;
  onConfirm: (action: ModerationAction, reason?: string, notifyOwner?: boolean) => void;
  onCancel: () => void;
}

const ACTION_CONFIG: Record<
  ModerationAction,
  { label: string; confirm: string; icon: typeof CheckCircle2 }
> = {
  APPROVE: { label: 'Aprobar y publicar', confirm: 'Aprobar', icon: CheckCircle2 },
  REJECT: { label: 'Rechazar publicación', confirm: 'Rechazar', icon: XCircle },
  SUSPEND: { label: 'Suspender temporalmente', confirm: 'Suspender', icon: PauseCircle },
};

export function ModerationModal({
  property,
  action,
  isPending,
  onConfirm,
  onCancel,
}: ModerationModalProps) {
  const [selectedAction, setSelectedAction] = useState<ModerationAction>(action);
  const [reason, setReason] = useState('');
  const [notifyOwner, setNotifyOwner] = useState(true);

  const needsReason = selectedAction !== 'APPROVE';
  const config = ACTION_CONFIG[selectedAction];
  const Icon = config.icon;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (needsReason && !reason.trim()) return;
    onConfirm(selectedAction, reason, notifyOwner);
  };

  return (
    <form onSubmit={handleSubmit} className="role-change-modal__surface">
      <header className="role-change-modal__header">
        <div className="role-change-modal__header-icon">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="role-change-modal__header-content">
          <h3 className="role-change-modal__title">Moderar propiedad</h3>
          <p className="role-change-modal__subtitle" title={property.title}>
            {property.title}
          </p>
        </div>
      </header>

      <div className="role-change-modal__body">
        <div className="role-change-modal__field">
          <label className="role-change-modal__label" htmlFor="moderation-action">
            Acción
          </label>
          <select
            id="moderation-action"
            className="role-change-modal__select"
            value={selectedAction}
            onChange={(event) => setSelectedAction(event.target.value as ModerationAction)}
          >
            {Object.entries(ACTION_CONFIG).map(([value, item]) => (
              <option key={value} value={value}>{item.label}</option>
            ))}
          </select>
        </div>

        {needsReason && (
          <div className="role-change-modal__field">
            <label className="role-change-modal__label" htmlFor="moderation-reason">
              Motivo <span className="role-change-modal__required">*</span>
            </label>
            <textarea
              id="moderation-reason"
              className="role-change-modal__textarea"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="Indica el motivo de la moderación..."
              disabled={isPending}
              required
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-teal-700" aria-hidden="true" />
          <input
            type="checkbox"
            className="rounded border-slate-300"
            checked={notifyOwner}
            onChange={(event) => setNotifyOwner(event.target.checked)}
          />
          Notificar al propietario sobre el cambio de estado
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
          disabled={isPending || (needsReason && !reason.trim())}
        >
          {isPending ? 'Procesando...' : config.confirm}
        </button>
      </footer>
    </form>
  );
}
