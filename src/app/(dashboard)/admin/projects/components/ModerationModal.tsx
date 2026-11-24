'use client';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { ActionConfirmModal } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import { getProjectActionConfig } from '@/presentation/components/admin/projects/config/projectActionModalConfig';
import type { ProjectModerationAction } from '@/presentation/components/admin/projects/hooks/useProjectsActions';

interface ModerationModalProps {
  project: ProjectAdminItem;
  initialAction?: ProjectModerationAction;
  onConfirm: (action: ProjectModerationAction, reason?: string) => void;
  onCancel: () => void;
}

/**
 * Compatibilidad con el barrel de componentes de Projects.
 * El diseño y flujo son los del modal compartido de Users/Projects.
 */
export function ModerationModal({
  project,
  initialAction = 'APPROVE',
  onConfirm,
  onCancel,
}: ModerationModalProps) {
  const config = getProjectActionConfig(initialAction, project.name);

  return (
    <ActionConfirmModal
      isOpen
      onClose={onCancel}
      onConfirm={(reason) => onConfirm(initialAction, reason)}
      {...config}
    />
  );
}
