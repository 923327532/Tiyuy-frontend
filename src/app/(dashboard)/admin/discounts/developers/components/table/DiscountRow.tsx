/**
 * Single discount row for DiscountsTable
 */

import { IconButton } from '@/presentation/components/ui/Button';
import { format } from 'date-fns';
import {
  DeveloperSubscriptionDiscount,
  DiscountStatus,
  DiscountType,
  DiscountApplicabilityScope,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { Eye, RotateCw, Edit, AlertTriangle, Trash2, Percent, DollarSign, Calendar, RefreshCw } from 'lucide-react';

export interface DiscountRowProps {
  discount: DeveloperSubscriptionDiscount;
  canManage: boolean;
  onViewDetail: (discount: DeveloperSubscriptionDiscount) => void;
  onViewUsageHistory: (discount: DeveloperSubscriptionDiscount) => void;
  onEdit: (discount: DeveloperSubscriptionDiscount) => void;
  onToggleStatus: (discount: DeveloperSubscriptionDiscount, newStatus: DiscountStatus) => void;
  onRevoke: (discount: DeveloperSubscriptionDiscount) => void;
  getStatusBadgeClass: (status: DiscountStatus) => string;
  getStatusLabel: (status: DiscountStatus) => string;
  getTypeLabel: (type: DiscountType) => string;
  getScopeLabel: (scope: DiscountApplicabilityScope) => string;
  getDiscountDisplay: (discount: DeveloperSubscriptionDiscount) => string;
}

export default function DiscountRow({
  discount,
  canManage,
  onViewDetail,
  onViewUsageHistory,
  onEdit,
  onToggleStatus,
  onRevoke,
  getStatusBadgeClass,
  getStatusLabel,
  getTypeLabel,
  getScopeLabel,
  getDiscountDisplay,
}: DiscountRowProps) {
  const isExpired = discount.validUntil && new Date(discount.validUntil) < new Date();
  const usagePercentage = discount.usageLimit ? Math.round((discount.currentUsage / discount.usageLimit) * 100) : 0;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-slate-900">{discount.developerName}</div>
        {discount.developerRuc && (
          <div className="text-xs text-slate-500">RUC: {discount.developerRuc}</div>
        )}
        <div className="text-[10px] text-slate-400">ID: {discount.developerId}</div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200">
          {discount.type === 'PERCENTAGE' ? <Percent className="h-3 w-3 mr-1" /> : <DollarSign className="h-3 w-3 mr-1" />}
          {getTypeLabel(discount.type)}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="font-semibold text-teal-700">{getDiscountDisplay(discount)}</span>
        {(discount.maxDiscountPen || discount.maxDiscountUsd) && (
          <div className="text-[9px] text-gray-500 mt-0.5">
            Máx: {discount.maxDiscountPen ? `S/${discount.maxDiscountPen}` : ''} {discount.maxDiscountUsd ? `$${discount.maxDiscountUsd}` : ''}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {getScopeLabel(discount.applicabilityScope)}
        </span>
        {discount.applicablePlanCodes && discount.applicablePlanCodes.length > 0 && (
          <div className="text-[9px] text-gray-500 mt-0.5 truncate max-w-[120px] mx-auto" title={discount.applicablePlanCodes.join(', ')}>
            Planes: {discount.applicablePlanCodes.join(', ')}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-center text-slate-700 font-medium">
        {discount.usageLimit ? `${discount.currentUsage} / ${discount.usageLimit}` : `${discount.currentUsage} / ∞`}
        {discount.usageLimit && discount.usageLimit > 0 && (
          <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mt-1">
            <div
              className={`h-1 rounded-full ${usagePercentage >= 80 ? 'bg-red-500' : usagePercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, (discount.currentUsage / discount.usageLimit) * 100)}%` }}
            ></div>
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600 text-sm">
        <div className="flex items-center gap-1 text-[10px]">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span>{format(new Date(discount.validFrom), 'dd/MM/yyyy')}</span>
        </div>
        {discount.validUntil && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span>{format(new Date(discount.validUntil), 'dd/MM/yyyy')}</span>
          </div>
        )}
        {!discount.validUntil && (
          <div className="text-[10px] text-gray-400 mt-0.5">Sin expiración</div>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(discount.status)}`}>
          {getStatusLabel(discount.status)}
        </span>
        {isExpired && discount.status === 'ACTIVE' && (
          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-800">Expirado</span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600 text-sm">
        <div>Total: <span className="font-medium">{discount.currentUsage}</span></div>
        <div className="text-[10px] text-gray-500">Creado: {format(new Date(discount.createdAt), 'dd/MM/yyyy')}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <IconButton
            variant="ghost"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            ariaLabel="Ver detalles"
            onClick={() => onViewDetail(discount)}
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon={<RotateCw className="h-4 w-4" />}
            ariaLabel="Historial de uso"
            onClick={() => onViewUsageHistory(discount)}
          />
          {canManage && (
            <>
              <IconButton
                variant="ghost"
                size="sm"
                icon={<Edit className="h-4 w-4" />}
                ariaLabel="Editar"
                onClick={() => onEdit(discount)}
              />
              {discount.status === 'ACTIVE' && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<AlertTriangle className="h-4 w-4" />}
                  ariaLabel="Desactivar"
                  onClick={() => onToggleStatus(discount, 'INACTIVE')}
                  className="text-amber-600 hover:text-amber-900 hover:bg-amber-50"
                />
              )}
              {discount.status === 'INACTIVE' && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw className="h-4 w-4" />}
                  ariaLabel="Activar"
                  onClick={() => onToggleStatus(discount, 'ACTIVE')}
                  className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50"
                />
              )}
              {['ACTIVE', 'INACTIVE'].includes(discount.status) && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  ariaLabel="Revocar"
                  onClick={() => onRevoke(discount)}
                  className="text-red-600 hover:text-red-900 hover:bg-red-50"
                />
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
