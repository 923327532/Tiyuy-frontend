/** Grid de tarjetas de campañas, alineado con Proyectos/Propiedades. */

'use client';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import type { CampaignModerationAction } from '../../hooks/useCampaignsActions';
import { CampaignCard } from './CampaignCard';
import '../../components/styles/campaigns-cards.css';

interface Props {
  campaigns: PromotionCampaign[];
  canModerate: boolean;
  onViewCampaign: (campaign: PromotionCampaign) => void;
  onAction: (campaign: PromotionCampaign, action: CampaignModerationAction) => void;
}

export function CampaignCardView({ campaigns, canModerate, onViewCampaign, onAction }: Props) {
  return (
    <div className="campaigns-cards-container">
      <ul className="campaigns-card-grid">
        {campaigns.map((campaign) => (
          <li key={campaign.id} className="h-full min-w-0">
            <CampaignCard
              campaign={campaign}
              canModerate={canModerate}
              onView={onViewCampaign}
              onAction={onAction}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
