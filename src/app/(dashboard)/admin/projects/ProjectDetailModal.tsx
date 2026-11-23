/**
 * Project Detail Modal Component
 * Estética blanca y limpia, con header/footer fijos y un único scroll central.
 */

'use client';

import { X } from 'lucide-react';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import { Chip } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';

import { ProjectActivityCard } from './components/ProjectActivityCard';
import { ProjectInfoCard } from './components/ProjectInfoCard';
import { getProjectInitials } from '@/presentation/components/admin/projects/utils/projectFormat';

interface ProjectDetailModalProps {
  project: ProjectAdminItem | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEnableProject: () => void;
  onModerate: (action: 'APPROVE' | 'SUSPEND') => void;
  onDisableProject: () => void;
  onToggleFeatured: () => void;
  onNotifyDeveloper: () => void;
  isEnabling: boolean;
  isDisabling: boolean;
  isTogglingFeatured: boolean;
}

const COMPACT_SECONDARY =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-[#0f2e3a] transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';
const PRIMARY_BUTTON =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#0f2e3a] px-2.5 text-[11px] font-medium text-white transition hover:bg-[#164e63] disabled:cursor-not-allowed disabled:opacity-60';
const DANGER_BUTTON =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#b94b59] px-2.5 text-[11px] font-medium text-white transition hover:bg-[#9f1239] disabled:cursor-not-allowed disabled:opacity-60';

const PROJECT_STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  COMPLETED: 'Completado',
  SUSPENDED: 'Suspendido',
  CANCELLED: 'Cancelado',
};

const STATUS_TONE: Record<string, 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
  DRAFT: 'neutral',
  PUBLISHED: 'success',
  ACTIVE: 'success',
  PAUSED: 'warning',
  COMPLETED: 'info',
  SUSPENDED: 'danger',
  CANCELLED: 'danger',
};

function ProjectStatusChip({ project }: { project: ProjectAdminItem }) {
  return (
    <Chip tone={STATUS_TONE[project.status] ?? 'neutral'}>
      {PROJECT_STATUS_LABEL[project.status] ?? project.status}
    </Chip>
  );
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onEnableProject,
  onModerate,
  onDisableProject,
  onToggleFeatured,
  onNotifyDeveloper,
  isEnabling,
  isTogglingFeatured,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const isDisabled = !project.isActive || project.status === 'SUSPENDED';
  const primaryAction = project.status === 'PUBLISHED' || project.status === 'ACTIVE'
    ? 'SUSPEND'
    : 'APPROVE';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="user-detail-modal__surface !flex !h-full !max-h-[90vh] !max-w-2xl !flex-col !overflow-hidden">
        <header className="user-detail-modal__header shrink-0 !bg-white">
          {project.coverImageUrl ? (
            <img src={project.coverImageUrl} alt="" className="user-detail-modal__avatar" />
          ) : (
            <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
              {getProjectInitials(project.name)}
            </span>
          )}

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title={project.name}>{project.name}</h3>
            <p className="user-detail-modal__email" title={project.developerEmail}>
              {project.developerName || 'Sin desarrollador'} · {project.developerEmail}
            </p>
            <div className="user-detail-modal__badges">
              <ProjectStatusChip project={project} />
              {project.isFeatured && (
                <span className="user-detail-modal__role-badge user-detail-modal__role-badge--admin">
                  Destacado
                </span>
              )}
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--user">
                #{project.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="user-detail-modal__close-btn"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="user-detail-modal__content min-h-0 flex-1 !bg-white">
          <div className="flex flex-col gap-4">
            <ProjectInfoCard project={project} />
            <ProjectActivityCard projectId={project.id} />
          </div>
        </div>

        <footer className="user-detail-modal__footer shrink-0 overflow-x-auto">
          <div className="flex min-w-max items-center justify-between gap-2 whitespace-nowrap">
            <button type="button" className={COMPACT_SECONDARY} onClick={onClose}>
              Cerrar
            </button>
            <div className="flex items-center gap-2">
              <button type="button" className={COMPACT_SECONDARY} onClick={onNotifyDeveloper}>
                Notificar
              </button>
              <button
                type="button"
                className={COMPACT_SECONDARY}
                onClick={onToggleFeatured}
                disabled={isTogglingFeatured || (!project.isFeatured && project.status !== 'PUBLISHED')}
                title={!project.isFeatured && project.status !== 'PUBLISHED' ? 'Solo se pueden destacar proyectos publicados' : undefined}
              >
                {isTogglingFeatured ? 'Procesando...' : project.isFeatured ? 'Quitar destacado' : 'Destacar'}
              </button>
              {isDisabled ? (
                <button
                  type="button"
                  className={PRIMARY_BUTTON}
                  onClick={onEnableProject}
                  disabled={isEnabling}
                >
                  {isEnabling ? 'Habilitando...' : 'Habilitar'}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={PRIMARY_BUTTON}
                    onClick={() => onModerate(primaryAction)}
                  >
                    {primaryAction === 'SUSPEND' ? 'Pausar' : 'Publicar'}
                  </button>
                  <button type="button" className={DANGER_BUTTON} onClick={onDisableProject}>
                    Deshabilitar
                  </button>
                </>
              )}
            </div>
          </div>
        </footer>
      </div>
    </Modal>
  );
}
