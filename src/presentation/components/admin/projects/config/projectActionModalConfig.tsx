import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  XCircle,
} from 'lucide-react';

import type { ActionConfirmVariant } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import type { ProjectModerationAction } from '../hooks/useProjectsActions';

export interface ProjectActionModalConfig {
  variant: ActionConfirmVariant;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  reasonPlaceholder: string;
  warning?: React.ReactNode;
}

export function getProjectActionConfig(
  action: ProjectModerationAction,
  name: string
): ProjectActionModalConfig {
  switch (action) {
    case 'APPROVE':
      return {
        variant: 'success',
        icon: <CheckCircle2 className="w-5 h-5" aria-hidden="true" />,
        title: '¿Publicar proyecto?',
        description: <>¿Estás seguro de que deseas publicar el proyecto <strong>{name}</strong>?</>,
        confirmLabel: 'Publicar proyecto',
        reasonPlaceholder: 'Indica el motivo de la publicación...',
      };
    case 'ACTIVATE':
      return {
        variant: 'success',
        icon: <PlayCircle className="w-5 h-5" aria-hidden="true" />,
        title: '¿Activar proyecto?',
        description: <>¿Estás seguro de que deseas activar nuevamente el proyecto <strong>{name}</strong>?</>,
        confirmLabel: 'Activar proyecto',
        reasonPlaceholder: 'Indica el motivo de la activación...',
      };
    case 'SUSPEND':
      return {
        variant: 'warning',
        icon: <PauseCircle className="w-5 h-5" aria-hidden="true" />,
        title: '¿Pausar proyecto?',
        description: <>¿Estás seguro de que deseas pausar temporalmente el proyecto <strong>{name}</strong>?</>,
        confirmLabel: 'Pausar proyecto',
        reasonPlaceholder: 'Indica el motivo de la pausa...',
      };
    case 'REJECT':
      return {
        variant: 'danger',
        icon: <XCircle className="w-5 h-5" aria-hidden="true" />,
        title: '¿Suspender proyecto?',
        description: <>¿Estás seguro de que deseas suspender el proyecto <strong>{name}</strong>?</>,
        confirmLabel: 'Suspender proyecto',
        reasonPlaceholder: 'Indica el motivo de la suspensión...',
      };
    case 'DEACTIVATE':
    default:
      return {
        variant: 'danger',
        icon: <Ban className="w-5 h-5" aria-hidden="true" />,
        title: '¿Deshabilitar proyecto?',
        description: <>¿Estás seguro de que deseas deshabilitar el proyecto <strong>{name}</strong>?</>,
        confirmLabel: 'Deshabilitar proyecto',
        reasonPlaceholder: 'Indica el motivo de la deshabilitación...',
        warning: (
          <>
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <span>El proyecto dejará de estar disponible para los usuarios</span>
          </>
        ),
      };
  }
}
