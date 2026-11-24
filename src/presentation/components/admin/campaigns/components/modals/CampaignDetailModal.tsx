'use client';

import { X } from 'lucide-react';
import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import {
  Chip,
  type Tone,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_TYPE_LABELS,
} from '../../config/campaigns.config';
import type { CampaignModerationAction } from '../../hooks/useCampaignsActions';
import { CampaignInfoCard } from './CampaignInfoCard';
import { CampaignActivityCard } from './CampaignActivityCard';

const COMPACT_SECONDARY =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-[#0f2e3a] transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';
const PRIMARY_BUTTON =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#0f2e3a] px-2.5 text-[11px] font-medium text-white transition hover:bg-[#164e63] disabled:cursor-not-allowed disabled:opacity-60';
const DANGER_BUTTON =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#b94b59] px-2.5 text-[11px] font-medium text-white transition hover:bg-[#9f1239] disabled:cursor-not-allowed disabled:opacity-60';

const STATUS_TONE: Record<string, Tone> = {
  DRAFT: 'neutral',
  PENDING_APPROVAL: 'warning',
  ACTIVE: 'success',
  PAUSED: 'warning',
  SUSPENDED: 'danger',
  REJECTED: 'danger',
  EXPIRED: 'neutral',
  CANCELLED: 'danger',
};

function getInitials(title: string): string {
  return title.slice(0, 2).toUpperCase();
}

function nextAction(status: string): { action: CampaignModerationAction; label: string } {
  if (status === 'ACTIVE') return { action: 'SUSPEND', label: 'Pausar' };
  if (['SUSPENDED', 'PAUSED', 'REJECTED', 'CANCELLED'].includes(status)) {
    return { action: 'REACTIVATE', label: 'Reactivar' };
  }
  return { action: 'APPROVE', label: 'Aprobar' };
}

interface Props {
  campaign: PromotionCampaign | null;
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onNotify: () => void;
  onAction: (action: CampaignModerationAction) => void;
}

export function CampaignDetailModal({ campaign, isOpen, isPending, onClose, onNotify, onAction }: Props) {
  if (!campaign) return null;

  const primary = nextAction(campaign.status);
  const image = campaign.imageUrl || campaign.thumbnailUrl;
  const owner = campaign.ownerName || 'Sin anunciante';
  const contact = campaign.ownerEmail || 'sin correo';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="user-detail-modal__surface !flex !h-full !max-h-[90vh] !max-w-2xl !flex-col !overflow-hidden">
        <header className="user-detail-modal__header shrink-0 !bg-white">
          {image ? (
            <img src={image} alt="" className="user-detail-modal__avatar" />
          ) : (
            <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
              {getInitials(campaign.title)}
            </span>
          )}

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title={campaign.title}>{campaign.title}</h3>
            <p className="user-detail-modal__email" title={`${owner} · ${contact}`}>
              {owner} · {contact}
            </p>
            <div className="user-detail-modal__badges">
              <Chip tone={STATUS_TONE[campaign.status] ?? 'neutral'}>
                {CAMPAIGN_STATUS_LABELS[campaign.status] ?? campaign.status}
              </Chip>
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--admin">
                {CAMPAIGN_TYPE_LABELS[campaign.promotionType] ?? campaign.promotionType}
              </span>
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--user">
                #{campaign.id}
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

        <div className="user-detail-modal__content min-h-0 flex-1 !bg-white">
          <div className="flex flex-col gap-4">
            <CampaignInfoCard campaign={campaign} />
            <CampaignActivityCard campaign={campaign} />
          </div>
        </div>

        <footer className="user-detail-modal__footer shrink-0 overflow-x-auto">
          <div className="flex min-w-max items-center justify-between gap-2 whitespace-nowrap">
            <button type="button" className={COMPACT_SECONDARY} onClick={onClose}>
              Cerrar
            </button>
            <div className="flex items-center gap-2">
              <button type="button" className={COMPACT_SECONDARY} onClick={onNotify}>
                Notificar
              </button>
              <button
                type="button"
                className={PRIMARY_BUTTON}
                disabled={isPending}
                onClick={() => onAction(primary.action)}
              >
                {primary.label}
              </button>
              <button
                type="button"
                className={DANGER_BUTTON}
                disabled={isPending}
                onClick={() => onAction('DELETE')}
              >
                Eliminar
              </button>
            </div>
          </div>
        </footer>
      </div>
    </Modal>
  );
}
