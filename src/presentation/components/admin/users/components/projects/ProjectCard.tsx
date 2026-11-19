'use client';

import { MapPin, Building2 } from 'lucide-react';
import type { UserProjectSummary } from '@/core/domain/entities/Admin';
import { ProjectImage } from './ProjectImage';
import { ProjectStatus } from './ProjectStatus';
import { ProjectPhase } from './ProjectPhase';

interface ProjectCardProps {
  project: UserProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="group rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-[#B8CED5] hover:bg-[#FAFCFD] hover:shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* INFORMACIÓN */}
        <div className="flex min-w-0 items-center gap-3">
          <ProjectImage src={project.coverImageUrl} name={project.name} />

          <div className="min-w-0 flex-1">
            <h5 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#164E63]">
              {project.name || 'Proyecto sin nombre'}
            </h5>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />

                {[project.district, project.city]
                  .filter(Boolean)
                  .join(', ') || 'Ubicación no disponible'}
              </span>

              <ProjectPhase phase={project.phase} />
            </div>
          </div>
        </div>

        {/* ESTADO Y UNIDADES */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <ProjectStatus status={project.status} />

          {typeof project.totalUnits === 'number' &&
            typeof project.availableUnits === 'number' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />

                <span className="tabular-nums">
                  {project.availableUnits}/{project.totalUnits}
                </span>

                disponibles
              </span>
            )}
        </div>
      </div>
    </article>
  );
}