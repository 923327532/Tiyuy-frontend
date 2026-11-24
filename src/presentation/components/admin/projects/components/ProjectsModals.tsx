'use client';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { ActionConfirmModal } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import { ProjectDetailModal } from '@/app/(dashboard)/admin/projects/ProjectDetailModal';
import { ProjectNotifyModal } from '@/app/(dashboard)/admin/projects/ProjectNotifyModal';
import { getProjectActionConfig } from '../config/projectActionModalConfig';
import type { ProjectModerationAction } from '../hooks/useProjectsActions';

interface Props {
  project: ProjectAdminItem | null;
  isViewOpen: boolean;
  isModerateOpen: boolean;
  isNotifyOpen: boolean;
  isDisableOpen: boolean;
  disableReason: string;
  isEnabling: boolean;
  isDisabling: boolean;
  isModerating?: boolean;
  isNotifying?: boolean;
  isTogglingFeatured: boolean;
  initialModerateAction?: ProjectModerationAction;
  onCloseView: () => void;
  onCloseModerate: () => void;
  onCloseNotify: () => void;
  onCloseDisable: () => void;
  onDisableReasonChange: (value: string) => void;
  onEnable: () => void;
  onRequestModerate: (action: ProjectModerationAction) => void;
  onRequestDisable: () => void;
  onToggleFeatured: () => void;
  onRequestNotify: () => void;
  onModerate: (action: ProjectModerationAction, reason?: string) => void;
  onNotify: (subject: string, message: string, includeDetails: boolean) => void;
  onDisable: () => void;
}

export function ProjectsModals({
  project,
  isViewOpen,
  isModerateOpen,
  isNotifyOpen,
  isDisableOpen,
  disableReason,
  isEnabling,
  isDisabling,
  isModerating = false,
  isNotifying = false,
  isTogglingFeatured,
  initialModerateAction,
  onCloseView,
  onCloseModerate,
  onCloseNotify,
  onCloseDisable,
  onDisableReasonChange,
  onEnable,
  onRequestModerate,
  onRequestDisable,
  onToggleFeatured,
  onRequestNotify,
  onModerate,
  onNotify,
  onDisable,
}: Props) {
  if (!project) return null;

  const moderateConfig = getProjectActionConfig(initialModerateAction ?? 'APPROVE', project.name);
  const disableConfig = getProjectActionConfig('DEACTIVATE', project.name);

  return (
    <>
      <ProjectDetailModal
        project={project}
        isLoading={false}
        isOpen={isViewOpen}
        onClose={onCloseView}
        onEnableProject={onEnable}
        onModerate={onRequestModerate}
        onDisableProject={onRequestDisable}
        onToggleFeatured={onToggleFeatured}
        onNotifyDeveloper={onRequestNotify}
        isEnabling={isEnabling}
        isDisabling={isDisabling}
        isTogglingFeatured={isTogglingFeatured}
      />

      <ActionConfirmModal
        isOpen={isModerateOpen}
        onClose={onCloseModerate}
        onConfirm={(reason) => onModerate(initialModerateAction ?? 'APPROVE', reason)}
        isPending={isModerating}
        resetKey={`${project.id}-${initialModerateAction ?? 'APPROVE'}`}
        {...moderateConfig}
      />

      <ActionConfirmModal
        isOpen={isDisableOpen}
        onClose={onCloseDisable}
        onConfirm={onDisable}
        isPending={isDisabling}
        reason={disableReason}
        onReasonChange={onDisableReasonChange}
        resetKey={project.id}
        {...disableConfig}
      />

      <ProjectNotifyModal
        project={project}
        isOpen={isNotifyOpen}
        isPending={isNotifying}
        onSend={onNotify}
        onCancel={onCloseNotify}
      />
    </>
  );
}
