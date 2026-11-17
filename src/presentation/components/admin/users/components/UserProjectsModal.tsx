'use client';

import { Modal } from '@/presentation/components/ui/Modal';

import type { UserProjectsModalProps } from '@/presentation/components/admin/users/types/users.types';

import { ModalHeader } from './projects/ModalHeader';
import { ProjectCard } from './projects/ProjectCard';
import { ProjectSkeleton } from './projects/ProjectSkeleton';
import { EmptyState, ErrorState } from './projects/EmptyState';

export function UserProjectsModal({
  data,
  isLoading,
  isOpen,
  onClose,
}: UserProjectsModalProps) {
  const projects = data?.projects ?? [];
  const totalProjects = data?.totalProjects ?? projects.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="overflow-hidden">

        {/* HEADER + RESUMEN */}
        <ModalHeader totalProjects={totalProjects} />

        {/* CONTENIDO */}
        <div className="p-5 sm:p-6">

          {isLoading ? (
            <ProjectSkeleton />
          ) : data ? (
            <>
              {/* LISTADO */}
              {projects.length === 0 ? (
                <EmptyState />
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Listado de proyectos
                    </h4>

                    <span className="text-xs text-slate-400">
                      {projects.length} registros
                    </span>
                  </div>

                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <ErrorState />
          )}
        </div>
      </div>
    </Modal>
  );
}