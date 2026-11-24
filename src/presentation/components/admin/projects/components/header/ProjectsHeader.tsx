'use client';

import { ProjectsBanner } from './ProjectsBanner';

interface Props {
  className?: string;
}

export function ProjectsHeader({ className = '' }: Props) {
  return (
    <section aria-label="Encabezado de gestión de proyectos" className={`users-header ${className}`.trim()}>
      <ProjectsBanner />
    </section>
  );
}
