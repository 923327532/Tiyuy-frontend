'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import {
  Calendar,
  CheckCircle2,
  Eye,
  MousePointerClick,
  PauseCircle,
  PlayCircle,
  Trash2,
} from 'lucide-react';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_TYPE_LABELS,
} from '../../config/campaigns.config';
import type { CampaignModerationAction } from '../../hooks/useCampaignsActions';
import {
  calculateCtr,
  formatCampaignDate,
  formatCompactCurrency,
  formatNumber,
  formatPercent,
} from '../../utils/campaignFormat';

interface Props {
  campaign: PromotionCampaign;
  canModerate: boolean;
  onView: (campaign: PromotionCampaign) => void;
  onAction: (campaign: PromotionCampaign, action: CampaignModerationAction) => void;
}

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

function statusVariant(status: string): BadgeVariant {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PENDING_APPROVAL' || status === 'PAUSED') return 'warning';
  if (status === 'REJECTED' || status === 'SUSPENDED' || status === 'CANCELLED') return 'danger';
  return 'neutral';
}

export function CampaignCard({ campaign, canModerate, onView, onAction }: Props) {
  const open = () => onView(campaign);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  const quickAction = (event: MouseEvent, action: CampaignModerationAction) => {
    event.stopPropagation();
    onAction(campaign, action);
  };

  const ctr = campaign.ctr ?? calculateCtr(campaign.clicks, campaign.impressions);

  return (
    <article
      className="campaigns-card"
      role="button"
      tabIndex={0}
      aria-label={`Ver campaña ${campaign.title}`}
      onClick={open}
      onKeyDown={handleKeyDown}
    >
      <div className="campaigns-card__media">
        {campaign.imageUrl || campaign.thumbnailUrl ? (
          <img src={campaign.imageUrl || campaign.thumbnailUrl} alt="" loading="lazy" />
        ) : (
          <span className="campaigns-card__placeholder">#{campaign.id}</span>
        )}
      </div>

      <div className="campaigns-card__body">
        <div className="campaigns-card__top">
          <Badge variant={statusVariant(campaign.status)} size="sm">
            {CAMPAIGN_STATUS_LABELS[campaign.status] ?? campaign.status}
          </Badge>
          <span className="campaigns-card__price" title={formatCompactCurrency(campaign.pricePaid)}>
            {formatCompactCurrency(campaign.pricePaid)}
          </span>
        </div>

        <h3 className="campaigns-card__title">{campaign.title}</h3>

        <p className="campaigns-card__owner" title={campaign.ownerName || campaign.ownerRole}>
          {campaign.ownerName || campaign.ownerRole || 'Sin anunciante'}
        </p>
        <p className="campaigns-card__location">
          {CAMPAIGN_TYPE_LABELS[campaign.promotionType] || campaign.promotionType}
          {' · '}
          {campaign.targetProjectName || campaign.targetPropertyName || 'Sin destino'}
        </p>

        <div className="campaigns-card__metrics">
          <span className="campaigns-card__metric" title="Impresiones">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {formatNumber(campaign.impressions ?? 0)} imp.
          </span>
          <span className="campaigns-card__metric" title="Clics">
            <MousePointerClick className="h-3 w-3" aria-hidden="true" />
            {formatNumber(campaign.clicks ?? 0)} clics
          </span>
          <span className="campaigns-card__metric" title="CTR">
            {formatPercent(ctr)} CTR
          </span>
        </div>

        <div className="campaigns-card__footer">
          <span className="campaigns-card__dates">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatCampaignDate(campaign.startDate)} – {formatCampaignDate(campaign.endDate)}
          </span>
        </div>

        <div className="campaigns-card__actions">
          <button
            type="button"
            className="campaigns-card__action"
            aria-label={`Ver ${campaign.title}`}
            onClick={(event) => {
              event.stopPropagation();
              onView(campaign);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          {canModerate && campaign.status === 'PENDING_APPROVAL' && (
            <button
              type="button"
              className="campaigns-card__action"
              aria-label={`Aprobar ${campaign.title}`}
              onClick={(event) => quickAction(event, 'APPROVE')}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          {canModerate && campaign.status === 'ACTIVE' && (
            <button
              type="button"
              className="campaigns-card__action"
              aria-label={`Suspender ${campaign.title}`}
              onClick={(event) => quickAction(event, 'SUSPEND')}
            >
              <PauseCircle className="h-3.5 w-3.5" />
            </button>
          )}
          {canModerate && (campaign.status === 'SUSPENDED' || campaign.status === 'PAUSED') && (
            <button
              type="button"
              className="campaigns-card__action"
              aria-label={`Reactivar ${campaign.title}`}
              onClick={(event) => quickAction(event, 'REACTIVATE')}
            >
              <PlayCircle className="h-3.5 w-3.5" />
            </button>
          )}
          {canModerate && (
            <button
              type="button"
              className="campaigns-card__action campaigns-card__action--danger"
              aria-label={`Eliminar ${campaign.title}`}
              onClick={(event) => quickAction(event, 'DELETE')}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
