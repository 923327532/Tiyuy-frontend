'use client';

import { X } from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import {
  CARD,
  Row,
  RowList,
  SECONDARY_BUTTON,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';

import { MODERATION_ACTIONS } from '../../config/properties.constants';
import { formatCurrency, formatDateTime, getInitials } from '../../utils/properties.utils';
import { PropertyStatusBadge } from '../table/PropertyStatusBadge';
import { PropertyCommentsSection } from './PropertyCommentsSection';
import { PropertyReportsSection } from './PropertyReportsSection';

interface PropertyDetailModalProps {
  property: PropertyModerationItem;
  isOpen?: boolean;
  canModerate: boolean;
  isEnabling: boolean;
  onModerate: (property: PropertyModerationItem) => void;
  onEnable: (property: PropertyModerationItem) => void;
  onDisable: (property: PropertyModerationItem) => void;
  onNotify: (property: PropertyModerationItem) => void;
  onClose: () => void;
}

const PRIMARY_BUTTON =
  'inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0f2e3a] px-3 text-xs font-medium text-white transition hover:bg-[#164e63] disabled:cursor-not-allowed disabled:opacity-60';
const DANGER_BUTTON =
  'inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#b94b59] px-3 text-xs font-medium text-white transition hover:bg-[#9f1239] disabled:cursor-not-allowed disabled:opacity-60';

export function PropertyDetailModal({
  property,
  isOpen = true,
  canModerate,
  isEnabling,
  onModerate,
  onEnable,
  onDisable,
  onNotify,
  onClose,
}: PropertyDetailModalProps) {
  const isDisabled = property.status === 'DISABLED_BY_ADMIN';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          {property.thumbnailUrl ? (
            <img src={property.thumbnailUrl} alt="" className="user-detail-modal__avatar" />
          ) : (
            <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
              {getInitials(property.title)}
            </span>
          )}

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title={property.title}>{property.title}</h3>
            <p className="user-detail-modal__email" title={property.ownerEmail}>
              {property.ownerName || 'Sin propietario'} · {property.ownerEmail}
            </p>
            <div className="user-detail-modal__badges">
              <PropertyStatusBadge status={property.status} />
              {property.isFeatured && (
                <span className="user-detail-modal__role-badge user-detail-modal__role-badge--admin">
                  Destacada
                </span>
              )}
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--user">
                #{property.id}
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
          <div className="flex flex-col gap-4">
            <section className={`${CARD} p-4`}>
              <h4 className="mb-3 text-sm font-semibold tracking-tight text-[#0f2e3a]">
                Información de la propiedad
              </h4>
              <RowList>
                <Row label="Precio" value={formatCurrency(Number(property.price))} />
                <Row label="Ubicación" value={property.district || '—'} />
                <Row label="Creada" value={formatDateTime(property.createdAt)} />
                <Row label="Publicada" value={formatDateTime(property.publishedAt)} />
                <Row label="Vistas" value={Number(property.viewsCount ?? 0).toLocaleString('es-PE')} />
                <Row label="Reportes" value={String(Number(property.reportCount ?? 0))} />
              </RowList>
            </section>

            <PropertyReportsSection propertyId={property.id} />
            <PropertyCommentsSection propertyId={property.id} />
          </div>
        </div>

        <footer className="user-detail-modal__footer">
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className={SECONDARY_BUTTON} onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className={SECONDARY_BUTTON} onClick={() => onNotify(property)}>
              Notificar propietario
            </button>
            {canModerate && isDisabled && (
              <button
                type="button"
                className={PRIMARY_BUTTON}
                onClick={() => onEnable(property)}
                disabled={isEnabling}
              >
                {isEnabling ? 'Habilitando...' : 'Habilitar'}
              </button>
            )}
            {canModerate && !isDisabled && (
              <>
                <button type="button" className={PRIMARY_BUTTON} onClick={() => onModerate(property)}>
                  {MODERATION_ACTIONS.APPROVE}
                </button>
                <button type="button" className={DANGER_BUTTON} onClick={() => onDisable(property)}>
                  Deshabilitar
                </button>
              </>
            )}
          </div>
        </footer>
      </div>
    </Modal>
  );
}
