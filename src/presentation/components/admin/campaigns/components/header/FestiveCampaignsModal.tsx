'use client';

import { Calendar, PartyPopper, X } from 'lucide-react';
import type { FestiveCampaign } from '@/core/domain/entities/Admin';
import { useFestiveCampaigns } from '@/presentation/hooks/useAdmin';
import { Modal } from '@/presentation/components/ui/Modal';
import {
  CARD,
  Chip,
  SECONDARY_BUTTON,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import { FESTIVE_TYPE_LABELS } from '../../config/campaigns.config';
import { formatCampaignDate, formatExactCurrency } from '../../utils/campaignFormat';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function FestiveItem({ item }: { item: FestiveCampaign }) {
  const type = FESTIVE_TYPE_LABELS[item.festiveType] ?? item.festiveType;
  const discount = item.discountPercentage
    ? `${item.discountPercentage}% de descuento`
    : 'Sin descuento';

  return (
    <li className={`${CARD} p-4`}>
      {item.bannerUrl && (
        <img
          src={item.bannerUrl}
          alt=""
          loading="lazy"
          className="mb-3 h-20 w-full rounded-lg object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 text-sm font-semibold text-[#0f2e3a]" title={item.name}>
          {item.name}
        </h4>
        <Chip tone="warning">{type}</Chip>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
        {formatCampaignDate(item.startDate)} – {formatCampaignDate(item.endDate)}
      </p>
      <p className="mt-2 text-sm font-bold tabular-nums text-teal-700">{discount}</p>
      {item.specialPricePen != null && (
        <p className="text-xs tabular-nums text-slate-500">
          Precio especial: {formatExactCurrency(item.specialPricePen)}
        </p>
      )}
      {item.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {item.description}
        </p>
      )}
    </li>
  );
}

export function FestiveCampaignsModal({ isOpen, onClose }: Props) {
  const { data: festive = [], isLoading } = useFestiveCampaigns();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="user-detail-modal__surface !flex !h-full !max-h-[90vh] !max-w-2xl !flex-col !overflow-hidden">
        <header className="user-detail-modal__header shrink-0 !bg-white">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            <PartyPopper className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name">Campañas festivas</h3>
            <p className="user-detail-modal__email">
              Campañas de temporada registradas en el módulo de marketing.
            </p>
            <div className="user-detail-modal__badges">
              <Chip tone="info">{festive.length} campañas</Chip>
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--user">
                Marketing
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="user-detail-modal__close-btn"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="user-detail-modal__content min-h-0 flex-1 !bg-white">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-500">Cargando campañas festivas...</p>
          )}

          {!isLoading && festive.length === 0 && (
            <div className={`${CARD} py-10 text-center`}>
              <PartyPopper className="mx-auto h-6 w-6 text-slate-300" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-slate-600">No hay campañas festivas</p>
            </div>
          )}

          {!isLoading && festive.length > 0 && (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {festive.map((item) => (
                <FestiveItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        <footer className="user-detail-modal__footer shrink-0">
          <button type="button" className={SECONDARY_BUTTON} onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}
