import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';

export type AgencyAccountTone = 'active' | 'suspended' | 'inactive';

export interface AgencyAccountState {
  label: string;
  tone: AgencyAccountTone;
}

export function getAgencyAccountState(agency: InmobiliariaWithStats): AgencyAccountState {
  const isEnabled = agency.enabled !== false;
  const status = agency.status || 'INACTIVE';

  if (!isEnabled) {
    return { label: 'Inactiva', tone: 'inactive' };
  }

  switch (status) {
    case 'ACTIVE':
      return { label: 'Activa', tone: 'active' };
    case 'SUSPENDED':
      return { label: 'Suspendida', tone: 'suspended' };
    default:
      return { label: 'Inactiva', tone: 'inactive' };
  }
}