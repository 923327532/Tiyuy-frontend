/**
 * Admin Project Management Page
 * Complete project administration with backend integration
 */

'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useProjectsForAdmin,
  useProjectStats,
  useToggleFeaturedProject,
  useDeleteProject,
  useNotifyProjectDeveloper,
  useDisableProjectByAdmin,
  useEnableProjectByAdmin
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { toast } from 'sonner';
import { NotificationModal } from '../properties/NotificationModal';
import { Modal } from '@/presentation/components/ui/Modal';
import { Button } from '@/presentation/components/ui/Button';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectsHeaderStats } from '@/presentation/components/admin/ProjectsHeaderStats';
import { ProjectsFilters } from '@/presentation/components/admin/ProjectsFilters';
import { ProjectsTable } from '@/presentation/components/admin/ProjectsTable';
import { BulkActionsBar } from '@/presentation/components/admin/BulkActionsBar';
import { SalesChart } from '@/presentation/components/admin/SalesChart/SalesChart';
import { ProjectsByStatusChart } from '@/presentation/components/admin/ProjectsByStatusChart/ProjectsByStatusChart';
import { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { ProjectCardView, ProjectCard } from '@/presentation/components/admin/ProjectCardView';
import { LayoutList, Grid3X3 } from 'lucide-react';
import { ModerationModal, ProjectReportsSection, ProjectCommentsSection } from './components';

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedProjects, setSelectedProjects] = useState<ProjectAdminItem[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModerateModalOpen, setIsModerateModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectAdminItem | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const { hasPermission } = usePermissions();
  const canModerateProjects = hasPermission('PROJECTS_MODERATE');
  const canDeleteProjects = hasPermission('PROJECTS_DELETE');

  const { data: projectsData, isLoading, refetch } = useProjectsForAdmin(
    statusFilter !== 'all' ? statusFilter : undefined,
    searchQuery || undefined,
    { page: currentPage - 1, size: pageSize }
  );

  const { data: projectStats, isLoading: statsLoading, error: statsError } = useProjectStats();

  // Debug estadísticas
  const toggleFeaturedMutation = useToggleFeaturedProject();
  const deleteMutation = useDeleteProject();
  const disableProjectMutation = useDisableProjectByAdmin();
  const enableProjectMutation = useEnableProjectByAdmin();
  const notifyDeveloperMutation = useNotifyProjectDeveloper();

  const handleToggleFeatured = async (project: ProjectAdminItem) => {
    try {
      await toggleFeaturedMutation.mutateAsync({
        projectId: project.id,
        featured: !project.isFeatured
      });
      toast.success(project.isFeatured ? 'Destacado removido' : 'Proyecto destacado');
      refetch();
    } catch (error: any) {
      toast.error('Error', { description: error?.message || 'No se pudo actualizar' });
    }
  };

  const handleDeleteProject = async (project: ProjectAdminItem) => {
    if (!confirm(`¿Eliminar "${project.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteMutation.mutateAsync({ projectId: project.id });
      toast.success('Proyecto eliminado');
      refetch();
    } catch (error: any) {
      toast.error('Error al eliminar', { description: error?.message });
    }
  };

  const handleDisableProject = async (project: ProjectAdminItem, reason: string) => {
    try {
      await disableProjectMutation.mutateAsync({
        projectId: project.id,
        reason,
        notifyDeveloper: true
      });
      toast.success('Proyecto deshabilitado');
      setIsDisableModalOpen(false);
      setDisableReason('');
      refetch();
    } catch (error: any) {
      toast.error('Error al deshabilitar', { description: error?.message });
    }
  };

  const handleEnableProject = async (project: ProjectAdminItem) => {
    try {
      await enableProjectMutation.mutateAsync({
        projectId: project.id,
        notifyDeveloper: true
      });
      toast.success('Proyecto habilitado');
      setIsViewModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error('Error al habilitar', { description: error?.message });
    }
  };

  const handleViewProject = (project: ProjectAdminItem) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleExportProjects = () => {
    const projectsToExport = selectedProjects.length > 0 ? selectedProjects : (projectsData?.content || []);
    
    if (projectsToExport.length === 0) {
      toast.error('No hay proyectos para exportar');
      return;
    }

    // Helper para escapar campos CSV correctamente
    const escapeCsv = (value: any): string => {
      const str = String(value ?? '');
      // Si contiene comas, comillas o saltos de línea, envolver en comillas y escapar comillas internas
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    // Cabeceras del CSV
    const headers = [
      'ID',
      'Nombre del Proyecto',
      'Desarrollador',
      'Email del Desarrollador',
      'Tipo',
      'Estado',
      'Ciclo de Vida',
      'Fase',
      'Precio Minimo',
      'Precio Maximo',
      'Unidades Totales',
      'Unidades Vendidas',
      'Unidades Disponibles',
      'Avance Construccion',
      'Vistas',
      'Destacado',
      'Fecha de Creacion'
    ];

    // Filas de datos
    const rows = projectsToExport.map((p: ProjectAdminItem) => [
      p.id,
      p.name,
      p.developerName,
      p.developerEmail,
      p.type,
      p.status,
      p.lifecycleStatus,
      p.phase,
      p.priceRange?.min ?? 0,
      p.priceRange?.max ?? 0,
      p.totalUnits ?? 0,
      p.soldUnits ?? 0,
      p.availableUnits ?? 0,
      `${p.constructionProgress ?? 0}%`,
      p.viewsCount ?? 0,
      p.isFeatured ? 'SI' : 'NO',
      p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES') : ''
    ].map(escapeCsv));

    // Unir todo con separador de líneas CRLF para compatibilidad con Excel
    const csvContent = [headers.join(','), ...rows].join('\r\n');
    
    // Agregar BOM (Byte Order Mark) para UTF-8 - crucial para caracteres especiales en español
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `proyectos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Proyectos exportados', {
      description: `${projectsToExport.length} proyectos descargados en CSV`
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header Stats */}
      <ProjectsHeaderStats stats={projectStats} isLoading={statsLoading} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <ProjectsByStatusChart />
        </div>
      </div>

      {/* Filters */}
      <ProjectsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* View Mode Toggle */}
      <div className="flex items-center justify-end gap-2">
        <div className="bg-white rounded-lg border border-gray-200 p-0.5 sm:p-1 flex gap-0.5 sm:gap-1 shadow-sm">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutList className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tabla</span>
            <span className="sm:hidden">Lista</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
            Tarjetas
          </button>
        </div>
      </div>

      {/* Projects List - Table or Cards */}
      {viewMode === 'table' ? (
        <ProjectsTable
          projects={projectsData?.content || []}
          selectedProjects={selectedProjects}
          onSelectProject={(project, selected) => {
            if (selected) {
              setSelectedProjects([...selectedProjects, project]);
            } else {
              setSelectedProjects(selectedProjects.filter(p => p.id !== project.id));
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedProjects(projectsData?.content || []);
            } else {
              setSelectedProjects([]);
            }
          }}
          onViewProject={(project) => {
            setSelectedProject(project);
            setIsViewModalOpen(true);
          }}
          onModerateProject={(project) => {
            setSelectedProject(project);
            setIsModerateModalOpen(true);
          }}
          onToggleFeatured={handleToggleFeatured}
          onDeleteProject={handleDeleteProject}
          canModerate={canModerateProjects}
          canDelete={canDeleteProjects}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={projectsData?.totalPages || 1}
          totalElements={projectsData?.totalElements || 0}
          numberOfElements={projectsData?.numberOfElements || 0}
          onPageChange={setCurrentPage}
        />
      ) : (
        <ProjectCardView
          data={projectsData?.content || []}
          loading={isLoading}
          renderCard={(project: ProjectAdminItem) => (
            <ProjectCard
              project={project}
              onClick={handleViewProject}
            />
          )}
          pagination={
            projectsData && {
              page: currentPage,
              size: pageSize,
              total: projectsData.totalElements,
              onPageChange: setCurrentPage,
              onSizeChange: setPageSize
            }
          }
          emptyState={{
            title: 'No se encontraron proyectos',
            description: 'Intenta ajustar tu búsqueda o filtros.',
            action: {
              label: 'Limpiar filtros',
              onClick: handleClearFilters
            }
          }}
        />
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedProjects.length}
        onPublish={() => toast.info('Funcionalidad en desarrollo')}
        onPause={() => toast.info('Funcionalidad en desarrollo')}
        onDelete={() => toast.info('Funcionalidad en desarrollo')}
        onExport={handleExportProjects}
        onClear={() => setSelectedProjects([])}
        isProcessing={false}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isLoading={isLoading}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEnableProject={handleEnableProject}
          onDisableProject={(project) => {
            setSelectedProject(project);
            setIsDisableModalOpen(true);
          }}
          onToggleFeatured={handleToggleFeatured}
          onNotifyDeveloper={(project) => {
            setSelectedProject(project);
            setIsNotifyModalOpen(true);
          }}
          isEnabling={enableProjectMutation.isPending}
          isDisabling={disableProjectMutation.isPending}
          isTogglingFeatured={toggleFeaturedMutation.isPending}
        />
      )}

      {/* Moderation Modal */}
      {selectedProject && (
        <Modal isOpen={isModerateModalOpen} onClose={() => setIsModerateModalOpen(false)}>
          <ModerationModal
            project={selectedProject}
            onConfirm={async (action, reason) => {
              try {
                await toggleFeaturedMutation.mutateAsync({ projectId: selectedProject.id, featured: action === 'APPROVE' });
                toast.success('Proyecto moderado');
                setIsModerateModalOpen(false);
                refetch();
              } catch (error: any) {
                toast.error('Error', { description: error?.message });
              }
            }}
            onCancel={() => setIsModerateModalOpen(false)}
          />
        </Modal>
      )}

      {/* Notification Modal */}
      {selectedProject && (
        <Modal isOpen={isNotifyModalOpen} onClose={() => setIsNotifyModalOpen(false)}>
          <NotificationModal
            property={selectedProject as any}
            onSend={async (subject, message, includeDetails) => {
              try {
                await notifyDeveloperMutation.mutateAsync({
                  projectId: selectedProject.id,
                  request: { subject, message, includeProjectDetails: includeDetails }
                });
                toast.success('Notificación enviada');
                setIsNotifyModalOpen(false);
              } catch (error: any) {
                toast.error('Error', { description: error?.message });
              }
            }}
            onCancel={() => setIsNotifyModalOpen(false)}
          />
        </Modal>
      )}

      {/* Disable Project Modal */}
      {selectedProject && (
        <Modal isOpen={isDisableModalOpen} onClose={() => setIsDisableModalOpen(false)}>
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-0">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Deshabilitar Proyecto</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Esta acción deshabilitará el proyecto <strong className="break-words">{selectedProject.name}</strong>.
            </p>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Motivo (requerido)
              </label>
              <textarea
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
                placeholder="Ej: Violación de términos, información incorrecta..."
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="danger"
                onClick={() => handleDisableProject(selectedProject, disableReason)}
                disabled={!disableReason.trim() || disableProjectMutation.isPending}
                className="text-xs sm:text-sm w-full sm:w-auto"
              >
                {disableProjectMutation.isPending ? 'Deshabilitando...' : 'Deshabilitar'}
              </Button>
              <Button variant="outline" onClick={() => { setDisableReason(''); setIsDisableModalOpen(false); }} className="text-xs sm:text-sm w-full sm:w-auto">
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
