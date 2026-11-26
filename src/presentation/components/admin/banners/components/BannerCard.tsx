'use client';

import type { KeyboardEvent } from 'react';
import {
  CalendarDays,
  Eye,
  Image as ImageIcon,
  MapPin,
  MousePointerClick,
} from 'lucide-react';

import type { Banner } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import {
  BANNER_STATUS_VARIANTS,
  PLACEMENT_LABELS,
} from '../config/banners.config';
import {
  BANNER_STATUS_LABELS,
  formatBannerCtr,
  formatBannerDate,
  formatCompact,
  getBannerStatus,
} from '../utils/bannerFormat';
import { BannerActionsMenu } from './BannerActionsMenu';
import '../../campaigns/components/styles/campaigns-cards.css';
import './styles/banners-cards.css';

interface Props {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onToggle: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  busyId?: number | null;
}

export function BannerCard({ banner, onEdit, onToggle, onDelete, busyId }: Props) {
  const status = getBannerStatus(banner);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEdit(banner);
    }
  };

  return (
    <article
      className="campaigns-card banners-card"
      role="button"
      tabIndex={0}
      aria-label={`Editar banner ${banner.title}`}
      onClick={() => onEdit(banner)}
      onKeyDown={handleKeyDown}
    >
      <div className="campaigns-card__media">
        {banner.imageUrl ? (
          <img src={banner.imageUrl} alt={banner.title} loading="lazy" />
        ) : (
          <span className="campaigns-card__placeholder" aria-hidden="true">
            <ImageIcon className="h-6 w-6" />
          </span>
        )}
        <span className="banners-card__status">
          <Badge size="xs" variant={BANNER_STATUS_VARIANTS[status]} dot>
            {BANNER_STATUS_LABELS[status]}
          </Badge>
        </span>
      </div>

      <div className="campaigns-card__body">
        <div className="campaigns-card__top">
          <Badge
            size="xs"
            variant={banner.displayMode === 'SOLO_BANNER' ? 'brand' : 'neutral'}
          >
            {banner.displayMode === 'SOLO_BANNER' ? 'Individual' : 'Carrusel'}
          </Badge>
          <span className="banners-card__order">Orden {banner.displayOrder ?? 0}</span>
        </div>

        <h4 className="campaigns-card__title">{banner.title}</h4>
        <p className="campaigns-card__owner" title={banner.description ?? ''}>
          {banner.description || 'Sin descripción'}
        </p>
        <p className="campaigns-card__location">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {PLACEMENT_LABELS[banner.placement] ?? banner.placement}
          </span>
        </p>

        <div className="campaigns-card__metrics">
          <span className="campaigns-card__metric">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {formatCompact(banner.impressions)}
          </span>
          <span className="campaigns-card__metric">
            <MousePointerClick className="h-3 w-3" aria-hidden="true" />
            {formatCompact(banner.clicks)}
          </span>
          <span className="campaigns-card__metric">
            CTR {formatBannerCtr(banner.clicks, banner.impressions)}
          </span>
        </div>

        <footer className="campaigns-card__footer">
          <span className="campaigns-card__dates">
            <CalendarDays className="h-3 w-3" aria-hidden="true" />
            {formatBannerDate(banner.startDate)} – {formatBannerDate(banner.endDate)}
          </span>
          <BannerActionsMenu
            banner={banner}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
            busyId={busyId}
            className="banners-card__actions"
          />
        </footer>
      </div>
    </article>
  );
}
