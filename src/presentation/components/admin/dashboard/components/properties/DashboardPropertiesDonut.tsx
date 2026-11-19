'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { DashboardPropertiesDonutProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { ChartCard } from '@/presentation/components/ui/Card';

import { STAGES, INACTIVE_SEGMENT } from './Config';
import { getTotalProperties, getSource, buildSegments } from './utils';
import { DonutChart } from './DonutChart';
import { DonutLegend } from './DonutLegend';

export function DashboardPropertiesDonut({
  stats,
  byStatus,
}: DashboardPropertiesDonutProps) {
  const source = getSource(stats, byStatus);
  const total = getTotalProperties(stats, byStatus);
  const segments = buildSegments(source, STAGES, INACTIVE_SEGMENT, total);

  return (
    <ChartCard
      title="Cartera de publicaciones"
      description="Dónde está cada propiedad hoy"
      action={
        <Link
          href="/admin/properties"
          className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-[#164E63] transition-colors hover:bg-[#E0F2FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E63]/30"
        >
          Ver todas
          <ChevronRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      }
    >
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-7">
        {/* Gráfico donut */}
        <DonutChart segments={segments} total={total} />

        {/* Distribución de propiedades */}
        <DonutLegend segments={segments} />
      </div>
    </ChartCard>
  );
}