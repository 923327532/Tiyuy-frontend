'use client';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { CARD } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import {
  formatProjectCurrency,
  formatProjectDate,
  formatProjectDateTime,
  formatProjectPhase,
  formatProjectType,
} from '@/presentation/components/admin/projects/utils/projectFormat';

function CompactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      <span className="text-xs font-medium text-[#0f2e3a]">{value || '—'}</span>
    </div>
  );
}

export function ProjectInfoCard({ project }: { project: ProjectAdminItem }) {
  return (
    <section className={`${CARD} p-4`}>
      <h4 className="mb-2 text-sm font-semibold tracking-tight text-[#0f2e3a]">
        Información del proyecto
      </h4>
      <div className="grid grid-cols-2 gap-x-5">
        <CompactRow label="Tipo" value={formatProjectType(project.type)} />
        <CompactRow label="Fase" value={formatProjectPhase(project.phase)} />
        <CompactRow
          label="Precio"
          value={formatProjectCurrency(project.priceRange?.min, project.priceRange?.max)}
        />
        <CompactRow
          label="Ubicación"
          value={[project.district, project.city].filter(Boolean).join(', ') || '—'}
        />
        <CompactRow
          label="Unidades"
          value={`${project.totalUnits} total / ${project.soldUnits} vendidas / ${project.availableUnits} disponibles`}
        />
        <CompactRow label="Fecha de inicio" value={formatProjectDate(project.startDate)} />
        <CompactRow label="Fecha de entrega" value={formatProjectDate(project.estimatedDeliveryDate)} />
        <CompactRow label="Fecha de creación" value={formatProjectDateTime(project.createdAt)} />
      </div>
    </section>
  );
}
