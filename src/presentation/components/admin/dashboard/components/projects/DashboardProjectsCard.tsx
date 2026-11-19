'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { DashboardProjectsCardProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { ChartCard } from '@/presentation/components/ui/Card';

import { SalesHeader } from './SalesHeader';
import { UnitsDistribution } from './UnitsDistribution';
import { ProjectsProgress } from './ProjectsProgress';
import { ProjectsSummary } from './ProjectsSummary';

export function DashboardProjectsCard({
  stats,
  loading,
  unavailable,
}: DashboardProjectsCardProps) {
  return (
    <ChartCard
      title="Proyectos inmobiliarios"
      description="Ventas de unidades y avance de obra"
      action={
        <Link
          href="/admin/projects"
          className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-[#164E63] transition-colors hover:bg-[#E0F2FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E63]/30"
        >
          Ver proyectos
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      }
      loading={loading}
      error={unavailable ? 'No se pudo cargar la información de proyectos' : undefined}
    >
      {stats && (
        <div className="projects-card-entry">
          {/* Indicador principal de ventas */}
          <SalesHeader stats={stats} />

          {/* Distribución de unidades */}
          <UnitsDistribution stats={stats} />

          {/* Indicadores de avance */}
          <ProjectsProgress stats={stats} />

          {/* Resumen de proyectos */}
          <ProjectsSummary stats={stats} />
        </div>
      )}
    </ChartCard>
  );
}