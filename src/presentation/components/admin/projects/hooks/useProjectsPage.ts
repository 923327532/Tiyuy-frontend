'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import type { ProjectModerationAction } from './useProjectsActions';
import { useProjectsForAdmin, useProjectStats } from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import {
  EMPTY_PROJECTS_FILTERS,
  filterProjects,
  hasAdvancedFilters,
  type ProjectsFilterCriteria,
} from '../utils/projectFilters';
import { exportProjectsExcel } from '../utils/projectExport';
import { useProjectsActions } from './useProjectsActions';

export function useProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [advanced, setAdvanced] = useState<ProjectsFilterCriteria>(EMPTY_PROJECTS_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedProjects, setSelectedProjects] = useState<ProjectAdminItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectAdminItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModerateModalOpen, setIsModerateModalOpen] = useState(false);
  const [moderateAction, setModerateAction] = useState<ProjectModerationAction>('APPROVE');
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [disableReason, setDisableReason] = useState('');

  const { hasPermission } = usePermissions();
  const canModerateProjects = hasPermission('PROJECTS_MODERATE');
  const canDeleteProjects = hasPermission('PROJECTS_DELETE');

  const { data: projectsData, isLoading, refetch } = useProjectsForAdmin(
    statusFilter !== 'all' ? statusFilter : undefined,
    searchQuery || undefined,
    { page: currentPage - 1, size: pageSize }
  );
  const { data: projectStats, isLoading: statsLoading } = useProjectStats();

  const actions = useProjectsActions({
    refetch: () => void refetch(),
    closeView: () => setIsViewModalOpen(false),
    closeDisable: () => setIsDisableModalOpen(false),
    clearDisableReason: () => setDisableReason(''),
    closeModerate: () => setIsModerateModalOpen(false),
    closeNotify: () => setIsNotifyModalOpen(false),
  });

  const projects = projectsData?.content ?? [];
  const filteredProjects = useMemo(() => filterProjects(projects, advanced), [projects, advanced]);
  const hasFilter =
    Boolean(searchQuery.trim()) || statusFilter !== 'all' || hasAdvancedFilters(advanced);

  const setAdvancedField = (field: keyof ProjectsFilterCriteria, value: string | number) => {
    setAdvanced((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAdvanced(EMPTY_PROJECTS_FILTERS);
    setCurrentPage(1);
  };

  const handleViewProject = (project: ProjectAdminItem) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleRequestDisable = (project: ProjectAdminItem) => {
    setSelectedProject(project);
    setDisableReason('');
    setIsDisableModalOpen(true);
  };

  const handleRequestNotify = (project: ProjectAdminItem) => {
    setSelectedProject(project);
    setIsNotifyModalOpen(true);
  };

  const handleRequestModerate = (
    project: ProjectAdminItem,
    action: ProjectModerationAction = 'APPROVE'
  ) => {
    setSelectedProject(project);
    setModerateAction(action);
    setIsModerateModalOpen(true);
  };

  const handleExport = () => {
    const toExport = selectedProjects.length > 0 ? selectedProjects : filteredProjects;
    if (toExport.length === 0) {
      toast.error('No hay proyectos para exportar');
      return;
    }
    void exportProjectsExcel(toExport, {
      Búsqueda: searchQuery,
      Estado: statusFilter === 'all' ? '' : statusFilter,
      'Ciclo de vida': advanced.lifecycleFilter,
      Tipo: advanced.typeFilter,
      Ubicación: advanced.locationFilter,
      'Precio máx.': advanced.maxPrice || '',
      Unidades: advanced.unitsFilter,
    });
    toast.success('Proyectos exportados', {
      description: `${toExport.length} proyectos descargados en Excel`,
    });
  };

  const handleSelectProject = (project: ProjectAdminItem, selected: boolean) => {
    setSelectedProjects((prev) =>
      selected ? [...prev, project] : prev.filter((p) => p.id !== project.id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedProjects(selected ? filteredProjects : []);
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    advanced,
    setAdvancedField,
    showAdvancedFilters,
    setShowAdvancedFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedProjects,
    setSelectedProjects,
    selectedProject,
    isViewModalOpen,
    setIsViewModalOpen,
    isModerateModalOpen,
    setIsModerateModalOpen,
    moderateAction,
    isNotifyModalOpen,
    setIsNotifyModalOpen,
    isDisableModalOpen,
    setIsDisableModalOpen,
    disableReason,
    setDisableReason,
    canModerateProjects,
    canDeleteProjects,
    projects: filteredProjects,
    projectStats,
    statsLoading,
    isLoading,
    totalElements: projectsData?.totalElements ?? 0,
    hasFilter,
    refetch: () => void refetch(),
    ...actions,
    handleClearFilters,
    handleViewProject,
    handleRequestDisable,
    handleRequestNotify,
    handleRequestModerate,
    handleExport,
    handleSelectProject,
    handleSelectAll,
  };
}
