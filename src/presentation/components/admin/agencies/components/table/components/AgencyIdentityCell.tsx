'use client';

import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { getAgencyFullName, getAgencyInitials } from '@/presentation/components/admin/agencies/utils/agencies.utils';

export function AgencyIdentityCell({ agency }: { agency: InmobiliariaWithStats }) {
  const isDisabled = agency.enabled === false;

  return (
    <div className="agencies-table__user-cell">
      {agency.logoUrl ? (
        <img
          src={agency.logoUrl}
          alt=""
          className={`agencies-table__avatar ${isDisabled ? 'agencies-table__avatar--disabled' : ''}`}
        />
      ) : (
        <div className={`agencies-table__avatar agencies-table__avatar--fallback ${isDisabled ? 'agencies-table__avatar--disabled' : ''}`}>
          {getAgencyInitials(agency)}
        </div>
      )}
      <div className="agencies-table__user-info">
        <div className="agencies-table__email" title={agency.ruc || ''}>RUC: {agency.ruc || '—'}</div>
        <div className="agencies-table__name" title={getAgencyFullName(agency)}>{getAgencyFullName(agency)}</div>
      </div>
    </div>
  );
}