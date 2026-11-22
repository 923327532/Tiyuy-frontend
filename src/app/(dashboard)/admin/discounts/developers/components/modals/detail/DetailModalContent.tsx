/**
 * Detail modal shell for developer subscription discounts
 */

import { Modal } from '@/presentation/components/ui/Modal';
import { X, Percent, DollarSign, CreditCard } from 'lucide-react';
import {
  DeveloperSubscriptionDiscount,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { getStatusBadgeClass, getStatusLabel, getTypeLabel, getScopeLabel } from './detailHelpers';
import DetailInfoGrid from './DetailInfoGrid';
import DetailActions from './DetailActions';

interface DetailModalContentProps {
  isOpen: boolean;
  onClose: () => void;
  discount: DeveloperSubscriptionDiscount | null;
  onEdit: (discount: DeveloperSubscriptionDiscount) => void;
  onViewUsageHistory: (discount: DeveloperSubscriptionDiscount) => void;
  canManage: boolean;
}

export default function DetailModalContent({
  isOpen,
  onClose,
  discount,
  onEdit,
  onViewUsageHistory,
  canManage,
}: DetailModalContentProps) {
  if (!discount) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white rounded-2xl p-0 max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-teal-800 font-bold text-base sm:text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-white truncate">Detalle del Descuento</h3>
                <p className="text-[10px] sm:text-xs text-teal-100 truncate">
                  ID: {discount.id} • {discount.developerName}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 sm:p-1.5 hover:bg-teal-600 rounded-lg transition-colors text-white flex-shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Status & Type Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(discount.status)}`}>
              {discount.isExpired && discount.status === 'ACTIVE' && (
                <>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                </>
              )}
              {getStatusLabel(discount.status)}
              {discount.isExpired && discount.status === 'ACTIVE' && ' (Expirado)'}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200">
              {discount.type === 'PERCENTAGE' ? <Percent className="h-3 w-3 mr-1" /> : <DollarSign className="h-3 w-3 mr-1" />}
              {getTypeLabel(discount.type)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <CreditCard className="h-3 w-3 mr-1" />
              {getScopeLabel(discount.applicabilityScope)}
            </span>
          </div>

          {/* Main Info Grid */}
          <DetailInfoGrid discount={discount} />

          {/* Actions */}
          {canManage && (
            <DetailActions
              discount={discount}
              onEdit={onEdit}
              onViewUsageHistory={onViewUsageHistory}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
