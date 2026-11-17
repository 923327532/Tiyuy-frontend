'use client';

import { Building2, FolderKanban } from 'lucide-react';
import { formatNumber } from './Config';

interface UserProductionStatsProps {
  user: {
    publishedPropertiesCount?: number;
    publishedProjectsCount?: number;
  };
}

export function UserProductionStats({ user }: UserProductionStatsProps) {
  return (
    <dl className="mt-5 grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 pt-4">
      <div className="pr-3">
        <div className="mb-1 flex items-center gap-1.5 text-slate-400">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="text-[11px] font-medium">Propiedades</dt>
        </div>
        <dd className="text-xl font-bold tabular-nums text-[#164E63]">
          {formatNumber(user.publishedPropertiesCount ?? 0)}
        </dd>
        <p className="text-[11px] text-slate-400">Publicadas</p>
      </div>

      <div className="pl-4">
        <div className="mb-1 flex items-center gap-1.5 text-slate-400">
          <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="text-[11px] font-medium">Proyectos</dt>
        </div>
        <dd className="text-xl font-bold tabular-nums text-[#164E63]">
          {formatNumber(user.publishedProjectsCount ?? 0)}
        </dd>
        <p className="text-[11px] text-slate-400">Publicados</p>
      </div>
    </dl>
  );
}