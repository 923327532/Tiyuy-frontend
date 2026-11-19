'use client';

import { Check, X } from 'lucide-react';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';

interface Props {
  user: InternationalUserListItem;
  canReview?: boolean;
  onViewDetail: (user: InternationalUserListItem) => void;
  onApprove?: (user: InternationalUserListItem) => void;
  onReject?: (user: InternationalUserListItem) => void;
}

export function InternationalCardActions({ user, canReview, onViewDetail, onApprove, onReject }: Props) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  const canApprove = canReview && user.verificationStatus !== 'VERIFIED' && Boolean(onApprove);
  const canReject = canReview && user.verificationStatus !== 'REJECTED' && Boolean(onReject);

  return (
    <div className="intc-card__actions">
      <button
        type="button"
        className="intc-card__btn intc-card__btn--primary"
        onClick={() => onViewDetail(user)}
      >
        Ver detalle
      </button>

      {(canApprove || canReject) && (
        <div className="intc-card__actions-group">
          {canApprove && (
            <button
              type="button"
              className="intc-card__icon-btn intc-card__icon-btn--approve"
              aria-label={`Aprobar a ${fullName}`}
              title="Aprobar"
              onClick={() => onApprove?.(user)}
            >
              <Check className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {canReject && (
            <button
              type="button"
              className="intc-card__icon-btn intc-card__icon-btn--reject"
              aria-label={`Rechazar a ${fullName}`}
              title="Rechazar"
              onClick={() => onReject?.(user)}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
