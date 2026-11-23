'use client';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import { CARD } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import {
  CAMPAIGN_OWNER_ROLE_LABELS,
  CAMPAIGN_PLACEMENT_LABELS,
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_TYPE_LABELS,
} from '../../config/campaigns.config';
import {
  calculateCtr,
  formatCampaignDate,
  formatExactCurrency,
  formatNumber,
  formatPercent,
} from '../../utils/campaignFormat';

function CompactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      <span className="text-xs font-medium text-[#0f2e3a]">{value || '—'}</span>
    </div>
  );
}

export function CampaignInfoCard({ campaign }: { campaign: PromotionCampaign }) {
  const placement = CAMPAIGN_PLACEMENT_LABELS[campaign.placementLocation] ?? campaign.placementLocation;
  const ownerRole = campaign.ownerRole
    ? CAMPAIGN_OWNER_ROLE_LABELS[campaign.ownerRole] ?? campaign.ownerRole
    : undefined;
  const ctr = campaign.ctr ?? calculateCtr(campaign.clicks, campaign.impressions);

  return (
    <section className={`${CARD} p-4`}>
      <h4 className="mb-2 text-sm font-semibold tracking-tight text-[#0f2e3a]">
        Información de la campaña
      </h4>
      <div className="grid grid-cols-2 gap-x-5">
        <CompactRow
          label="Tipo"
          value={CAMPAIGN_TYPE_LABELS[campaign.promotionType] ?? campaign.promotionType}
        />
        <CompactRow
          label="Estado"
          value={CAMPAIGN_STATUS_LABELS[campaign.status] ?? campaign.status}
        />
        <CompactRow
          label="Objetivo"
          value={campaign.targetProjectName || campaign.targetPropertyName || 'Sin destino'}
        />
        <CompactRow
          label="Presupuesto / inversión"
          value={formatExactCurrency(campaign.pricePaid)}
        />
        <CompactRow
          label="Alcance"
          value={`${formatNumber(campaign.impressions ?? 0)} impresiones`}
        />
        <CompactRow
          label="Métricas"
          value={`${formatNumber(campaign.clicks ?? 0)} clics · CTR ${formatPercent(ctr)}`}
        />
        <CompactRow label="Ubicación" value={placement} />
        <CompactRow
          label="Anunciante"
          value={campaign.ownerName ? `${campaign.ownerName} · ${ownerRole ?? ''}` : ownerRole}
        />
        <CompactRow label="Fecha de inicio" value={formatCampaignDate(campaign.startDate)} />
        <CompactRow label="Fecha de fin" value={formatCampaignDate(campaign.endDate)} />
        <CompactRow label="Fecha de creación" value={formatCampaignDate(campaign.createdAt)} />
        <CompactRow
          label="Conversiones"
          value={`${formatNumber(campaign.conversions ?? 0)} · ${formatPercent(campaign.conversionRate ?? 0)}`}
        />
      </div>
    </section>
  );
}
