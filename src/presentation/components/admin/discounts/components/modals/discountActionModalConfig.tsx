import { AlertTriangle, CheckCircle2, Trash2, XCircle } from 'lucide-react';
import type { ActionConfirmVariant } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';

export type DiscountAction = 'activate' | 'deactivate' | 'delete';

interface DiscountActionConfig {
  variant: ActionConfirmVariant;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  reasonPlaceholder: string;
  requireReason?: boolean;
  warning?: React.ReactNode;
}

/** Configuración de los modales de acción compartidos con Usuarios/Campañas. */
export function getDiscountActionConfig(
  action: DiscountAction,
  code: string
): DiscountActionConfig {
  if (action === 'activate') {
    return {
      variant: 'success',
      icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
      title: '¿Activar descuento?',
      description: <>El código <strong>{code}</strong> volverá a estar disponible para su uso.</>,
      confirmLabel: 'Activar descuento',
      reasonPlaceholder: 'Indica el motivo de la activación...',
    };
  }

  if (action === 'deactivate') {
    return {
      variant: 'warning',
      icon: <XCircle className="h-5 w-5" aria-hidden="true" />,
      title: '¿Desactivar descuento?',
      description: <>El código <strong>{code}</strong> dejará de aplicarse temporalmente.</>,
      confirmLabel: 'Desactivar descuento',
      reasonPlaceholder: 'Indica el motivo de la desactivación...',
      requireReason: true,
    };
  }

  return {
    variant: 'danger',
    icon: <Trash2 className="h-5 w-5" aria-hidden="true" />,
    title: '¿Eliminar descuento?',
    description: <>Se eliminará definitivamente el código <strong>{code}</strong>.</>,
    confirmLabel: 'Eliminar descuento',
    reasonPlaceholder: 'Indica el motivo de la eliminación...',
    requireReason: true,
    warning: (
      <>
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <span>Esta acción no se puede deshacer</span>
      </>
    ),
  };
}
