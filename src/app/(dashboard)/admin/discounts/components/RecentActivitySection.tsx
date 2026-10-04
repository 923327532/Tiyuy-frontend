'use client';

import { useState, useCallback } from 'react';
import { useCentralDiscounts } from '@/presentation/hooks/useAdmin';
import { Button } from '@/presentation/components/ui/Button';
import { Clock } from 'lucide-react';

const sourceColors: Record<string, string> = {
  DISCOUNT_CODE: 'bg-indigo-100 text-indigo-700',
  AGENT: 'bg-cyan-100 text-cyan-700',
  DEVELOPER: 'bg-violet-100 text-violet-700',
  AGENCY_PLAN: 'bg-orange-100 text-orange-700',
  USER: 'bg-blue-100 text-blue-700',
};

const sourceLabels: Record<string, string> = {
  DISCOUNT_CODE: 'Codigo',
  AGENT: 'Agente',
  DEVELOPER: 'Inmobiliaria',
  AGENCY_PLAN: 'Plan',
  USER: 'Usuario',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-500',
  INACTIVE: 'bg-gray-400',
  EXPIRED: 'bg-amber-500',
  EXHAUSTED: 'bg-red-500',
  USED: 'bg-blue-500',
};

const PAGE_SIZE = 10;

export default function RecentActivitySection() {
  const [page, setPage] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: discountsData, isLoading } = useCentralDiscounts({
    page,
    size: PAGE_SIZE,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const discounts = discountsData?.content || [];
  const totalElements = discountsData?.totalElements || 0;
  const totalPages = discountsData?.totalPages || 0;

  const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
    setPage(0);
  }, []);

  const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
    setPage(0);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Actividad Reciente</h3>
          <span className="text-xs text-gray-400 font-medium">{totalElements} registros</span>
        </div>

        {/* Date filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 font-medium">Desde:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 font-medium">Hasta:</label>
            <input
              type="date"
              value={dateTo}
              onChange={handleDateToChange}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setPage(0); }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Codigo</th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Origen</th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Descuento</th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Asignado</th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Sin actividad en este periodo</p>
                </td>
              </tr>
            ) : (
              discounts.map((discount, index) => (
                <tr
                  key={`${discount.source || 'UNKNOWN'}-${discount.id ?? 'no-id'}-${discount.code || 'no-code'}-${discount.createdAt || 'no-date'}-${index}`}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColors[discount.status] || 'bg-gray-300'}`} />
                      <span className="text-sm font-medium text-gray-900">{discount.code || 'Sin codigo'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${sourceColors[discount.source] || 'bg-gray-100 text-gray-600'}`}>
                      {sourceLabels[discount.source] || discount.source}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-semibold text-gray-900">{discount.discountPercentage}%</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm text-gray-500">{discount.assignedByName || '-'}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      discount.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      discount.status === 'INACTIVE' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                      discount.status === 'EXPIRED' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      discount.status === 'EXHAUSTED' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {discount.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm text-gray-400">{formatDate(discount.createdAt)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
          <span className="text-xs text-gray-400">
            Pagina {page + 1} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const startPage = Math.max(0, Math.min(page - 2, totalPages - 5));
                const pageNum = startPage + i;
                if (pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
