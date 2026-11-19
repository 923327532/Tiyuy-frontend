/**
 * Action buttons for Developer Subscription Discount Detail Modal
 */

import { Button } from '@/presentation/components/ui/Button';
import { RotateCcw, Edit, AlertTriangle, RefreshCcw, Trash2 } from 'lucide-react';
import { DeveloperSubscriptionDiscount } from '@/core/domain/entities/DeveloperSubscriptionDiscount';

interface DetailActionsProps {
  discount: DeveloperSubscriptionDiscount;
  onEdit: (discount: DeveloperSubscriptionDiscount) => void;
  onViewUsageHistory: (discount: DeveloperSubscriptionDiscount) => void;
}

export default function DetailActions({ discount, onEdit, onViewUsageHistory }: DetailActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={() => onViewUsageHistory(discount)}
        className="flex-1 sm:flex-initial py-2.5 text-sm font-medium"
      >
        <RotateCcw className="h-4 w-4 mr-1.5" />
        Ver historial de uso
      </Button>
      <Button
        variant="outline"
        onClick={() => onEdit(discount)}
        className="flex-1 sm:flex-initial py-2.5 text-sm font-medium border-teal-600 text-teal-600 hover:bg-teal-50"
      >
        <Edit className="h-4 w-4 mr-1.5" />
        Editar
      </Button>
      {discount.status === 'ACTIVE' && (
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('¿Desactivar este descuento?')) {
              // This would need a callback from parent
            }
          }}
          className="flex-1 sm:flex-initial py-2.5 text-sm font-medium border-amber-600 text-amber-600 hover:bg-amber-50"
        >
          <AlertTriangle className="h-4 w-4 mr-1.5" />
          Desactivar
        </Button>
      )}
      {discount.status === 'INACTIVE' && (
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('¿Activar este descuento?')) {
              // This would need a callback from parent
            }
          }}
          className="flex-1 sm:flex-initial py-2.5 text-sm font-medium border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          <RefreshCcw className="h-4 w-4 mr-1.5" />
          Activar
        </Button>
      )}
      {['ACTIVE', 'INACTIVE'].includes(discount.status) && (
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('¿Revocar este descuento? Esta acción no se puede deshacer.')) {
              // This would need a callback from parent
            }
          }}
          className="flex-1 sm:flex-initial py-2.5 text-sm font-medium border-red-600 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Revocar
        </Button>
      )}
    </div>
  );
}
