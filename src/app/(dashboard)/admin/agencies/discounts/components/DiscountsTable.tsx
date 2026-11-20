'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DeveloperDiscountCode, PaginatedResponse } from '../types';
import { getStatusBadgeClass, getStatusLabel } from '../utils';

interface DiscountsTableProps {
  isLoading: boolean;
  error: string | null;
  data: PaginatedResponse<DeveloperDiscountCode> | null;
  hasFilters: boolean;
  currentPage: number;
  pageSize: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  onClearFilters: () => void;
  onToggleStatus: (discount: DeveloperDiscountCode, newStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED') => void;
  onDeleteDiscount: (discount: DeveloperDiscountCode) => void;
}

export function DiscountsTable({
  isLoading,
  error,
  data,
  hasFilters,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  onClearFilters,
  onToggleStatus,
  onDeleteDiscount,
}: DiscountsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-500" />
          <span className="ml-3 text-sm font-medium text-slate-500">Cargando descuentos...</span>
        </div>
      ) : error ? (
        <div className="px-6 py-12 text-center text-sm text-rose-600">Error: {error}</div>
      ) : !data?.content?.length ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">No se encontraron descuentos</p>
          <p className="mt-1 text-sm text-slate-500">
            {hasFilters ? 'Intenta ajustar tu búsqueda o filtros.' : 'Aún no hay códigos de descuento registrados.'}
          </p>
          {hasFilters && (
            <button type="button" onClick={onClearFilters} className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Código</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Inmobiliaria</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contacto</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Descuento</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Usos</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Válido Desde</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Válido Hasta</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.content.map((discount) => (
                <tr key={discount.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <code className="font-mono text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{discount.code}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{discount.developer.name}</div>
                    <div className="text-xs text-slate-500">ID: {discount.developer.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{discount.developer.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-teal-700">{discount.discountPercentage}%</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700 font-medium">
                    {discount.usedCount} / {discount.maxUses ? discount.maxUses.toLocaleString() : '∞'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(discount.status)}`}>
                      {getStatusLabel(discount.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">
                    {new Date(discount.validFrom).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">
                    {discount.validUntil ? new Date(discount.validUntil).toLocaleDateString('es-PE') : 'Sin expiración'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(
                          discount,
                          discount.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                        )}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {discount.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDiscount(discount)}
                        className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>
              Mostrando <strong>{(currentPage * pageSize) + 1}</strong> a <strong>{Math.min((currentPage + 1) * pageSize, data.totalElements)}</strong> de <strong>{data.totalElements}</strong>
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
              {currentPage + 1} / {data.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(data.totalPages - 1, p + 1))}
              disabled={currentPage >= data.totalPages - 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
