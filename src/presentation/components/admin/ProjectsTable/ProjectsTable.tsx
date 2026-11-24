'use client';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { DataTable, type Column } from '@/presentation/components/ui/DataTable';
import type { ProjectModerationAction } from '@/presentation/components/admin/projects/hooks/useProjectsActions';
import '@/presentation/components/admin/properties/components/styles/properties-table.css';
import '@/presentation/components/admin/projects/components/styles/projects-table.css';
import { ProjectRowActions } from '@/presentation/components/admin/projects/components/table/ProjectRowActions';
import { formatProjectDate } from '@/presentation/components/admin/projects/utils/projectFormat';

interface ProjectsTableProps {
  projects: ProjectAdminItem[];
  isLoading?: boolean;
  selectedProjects: ProjectAdminItem[];
  onSelectionChange: (projects: ProjectAdminItem[]) => void;
  onViewProject: (project: ProjectAdminItem) => void;
  onModerateProject: (project: ProjectAdminItem, action: ProjectModerationAction) => void;
  onToggleFeatured: (project: ProjectAdminItem) => void;
  onDisableProject: (project: ProjectAdminItem) => void;
  onEnableProject: (project: ProjectAdminItem) => void;
  canModerate?: boolean;
  canDelete?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Publicado',
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  DRAFT: 'Borrador',
  SUSPENDED: 'Suspendido',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residencial',
  COMMERCIAL: 'Comercial',
  INDUSTRIAL: 'Industrial',
  MIXED_USE: 'Mixto',
};

const PHASE_LABELS: Record<string, string> = {
  PLANNING: 'Planificación',
  PRE_SALE: 'Pre venta',
  SALE: 'En venta',
  CONSTRUCTION: 'Construcción',
  COMPLETED: 'Completado',
};

function statusVariant(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'PUBLISHED' || status === 'ACTIVE' || status === 'COMPLETED') return 'success';
  if (status === 'PAUSED') return 'warning';
  if (status === 'SUSPENDED' || status === 'CANCELLED') return 'danger';
  return 'neutral';
}

function phaseVariant(phase: string): 'neutral' | 'info' | 'success' | 'warning' {
  if (phase === 'SALE') return 'success';
  if (phase === 'PRE_SALE' || phase === 'CONSTRUCTION') return 'info';
  if (phase === 'PLANNING') return 'warning';
  return 'neutral';
}

function formatPrice(min: number, max: number): string {
  const format = (value: number) => {
    const amount = value || 0;
    if (amount >= 1_000_000) return `S/ ${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `S/ ${Math.round(amount / 1_000)}K`;
    return `S/ ${amount.toLocaleString('es-PE')}`;
  };
  return `${format(min)} - ${format(max)}`;
}

export function ProjectsTable({
  projects,
  isLoading,
  selectedProjects,
  onSelectionChange,
  onViewProject,
  onModerateProject,
  onToggleFeatured,
  onDisableProject,
  onEnableProject,
  canModerate = false,
}: ProjectsTableProps) {
  const columns: Column<ProjectAdminItem>[] = [
    {
      key: 'name',
      label: 'Proyecto',
      width: '230px',
      render: (_value, project) => (
        <div className="projects-identity">
          <div className="projects-identity__thumb">
            {project.coverImageUrl ? (
              <img src={project.coverImageUrl} alt={project.name} />
            ) : (
              <span className="projects-identity__fallback">
                {project.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="projects-identity__info">
            <span className="projects-cell-primary" title={project.name}>
              {project.name}
            </span>
            <span className="projects-cell-secondary" title={project.district || project.city}>
              {project.district || project.city || 'Sin ubicación'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'developerName',
      label: 'Desarrollador',
      width: '160px',
      render: (_value, project) => (
        <div className="projects-cell-stack projects-cell-owner">
          <span className="projects-cell-primary" title={project.developerName}>
            {project.developerName}
          </span>
          <span className="projects-cell-secondary" title={project.developerEmail}>
            {project.developerEmail}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      width: '120px',
      minWidth: '120px',
      render: (value) => (
        <Badge variant={statusVariant(String(value))} size="sm" className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {STATUS_LABELS[String(value)] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      width: '110px',
      minWidth: '110px',
      render: (value) => (
        <Badge variant="info" size="sm" className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {TYPE_LABELS[String(value)] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'phase',
      label: 'Fase',
      width: '120px',
      minWidth: '120px',
      render: (value) => (
        <Badge variant={phaseVariant(String(value))} size="sm" className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {PHASE_LABELS[String(value)] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'priceRange',
      label: 'Precio',
      width: '130px',
      render: (_value, project) => (
        <span className="projects-cell-price">
          {formatPrice(project.priceRange?.min ?? 0, project.priceRange?.max ?? 0)}
        </span>
      ),
    },
    {
      key: 'units',
      label: 'Unidades',
      width: '110px',
      render: (_value, project) => (
        <div className="projects-cell-stack">
          <span className="projects-cell-primary">{project.totalUnits ?? 0}</span>
          <span className="projects-cell-secondary">
            {project.soldUnits ?? 0} vend. / {project.availableUnits ?? 0} disp.
          </span>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Fecha Inicio',
      width: '110px',
      render: (_value, project) => {
        const raw = project as ProjectAdminItem & {
          fechaInicio?: Date | string;
          start_date?: Date | string;
        };
        return (
          <span className="projects-cell-secondary">
            {formatProjectDate(project.startDate ?? raw.fechaInicio ?? raw.start_date)}
          </span>
        );
      },
    },
    {
      key: 'estimatedDeliveryDate',
      label: 'Fecha Entrega',
      width: '110px',
      render: (_value, project) => {
        const raw = project as ProjectAdminItem & {
          fechaEntrega?: Date | string;
          estimated_delivery?: Date | string;
        };
        return (
          <span className="projects-cell-secondary">
            {formatProjectDate(
              project.estimatedDeliveryDate ?? raw.fechaEntrega ?? raw.estimated_delivery
            )}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '130px',
      align: 'center',
      render: (_value, project) => (
        <ProjectRowActions
          project={project}
          canModerate={canModerate}
          onView={onViewProject}
          onModerate={onModerateProject}
          onToggleFeatured={onToggleFeatured}
          onDisable={onDisableProject}
          onEnable={onEnableProject}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={projects}
      columns={columns}
      rowKey="id"
      selectedRows={selectedProjects}
      onSelectionChange={onSelectionChange}
      onRowClick={onViewProject}
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron proyectos"
      className="projects-table__container"
    />
  );
}
