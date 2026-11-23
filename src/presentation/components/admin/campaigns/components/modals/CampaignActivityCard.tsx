'use client';

import { useState } from 'react';
import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import {
  CARD,
  EmptyNote,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import { CAMPAIGN_STATUS_LABELS } from '../../config/campaigns.config';
import { formatCampaignDate } from '../../utils/campaignFormat';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function getReviewHistory(campaign: PromotionCampaign): string {
  if (campaign.approvedAt) {
    const approver = campaign.approvedBy ? ` por el administrador #${campaign.approvedBy}` : '';
    return `Aprobada el ${formatCampaignDate(campaign.approvedAt)}${approver}.`;
  }
  if (campaign.status === 'PENDING_APPROVAL') {
    return 'Pendiente de revisión por el administrador.';
  }
  return `Estado actual: ${CAMPAIGN_STATUS_LABELS[campaign.status] ?? campaign.status}.`;
}

export function CampaignActivityCard({ campaign }: { campaign: PromotionCampaign }) {
  const [activeId, setActiveId] = useState('description');

  const allTabs: Tab[] = [
    {
      id: 'description',
      label: 'Descripción',
      content: campaign.description?.trim() || '',
    },
    {
      id: 'review',
      label: 'Revisión',
      content: getReviewHistory(campaign),
    },
    {
      id: 'notes',
      label: 'Notas',
      content: campaign.notes?.trim() || '',
    },
  ];
  const tabs = allTabs.filter((tab) => Boolean(tab.content));

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const tabClass = (selected: boolean) =>
    `relative px-3 pb-2 pt-1 text-xs font-medium transition-colors ${
      selected
        ? 'text-[#0f2e3a] after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#0f2e3a]'
        : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <section className={CARD}>
      {tabs.length === 0 ? (
        <div className="p-4">
          <EmptyNote>Sin información adicional para esta campaña.</EmptyNote>
        </div>
      ) : (
        <>
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={tabClass(tab.id === active?.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="max-h-32 overflow-y-auto px-4 py-3">
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
              {active?.content}
            </p>
          </div>
        </>
      )}
    </section>
  );
}
