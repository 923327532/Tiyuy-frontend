/**
 * Admin Project Management Page
 * Header, KPIs, filtros y listado siguiendo el patrón modular de Agents/Users.
 */

'use client';

import { toast } from 'sonner';

import { BulkActionsBar } from '@/presentation/components/admin/BulkActionsBar';
import { ProjectsHeader } from '@/presentation/components/admin/projects/components/header';
import { ProjectsStats } from '@/presentation/components/admin/projects/components/stats/ProjectsStats';
import { ProjectsOverviewCharts } from '@/presentation/components/admin/projects/components/stats/ProjectsOverviewCharts';
import { ProjectsFiltersBar } from '@/presentation/components/admin/projects/components/filters/ProjectsFiltersBar';
import { ProjectsAdvancedFilters } from '@/presentation/components/admin/projects/components/filters/ProjectsAdvancedFilters';
import { ProjectsListPanel } from '@/presentation/components/admin/projects/components/ProjectsListPanel';
import { ProjectsModals } from '@/presentation/components/admin/projects/components/ProjectsModals';
import { useProjectsPage } from '@/presentation/components/admin/projects/hooks/useProjectsPage';

export default function ProjectsPage() {
  const p = useProjectsPage();

  const handleSearch = (value: string) => {
    p.setSearchQuery(value);
    p.setCurrentPage(1);
  };

  const handleStatus = (value: string) => {
    p.setStatusFilter(value);
    p.setCurrentPage(1);
  };

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <ProjectsHeader />

      <ProjectsStats
        stats={p.projectStats}
        loading={p.statsLoading}
        onSelectStatus={handleStatus}
        onShowAll={() => {
          p.handleClearFilters();
          document.getElementById('projects-list')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <ProjectsOverviewCharts
        stats={p.projectStats}
        projects={p.projects}
        onOpenDetails={() => p.setShowAdvancedFilters(true)}
        onOpenAllProjects={() => {
          p.handleClearFilters();
          document.getElementById('projects-list')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onStatusSelect={(label) => {
          const codes: Record<string, string> = {
            Publicado: 'PUBLISHED',
            Activo: 'ACTIVE',
            Pausado: 'PAUSED',
            Borrador: 'DRAFT',
            Suspendido: 'SUSPENDED',
            Completado: 'COMPLETED',
            Cancelado: 'CANCELLED',
          };
          const valid = ['PUBLISHED', 'ACTIVE', 'PAUSED', 'DRAFT', 'SUSPENDED', 'COMPLETED', 'CANCELLED'];
          handleStatus(codes[label] || (valid.includes(label) ? label : 'all'));
        }}
      />

      <ProjectsFiltersBar
        searchQuery={p.searchQuery}
        onSearchChange={handleSearch}
        statusFilter={p.statusFilter}
        onStatusChange={handleStatus}
        lifecycleFilter={p.advanced.lifecycleFilter}
        onLifecycleChange={(value) => {
          p.setAdvancedField('lifecycleFilter', value);
          p.setCurrentPage(1);
        }}
        hasFilter={p.hasFilter}
        onClearFilters={p.handleClearFilters}
        onToggleFilters={() => p.setShowAdvancedFilters(!p.showAdvancedFilters)}
        onExport={p.handleExport}
      />

      {p.showAdvancedFilters && (
        <ProjectsAdvancedFilters
          typeFilter={p.advanced.typeFilter}
          locationFilter={p.advanced.locationFilter}
          maxPrice={p.advanced.maxPrice}
          unitsFilter={p.advanced.unitsFilter}
          onTypeChange={(value) => p.setAdvancedField('typeFilter', value)}
          onLocationChange={(value) => p.setAdvancedField('locationFilter', value)}
          onMaxPriceChange={(value) => p.setAdvancedField('maxPrice', value)}
          onUnitsChange={(value) => p.setAdvancedField('unitsFilter', value)}
          onApply={() => p.setShowAdvancedFilters(false)}
          onClear={() => {
            p.setAdvancedField('typeFilter', '');
            p.setAdvancedField('locationFilter', '');
            p.setAdvancedField('maxPrice', 0);
            p.setAdvancedField('unitsFilter', '');
            p.setAdvancedField('lifecycleFilter', '');
          }}
          onClose={() => p.setShowAdvancedFilters(false)}
        />
      )}

      <div id="projects-list">
        <ProjectsListPanel
          projects={p.projects}
          isLoading={p.isLoading}
          hasFilter={p.hasFilter}
          canModerate={p.canModerateProjects}
          selectedProjects={p.selectedProjects}
          onSelectionChange={p.setSelectedProjects}
          currentPage={p.currentPage}
          pageSize={p.pageSize}
          totalElements={p.totalElements}
          onPageChange={p.setCurrentPage}
          onPageSizeChange={p.setPageSize}
          onViewProject={p.handleViewProject}
          onModerateProject={p.handleRequestModerate}
          onToggleFeatured={p.handleToggleFeatured}
          onDisableProject={p.handleRequestDisable}
          onEnableProject={(project) => p.handleEnableProject(project)}
          onClearFilters={p.handleClearFilters}
          onRetry={p.refetch}
        />
      </div>

      <BulkActionsBar
        selectedCount={p.selectedProjects.length}
        onPublish={() => toast.info('Funcionalidad en desarrollo')}
        onPause={() => toast.info('Funcionalidad en desarrollo')}
        onDelete={() => toast.info('Funcionalidad en desarrollo')}
        onExport={p.handleExport}
        onClear={() => p.setSelectedProjects([])}
        isProcessing={false}
      />

      <ProjectsModals
        project={p.selectedProject}
        isViewOpen={p.isViewModalOpen}
        isModerateOpen={p.isModerateModalOpen}
        isNotifyOpen={p.isNotifyModalOpen}
        isDisableOpen={p.isDisableModalOpen}
        disableReason={p.disableReason}
        isEnabling={p.enablePending}
        isDisabling={p.disablePending}
        isModerating={p.moderatePending}
        isNotifying={p.notifyPending}
        isTogglingFeatured={p.toggleFeaturedPending}
        initialModerateAction={p.moderateAction}
        onCloseView={() => p.setIsViewModalOpen(false)}
        onCloseModerate={() => p.setIsModerateModalOpen(false)}
        onCloseNotify={() => p.setIsNotifyModalOpen(false)}
        onCloseDisable={() => p.setIsDisableModalOpen(false)}
        onDisableReasonChange={p.setDisableReason}
        onEnable={() => p.selectedProject && p.handleEnableProject(p.selectedProject)}
        onRequestModerate={(action) =>
          p.selectedProject && p.handleRequestModerate(p.selectedProject, action)
        }
        onRequestDisable={() => p.selectedProject && p.handleRequestDisable(p.selectedProject)}
        onToggleFeatured={() => p.selectedProject && p.handleToggleFeatured(p.selectedProject)}
        onRequestNotify={() => p.selectedProject && p.handleRequestNotify(p.selectedProject)}
        onModerate={(action, reason) =>
          p.selectedProject && p.handleModerate(p.selectedProject, action || p.moderateAction, reason)
        }
        onNotify={(subject, message, includeDetails) =>
          p.selectedProject && p.handleNotify(p.selectedProject, subject, message, includeDetails)
        }
        onDisable={() => p.selectedProject && p.handleDisableProject(p.selectedProject, p.disableReason)}
      />
    </div>
  );
}
