'use client';

import { useState } from 'react';
import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import type { ProjectModerationAction } from '@/presentation/components/admin/projects/hooks/useProjectsActions';
import {
  UsersEmptyState,
  UsersErrorState,
  UsersLoadingState,
} from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { ProjectsTable } from '@/presentation/components/admin/ProjectsTable';
import { ProjectCardView } from '@/presentation/components/admin/ProjectCardView';

interface Props {
  projects: ProjectAdminItem[];
  isLoading: boolean;
  error?: string;
  hasFilter: boolean;
  canModerate: boolean;
  selectedProjects: ProjectAdminItem[];
  onSelectionChange: (projects: ProjectAdminItem[]) => void;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewProject: (project: ProjectAdminItem) => void;
  onModerateProject: (project: ProjectAdminItem, action: ProjectModerationAction) => void;
  onToggleFeatured: (project: ProjectAdminItem) => void;
  onDisableProject: (project: ProjectAdminItem) => void;
  onEnableProject: (project: ProjectAdminItem) => void;
  onClearFilters: () => void;
  onRetry?: () => void;
}

export function ProjectsListPanel({
  projects,
  isLoading,
  error,
  hasFilter,
  canModerate,
  selectedProjects,
  onSelectionChange,
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  onViewProject,
  onModerateProject,
  onToggleFeatured,
  onDisableProject,
  onEnableProject,
  onClearFilters,
  onRetry,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const hasProjects = projects.length > 0;

  const pagination = (
    <UsersPagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalElements={totalElements}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      itemLabel="proyectos"
    />
  );

  const table = (
    <ProjectsTable
      projects={projects}
      isLoading={isLoading}
      selectedProjects={selectedProjects}
      onSelectionChange={onSelectionChange}
      onViewProject={onViewProject}
      onModerateProject={onModerateProject}
      onToggleFeatured={onToggleFeatured}
      onDisableProject={onDisableProject}
      onEnableProject={onEnableProject}
      canModerate={canModerate}
    />
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      {!isLoading && hasProjects && <UsersViewToggle value={viewMode} onChange={setViewMode} />}

      {isLoading && <UsersLoadingState message="Cargando proyectos..." />}
      {Boolean(error) && (
        <UsersErrorState error={error} onRetry={onRetry ?? onClearFilters} />
      )}
      {!isLoading && !error && !hasProjects && (
        <UsersEmptyState
          onClear={onClearFilters}
          title="No se encontraron proyectos"
          description={
            hasFilter
              ? 'Intenta ajustar tu búsqueda o los filtros aplicados.'
              : 'Aún no hay proyectos registrados.'
          }
        />
      )}

      {!isLoading && !error && hasProjects && (
        <>
          {viewMode === 'table' ? table : (
            <ProjectCardView projects={projects} onViewProject={onViewProject} />
          )}
          {pagination}
        </>
      )}
    </div>
  );
}
