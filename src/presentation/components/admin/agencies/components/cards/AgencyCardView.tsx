'use client';

import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { AgencyCard } from './AgencyCard';

interface AgencyCardViewProps {
  agencies: InmobiliariaWithStats[];
  onSelectAgency: (agency: InmobiliariaWithStats) => void;
  onNotifyAgency?: (agency: InmobiliariaWithStats) => void;
  canManage?: boolean;
}

export function AgencyCardView({
  agencies,
  onSelectAgency,
  onNotifyAgency,
  canManage,
}: AgencyCardViewProps) {
  return (
    <ul className="agc-grid" role="list">
      {agencies.map((agency) => (
        <li key={agency.id}>
          <AgencyCard
            agency={agency}
            canManage={canManage}
            onView={onSelectAgency}
            onNotify={onNotifyAgency}
          />
        </li>
      ))}
    </ul>
  );
}