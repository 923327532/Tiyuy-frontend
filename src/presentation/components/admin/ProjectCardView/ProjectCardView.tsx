/** Grid de tarjetas de proyectos, alineado con PropertiesCardView. */

'use client';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { ProjectCard } from './ProjectCard';
import '@/presentation/components/admin/projects/components/styles/projects-cards.css';

interface ProjectCardViewProps {
  projects: ProjectAdminItem[];
  onViewProject: (project: ProjectAdminItem) => void;
}

export function ProjectCardView({ projects, onViewProject }: ProjectCardViewProps) {
  return (
    <div className="projects-cards-container">
      <ul className="projects-card-grid">
        {projects.map((project) => (
          <li key={project.id} className="h-full min-w-0">
            <ProjectCard project={project} onClick={onViewProject} />
          </li>
        ))}
      </ul>
    </div>
  );
}
