'use client';

import { Building2 } from 'lucide-react';

import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { safeNumber, SUMMARY_ITEMS } from './Config';

interface ProjectsSummaryProps {
  stats: {
    activeProjects?: number;
    pendingProjects?: number;
    completedProjects?: number;
  };
}

export function ProjectsSummary({ stats }: ProjectsSummaryProps) {
  const summaryData = SUMMARY_ITEMS.map((item) => {
    let value = 0;
    if (item.id === 'active') value = stats?.activeProjects ?? 0;
    else if (item.id === 'pending') value = stats?.pendingProjects ?? 0;
    else if (item.id === 'completed') value = stats?.completedProjects ?? 0;
    return { ...item, value: safeNumber(value) };
  });

  return (
    <section className="border-t border-[#E2EAF0]">
      <div className="flex items-center gap-2 px-6 pb-3 pt-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F0F3]">
          <Building2 className="h-4 w-4 text-[#164E63]" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Estado de proyectos</h3>
          <p className="text-xs text-slate-500">Resumen del portafolio inmobiliario</p>
        </div>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-[#E2EAF0]">
        {summaryData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="projects-summary-item flex flex-col items-center px-2 py-4 text-center"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${item.iconBackground}`}>
                <Icon className={`h-4 w-4 ${item.iconColor}`} aria-hidden="true" />
              </span>
              <dd className="text-xl font-semibold tabular-nums text-[#164E63]">{formatNumber(item.value)}</dd>
              <dt className="mt-1 text-xs text-slate-500">{item.label}</dt>
            </div>
          );
        })}
      </dl>
    </section>
  );
}