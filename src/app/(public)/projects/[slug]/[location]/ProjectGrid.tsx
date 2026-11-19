import { ProjectSummary } from '@/core/domain/entities/Project';
import { ProjectCard } from '@/presentation/components/project/ProjectCard/ProjectCard';
import { Building2 } from 'lucide-react';

interface ProjectGridProps {
  projects: ProjectSummary[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-center mb-4">
          <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-700 animate-pulse" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          No se encontraron proyectos
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Intenta con otros filtros o ubicación.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}