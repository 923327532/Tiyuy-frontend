'use client';

import { useState } from 'react';
import { CampaignsBanner } from './CampaignsBanner';
import { FestiveCampaignsModal } from './FestiveCampaignsModal';

interface Props {
  className?: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function CampaignsHeader({ className = '', onRefresh, isRefreshing }: Props) {
  const [festiveOpen, setFestiveOpen] = useState(false);

  return (
    <section aria-label="Encabezado de gestión de campañas" className={`users-header ${className}`.trim()}>
      <CampaignsBanner
        onRefresh={onRefresh}
        onOpenFestive={() => setFestiveOpen(true)}
        isRefreshing={isRefreshing}
      />
      <FestiveCampaignsModal isOpen={festiveOpen} onClose={() => setFestiveOpen(false)} />
    </section>
  );
}
