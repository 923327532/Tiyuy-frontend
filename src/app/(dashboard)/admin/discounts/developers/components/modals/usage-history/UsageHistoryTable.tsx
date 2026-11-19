/**
 * Summary stats, table and pagination for discount usage history
 */

import { Button } from '@/presentation/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { DiscountUsageHistory } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';

interface UsageHistoryTableProps {
  usageHistory: PaginatedResponse<DiscountUsageHistory>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalElements: number;
}

export default function UsageHistoryTable({
  usageHistory,
  currentPage,
  setCurrentPage,
  totalPages,
  totalElements,
}: UsageHistoryTableProps) {
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Total usos</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{totalElements}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Total desc. PEN</p>
          <p className="text-lg sm:text-xl font-bold text-teal-700 mt-1">
            S/{usageHistory.content.reduce((sum: number, u: DiscountUsageHistory) => sum + u.discountAmountPen, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Total desc. USD</p>
          <p className="text-lg sm:text-xl font-bold text-blue-700 mt-1">
            ${usageHistory.content.reduce((sum: number, u: DiscountUsageHistory) => sum + u.discountAmountUsd, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Contrataciones / Renovaciones</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            {usageHistory.content.filter((u: DiscountUsageHistory) => u.operationType === 'NEW_CONTRACT').length} / {usageHistory.content.filter((u: DiscountUsageHistory) => u.operationType === 'RENEWAL').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Inmobiliaria</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Plan</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Original</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Descuento</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Final</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Moneda</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Tipo</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fecha</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Referencias</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usageHistory.content.map((usage: DiscountUsageHistory) => (
              <tr key={usage.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{usage.developerName}</div>
                  <div className="text-[10px] text-slate-500">ID: {usage.developerId}</div>
                </td>
                <td className="px-4 py-3 text-slate-700 text-sm">{usage.planName}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="text-teal-700 font-medium">S/{usage.originalAmountPen.toLocaleString()}</div>
                  {usage.originalAmountUsd > 0 && (
                    <div className="text-blue-700 font-medium text-[10px]">${usage.originalAmountUsd.toLocaleString()}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="text-red-600 font-medium">-S/{usage.discountAmountPen.toLocaleString()}</div>
                  {usage.discountAmountUsd > 0 && (
                    <div className="text-red-600 font-medium text-[10px]">-${usage.discountAmountUsd.toLocaleString()}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="text-emerald-700 font-bold">S/{usage.finalAmountPen.toLocaleString()}</div>
                  {usage.finalAmountUsd > 0 && (
                    <div className="text-emerald-700 font-bold text-[10px]">${usage.finalAmountUsd.toLocaleString()}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {usage.currency}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    usage.operationType === 'NEW_CONTRACT'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }`}>
                    {usage.operationType === 'NEW_CONTRACT' ? 'Contratación' : 'Renovación'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 text-sm">
                  {format(new Date(usage.usedAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-4 py-3 text-[10px] text-slate-500">
                  {usage.subscriptionId && <div>Sub: {usage.subscriptionId}</div>}
                  {usage.paymentId && <div>Pago: {usage.paymentId}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-slate-200 gap-3">
          <span className="text-sm text-slate-600">
            Página {currentPage + 1} de {totalPages} ({totalElements} registros)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
