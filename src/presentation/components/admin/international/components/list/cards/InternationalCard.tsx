'use client';

import { CalendarDays, FileText, Globe2, Hash, Mail, Phone } from 'lucide-react';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';
import { DOC_TYPE_LABELS } from '../../../config/international.constants';
import { StatusBadge } from '../StatusBadge';
import { InternationalCardActions } from './InternationalCardActions';
import { formatDate, getFullName, getInitials } from './InternationalCardConfig';

import './styles/InternationalCard.css';

interface Props {
  user: InternationalUserListItem;
  canReview?: boolean;
  onViewDetail: (user: InternationalUserListItem) => void;
  onApprove?: (user: InternationalUserListItem) => void;
  onReject?: (user: InternationalUserListItem) => void;
}

export function InternationalCard({ user, canReview, onViewDetail, onApprove, onReject }: Props) {
  const fullName = getFullName(user);
  const docType = DOC_TYPE_LABELS[user.internationalDocumentType] || user.internationalDocumentType || '—';

  return (
    <article className="intc-card">
      
      {/* Header: Avatar + Identity + Status */}
      <header className="intc-card__header">
        <div className="intc-card__identity">
          <div className="intc-card__avatar">
            <span className="intc-card__avatar-text">{getInitials(user)}</span>
          </div>
          <div className="intc-card__identity-info">
            <h3 className="intc-card__name" title={fullName}>{fullName}</h3>
            <p className="intc-card__email" title={user.email}>{user.email || '—'}</p>
          </div>
        </div>
        <div className="intc-card__status">
          <StatusBadge status={user.verificationStatus} />
        </div>
      </header>

      {/* Body: Data list */}
      <div className="intc-card__body">
        <dl className="intc-card__data-list">
          
          <div className="intc-card__data-item">
            <Globe2 className="intc-card__data-icon" aria-hidden="true" />
            <dt className="sr-only">País emisor</dt>
            <dd className="intc-card__data-value" title={user.issuingCountry || '—'}>
              {user.issuingCountry || '—'}
            </dd>
          </div>

          <div className="intc-card__data-item">
            <FileText className="intc-card__data-icon" aria-hidden="true" />
            <dt className="sr-only">Tipo de documento</dt>
            <dd className="intc-card__data-value" title={docType}>{docType}</dd>
          </div>

          <div className="intc-card__data-item">
            <Hash className="intc-card__data-icon" aria-hidden="true" />
            <dt className="sr-only">N° de documento</dt>
            <dd className="intc-card__data-value intc-card__data-value--mono" title={user.internationalDocumentNumber || '—'}>
              {user.internationalDocumentNumber || '—'}
            </dd>
          </div>

          {user.phone && (
            <div className="intc-card__data-item">
              <Phone className="intc-card__data-icon" aria-hidden="true" />
              <dt className="sr-only">Teléfono</dt>
              <dd className="intc-card__data-value">{user.phone}</dd>
            </div>
          )}

          <div className="intc-card__data-item">
            <Mail className="intc-card__data-icon" aria-hidden="true" />
            <dt className="sr-only">Correo</dt>
            <dd className="intc-card__data-value" title={user.email}>{user.email}</dd>
          </div>

        </dl>
      </div>

      {/* Footer: Registration + Status summary */}
      <footer className="intc-card__footer">
        <div className="intc-card__footer-item">
          <div className="intc-card__footer-label">
            <CalendarDays className="intc-card__footer-label-icon" aria-hidden="true" />
            <span>Registro</span>
          </div>
          <p className="intc-card__footer-value">{formatDate(user.createdAt)}</p>
        </div>
        <div className="intc-card__footer-item">
          <div className="intc-card__footer-label">
            <span>Estado</span>
          </div>
          <p className="intc-card__footer-value">
            {user.verificationStatus === 'VERIFIED'
              ? 'Aprobado'
              : user.verificationStatus === 'REJECTED'
                ? 'Rechazado'
                : 'En revisión'}
          </p>
        </div>
      </footer>

      {/* Actions */}
      <InternationalCardActions
        user={user}
        canReview={canReview}
        onViewDetail={onViewDetail}
        onApprove={onApprove}
        onReject={onReject}
      />

    </article>
  );
}
