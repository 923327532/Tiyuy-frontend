'use client';

import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { getAgencyFullName, getAgencyInitials } from '@/presentation/components/admin/agencies/utils/agencies.utils';

interface AgencyAvatarProps {
  agency: InmobiliariaWithStats;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function AgencyAvatar({ agency, size = 'md' }: AgencyAvatarProps) {
  const fullName = getAgencyFullName(agency);
  const initials = getAgencyInitials(agency);
  const isEnabled = agency.enabled !== false;

  return (
    <div className="relative shrink-0" aria-label={`Inmobiliaria: ${fullName}`}>
      {agency.logoUrl ? (
        <img
          src={agency.logoUrl}
          alt={`Logo de ${fullName}`}
          loading="lazy"
          decoding="async"
          className={`${sizeClasses[size]} rounded-xl object-cover ring-1 ring-slate-200 ${!isEnabled ? 'grayscale opacity-60' : ''}`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-xl bg-[#E8F0F3] font-bold text-[#164E63] ring-1 ring-slate-200 ${!isEnabled ? 'grayscale opacity-60' : ''}`}
        >
          {initials}
        </div>
      )}

      <span
        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}
        aria-label={isEnabled ? 'Inmobiliaria activa' : 'Inmobiliaria inactiva'}
      />
    </div>
  );
}