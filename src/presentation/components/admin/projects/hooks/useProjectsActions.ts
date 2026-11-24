'use client';

import { toast } from 'sonner';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import {
  useModerateProject,
  useToggleFeaturedProject,
  useDeleteProject,
  useNotifyProjectDeveloper,
  useDisableProjectByAdmin,
  useEnableProjectByAdmin,
} from '@/presentation/hooks/useAdmin';

export type ProjectModerationAction = 'APPROVE' | 'REJECT' | 'SUSPEND' | 'ACTIVATE' | 'DEACTIVATE';

interface Params {
  refetch: () => void;
  closeView: () => void;
  closeDisable: () => void;
  clearDisableReason: () => void;
  closeModerate: () => void;
  closeNotify: () => void;
}

export function useProjectsActions({
  refetch,
  closeView,
  closeDisable,
  clearDisableReason,
  closeModerate,
  closeNotify,
}: Params) {
  const moderateMutation = useModerateProject();
  const toggleFeaturedMutation = useToggleFeaturedProject();
  const deleteMutation = useDeleteProject();
  const disableProjectMutation = useDisableProjectByAdmin();
  const enableProjectMutation = useEnableProjectByAdmin();
  const notifyDeveloperMutation = useNotifyProjectDeveloper();

  const handleToggleFeatured = async (project: ProjectAdminItem) => {
    if (!project.isFeatured && project.status !== 'PUBLISHED') {
      toast.error('Solo se pueden destacar proyectos publicados');
      return;
    }
    try {
      await toggleFeaturedMutation.mutateAsync({
        projectId: project.id,
        featured: !project.isFeatured,
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
        notifyDeveloper: true,
      });
      toast.success('Proyecto deshabilitado');
      closeDisable();
      clearDisableReason();
      refetch();
    } catch (error: any) {
      toast.error('Error al deshabilitar', { description: error?.message });
    }
  };

  const handleEnableProject = async (project: ProjectAdminItem) => {
    try {
      await enableProjectMutation.mutateAsync({ projectId: project.id, notifyDeveloper: true });
      toast.success('Proyecto habilitado');
      closeView();
      refetch();
    } catch (error: any) {
      toast.error('Error al habilitar', { description: error?.message });
    }
  };

  const handleModerate = async (
    project: ProjectAdminItem,
    action: ProjectModerationAction,
    reason?: string
  ) => {
    try {
      await moderateMutation.mutateAsync({
        projectId: project.id,
        request: { action, reason },
      });
      toast.success('Proyecto moderado');
      closeModerate();
      refetch();
    } catch (error: any) {
      toast.error('Error', { description: error?.message });
    }
  };

  const handleNotify = async (
    project: ProjectAdminItem,
    subject: string,
    message: string,
    includeDetails: boolean
  ) => {
    try {
      await notifyDeveloperMutation.mutateAsync({
        projectId: project.id,
        request: { subject, message, includeProjectDetails: includeDetails },
      });
      toast.success('Notificación enviada');
      closeNotify();
    } catch (error: any) {
      toast.error('Error', { description: error?.message });
    }
  };

  return {
    handleToggleFeatured,
    handleDeleteProject,
    handleDisableProject,
    handleEnableProject,
    handleModerate,
    handleNotify,
    toggleFeaturedPending: toggleFeaturedMutation.isPending,
    disablePending: disableProjectMutation.isPending,
    enablePending: enableProjectMutation.isPending,
    notifyPending: notifyDeveloperMutation.isPending,
    moderatePending: moderateMutation.isPending,
  };
}
