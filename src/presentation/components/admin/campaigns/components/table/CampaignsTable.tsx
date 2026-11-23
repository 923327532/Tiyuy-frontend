'use client';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { DataTable, type Column } from '@/presentation/components/ui/DataTable';
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_TYPE_LABELS,
} from '../../config/campaigns.config';
import {
  calculateCtr,
  formatCampaignDate,
  formatCompactCurrency,
  formatNumber,
  formatPercent,
} from '../../utils/campaignFormat';
import type { CampaignModerationAction } from '../../hooks/useCampaignsActions';
import { CampaignRowActions } from './CampaignRowActions';
import '../../components/styles/campaigns-table.css';

interface Props {
  campaigns: PromotionCampaign[];
  isLoading?: boolean;
  selectedCampaigns: PromotionCampaign[];
  onSelectionChange: (campaigns: PromotionCampaign[]) => void;
  onViewCampaign: (campaign: PromotionCampaign) => void;
  onAction: (campaign: PromotionCampaign, action: CampaignModerationAction) => void;
  canModerate?: boolean;
}

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

function statusVariant(status: string): BadgeVariant {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PENDING_APPROVAL' || status === 'PAUSED') return 'warning';
  if (status === 'REJECTED' || status === 'SUSPENDED' || status === 'CANCELLED') return 'danger';
  return 'neutral';
}

function initials(title: string): string {
  return title.slice(0, 2).toUpperCase();
}

export function CampaignsTable({
  campaigns,
  isLoading,
  selectedCampaigns,
  onSelectionChange,
  onViewCampaign,
  onAction,
  canModerate = false,
}: Props) {
  const columns: Column<PromotionCampaign>[] = [
    {
      key: 'title',
      label: 'Campaña',
      width: '230px',
      render: (_value, campaign) => (
        <div className="campaigns-identity">
          <div className="campaigns-identity__thumb">
            {campaign.imageUrl || campaign.thumbnailUrl ? (
              <img src={campaign.imageUrl || campaign.thumbnailUrl} alt={campaign.title} />
            ) : (
              <span className="campaigns-identity__fallback">{initials(campaign.title)}</span>
            )}
          </div>
          <div className="campaigns-identity__info">
            <span className="campaigns-cell-primary" title={campaign.title}>{campaign.title}</span>
            <span className="campaigns-cell-secondary" title={campaign.targetProjectName}>
              {campaign.targetProjectName || campaign.targetPropertyName || 'Sin destino'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'ownerName',
      label: 'Anunciante',
      width: '150px',
      render: (_value, campaign) => (
        <div className="campaigns-cell-stack campaigns-cell-owner">
          <span className="campaigns-cell-primary" title={campaign.ownerName}>
            {campaign.ownerName || 'Sin anunciante'}
          </span>
          <span className="campaigns-cell-secondary">{campaign.ownerRole || '-'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      width: '140px',
      minWidth: '140px',
      render: (value) => (
        <Badge variant={statusVariant(String(value))} size="sm" className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {CAMPAIGN_STATUS_LABELS[String(value)] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'promotionType',
      label: 'Tipo',
      width: '160px',
      minWidth: '160px',
      render: (value) => (
        <Badge variant="info" size="sm" className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {CAMPAIGN_TYPE_LABELS[String(value)] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'pricePaid',
      label: 'Inversión',
      width: '110px',
      render: (value) => (
        <span className="campaigns-cell-price" title={formatCompactCurrency(Number(value ?? 0))}>
          {formatCompactCurrency(Number(value ?? 0))}
        </span>
      ),
    },
    {
      key: 'impressions',
      label: 'Rendimiento',
      width: '140px',
      render: (_value, campaign) => (
        <div className="campaigns-cell-stack">
          <span className="campaigns-cell-metric">
            {formatNumber(campaign.impressions ?? 0)} imp. / {formatNumber(campaign.clicks ?? 0)} clics
          </span>
          <span className="campaigns-cell-secondary tabular-nums">
            CTR {formatPercent(campaign.ctr ?? calculateCtr(campaign.clicks, campaign.impressions))}
          </span>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Fecha inicio',
      width: '110px',
      render: (value) => <span className="campaigns-cell-secondary">{formatCampaignDate(String(value))}</span>,
    },
    {
      key: 'endDate',
      label: 'Fecha fin',
      width: '110px',
      render: (value) => <span className="campaigns-cell-secondary">{formatCampaignDate(String(value))}</span>,
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '130px',
      align: 'center',
      render: (_value, campaign) => (
        <CampaignRowActions
          campaign={campaign}
          canModerate={canModerate}
          onView={onViewCampaign}
          onAction={onAction}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={campaigns}
      columns={columns}
      rowKey="id"
      selectedRows={selectedCampaigns}
      onSelectionChange={onSelectionChange}
      onRowClick={onViewCampaign}
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron campañas"
      className="campaigns-table__container"
    />
  );
}
