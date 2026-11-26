'use client';

import { useMemo } from 'react';
import type { Banner } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { DataTable, type Column } from '@/presentation/components/ui/DataTable';
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
import '../../campaigns/components/styles/campaigns-table.css';
import './styles/banners-table.css';

interface Props {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onToggle: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  busyId?: number | null;
}

export function BannersTable({ banners, onEdit, onToggle, onDelete, busyId }: Props) {
  const columns = useMemo<Column<Banner>[]>(
    () => [
      {
        key: 'banner',
        label: 'Banner',
        width: '260px',
        render: (_value, banner) => (
          <div className="campaigns-identity">
            <span className="campaigns-identity__thumb">
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt="" loading="lazy" />
              ) : (
                <span className="campaigns-identity__fallback">TI</span>
              )}
            </span>
            <span className="campaigns-identity__info">
              <span className="campaigns-cell-primary" title={banner.title}>
                {banner.title}
              </span>
              <span className="campaigns-cell-secondary" title={banner.description ?? ''}>
                {banner.description || 'Sin descripción'}
              </span>
            </span>
          </div>
        ),
      },
      {
        key: 'placement',
        label: 'Ubicación',
        width: '175px',
        render: (_value, banner) => (
          <span className="campaigns-cell-stack">
            <span className="campaigns-cell-primary">
              {PLACEMENT_LABELS[banner.placement] ?? banner.placement}
            </span>
            <span className="campaigns-cell-secondary">{banner.placement}</span>
          </span>
        ),
      },
      {
        key: 'displayMode',
        label: 'Modo',
        width: '130px',
        render: (_value, banner) => (
          <Badge
            size="sm"
            variant={banner.displayMode === 'SOLO_BANNER' ? 'brand' : 'neutral'}
          >
            {banner.displayMode === 'SOLO_BANNER' ? 'Individual' : 'Carrusel'}
          </Badge>
        ),
      },
      {
        key: 'status',
        label: 'Estado',
        width: '120px',
        render: (_value, banner) => {
          const status = getBannerStatus(banner);
          return (
            <Badge size="sm" variant={BANNER_STATUS_VARIANTS[status]} dot>
              {BANNER_STATUS_LABELS[status]}
            </Badge>
          );
        },
      },
      {
        key: 'dates',
        label: 'Vigencia',
        width: '180px',
        render: (_value, banner) => (
          <span className="campaigns-cell-stack">
            <span className="campaigns-cell-primary">
              {formatBannerDate(banner.startDate)} – {formatBannerDate(banner.endDate)}
            </span>
            <span className="campaigns-cell-secondary">
              {banner.durationDays ? `${banner.durationDays} días` : 'Sin duración fija'}
            </span>
          </span>
        ),
      },
      {
        key: 'performance',
        label: 'Rendimiento',
        width: '175px',
        render: (_value, banner) => (
          <span className="campaigns-cell-stack">
            <span className="campaigns-cell-metric">
              {formatCompact(banner.impressions)} imp · {formatCompact(banner.clicks)} clics
            </span>
            <span className="campaigns-cell-secondary">
              CTR {formatBannerCtr(banner.clicks, banner.impressions)}
            </span>
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'Acciones',
        width: '96px',
        align: 'right',
        className: 'banners-table__actions',
        headerClassName: 'banners-table__actions-header',
        render: (_value, banner) => (
          <BannerActionsMenu
            banner={banner}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
            busyId={busyId}
            className="banners-table__actions-menu"
          />
        ),
      },
    ],
    [busyId, onDelete, onEdit, onToggle]
  );

  return (
    <DataTable
      data={banners}
      columns={columns}
      rowKey={(banner) => String(banner.id)}
      className="campaigns-table__container banners-table__container"
      tableClassName="banners-table"
      hoverable
      striped={false}
      isLoading={false}
    />
  );
}
