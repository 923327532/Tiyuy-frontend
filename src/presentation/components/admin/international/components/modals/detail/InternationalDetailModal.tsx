'use client';

import { Camera, IdCard } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';
import { DOC_TYPE_LABELS } from '../../../config/international.constants';
import { StatusBadge } from '../../list/StatusBadge';
import './styles/InternationalDetailModal.css';

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="intl-detail-modal__field-label">{label}</p>
      <p className="intl-detail-modal__field-value">{value || '—'}</p>
    </div>
  );
}

function ImageCard({ label, url }: { label: string; url?: string | null }) {
  const isDocument = label.toLowerCase().includes('documento');
  const Icon = isDocument ? IdCard : Camera;
  return (
    <div>
      <p className="intl-detail-modal__image-card-label">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="intl-detail-modal__image-link">
          <img src={url} alt={label} className="intl-detail-modal__image" />
        </a>
      ) : (
        <div className="intl-detail-modal__image-placeholder">Sin imagen</div>
      )}
    </div>
  );
}

interface Props {
  user: InternationalUserListItem | null;
  isOpen: boolean;
  canReview: boolean;
  approvePending: boolean;
  rejectPending: boolean;
  onClose: () => void;
  onApprove: (user: InternationalUserListItem) => void;
  onReject: (user: InternationalUserListItem) => void;
}

export function InternationalDetailModal({
  user,
  isOpen,
  canReview,
  approvePending,
  rejectPending,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="intl-detail-modal__surface">
        <header className="intl-detail-modal__header">
          <div className="intl-detail-modal__header-main">
            <h3 className="intl-detail-modal__title">
              {user.firstName || ''} {user.lastName || ''}
            </h3>
            <p className="intl-detail-modal__subtitle">{user.email} · {user.phone}</p>
          </div>
          <div className="intl-detail-modal__status">
            <StatusBadge status={user.verificationStatus} />
          </div>
        </header>

        <div className="intl-detail-modal__body">
          <div className="intl-detail-modal__doc-grid">
            <Field label="País emisor" value={user.issuingCountry} />
            <Field
              label="Tipo de documento"
              value={DOC_TYPE_LABELS[user.internationalDocumentType] || user.internationalDocumentType}
            />
            <Field label="N° de documento" value={user.internationalDocumentNumber} />
            <Field
              label="Registro"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-PE') : '—'}
            />
          </div>

          {user.verificationResult && (
            <div className="intl-detail-modal__result">
              <span className="intl-detail-modal__result-label">Resultado:</span> {user.verificationResult}
            </div>
          )}

          <p className="intl-detail-modal__section-title">Comparación de fotos</p>
          <div className="intl-detail-modal__photos-grid">
            <ImageCard label="Foto del documento" url={user.documentImageUrl} />
            <ImageCard label="Selfie" url={user.selfieImageUrl} />
          </div>

          <div className="intl-detail-modal__actions">
            {canReview && user.verificationStatus !== 'VERIFIED' && (
              <button
                type="button"
                onClick={() => onApprove(user)}
                disabled={approvePending}
                className="intl-detail-modal__btn intl-detail-modal__btn--approve"
              >
                {approvePending ? 'Aprobando...' : 'Aprobar documento'}
              </button>
            )}
            {canReview && user.verificationStatus !== 'REJECTED' && (
              <button
                type="button"
                onClick={() => onReject(user)}
                disabled={rejectPending}
                className="intl-detail-modal__btn intl-detail-modal__btn--reject"
              >
                {rejectPending ? 'Rechazando...' : 'Rechazar documento'}
              </button>
            )}
            {!canReview && (
              <p className="intl-detail-modal__note">No tienes permiso para aprobar o rechazar documentos.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
