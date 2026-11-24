import {
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  Trash2,
  XCircle,
} from 'lucide-react';
import type { ActionConfirmVariant } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import type { CampaignModerationAction } from '../hooks/useCampaignsActions';

export interface CampaignActionModalConfig {
  variant: ActionConfirmVariant;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  reasonPlaceholder: string;
  requireReason?: boolean;
  warning?: React.ReactNode;
}

export function getCampaignActionConfig(
  action: CampaignModerationAction,
  title: string
): CampaignActionModalConfig {
  switch (action) {
    case 'APPROVE':
      return {
        variant: 'success',
        icon: <CheckCircle2 className="w-5 h-5" aria-hidden="true" />,
        title: '¿Aprobar campaña?',
        description: <>¿Estás seguro de que deseas aprobar la campaña <strong>{title}</strong>?</>,
        confirmLabel: 'Aprobar campaña',
        reasonPlaceholder: 'Indica el motivo de la aprobación...',
      };
    case 'REJECT':
      return {
        variant: 'danger',
        icon: <XCircle className="w-5 h-5" aria-hidden="true" />,
        title: '¿Rechazar campaña?',
        description: <>¿Estás seguro de que deseas rechazar la campaña <strong>{title}</strong>?</>,
        confirmLabel: 'Rechazar campaña',
        reasonPlaceholder: 'Indica el motivo del rechazo...',
        requireReason: true,
      };
    case 'SUSPEND':
      return {
        variant: 'warning',
        icon: <XCircle className="w-5 h-5" aria-hidden="true" />,
        title: '¿Suspender campaña?',
        description: <>¿Estás seguro de que deseas suspender la campaña <strong>{title}</strong>?</>,
        confirmLabel: 'Suspender campaña',
        reasonPlaceholder: 'Indica el motivo de la suspensión...',
        requireReason: true,
      };
    case 'REACTIVATE':
      return {
        variant: 'success',
        icon: <PlayCircle className="w-5 h-5" aria-hidden="true" />,
        title: '¿Reactivar campaña?',
        description: <>¿Estás seguro de que deseas reactivar la campaña <strong>{title}</strong>?</>,
        confirmLabel: 'Reactivar campaña',
        reasonPlaceholder: 'Indica el motivo de la reactivación...',
      };
    case 'DELETE':
    default:
      return {
        variant: 'danger',
        icon: <Trash2 className="w-5 h-5" aria-hidden="true" />,
        title: '¿Eliminar campaña?',
        description: <>¿Estás seguro de que deseas eliminar la campaña <strong>{title}</strong>?</>,
        confirmLabel: 'Eliminar campaña',
        reasonPlaceholder: 'Indica el motivo de la eliminación...',
        warning: (
          <>
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <span>Esta acción no se puede deshacer</span>
          </>
        ),
      };
  }
}
