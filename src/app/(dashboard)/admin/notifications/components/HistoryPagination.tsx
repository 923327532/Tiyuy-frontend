'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryPaginationProps {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function HistoryPagination({
  totalPages,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: HistoryPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
    return startPage + i;
  }).filter(num => num < totalPages);

  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(0);
            }}
            className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>
          <span className="text-sm text-gray-500 ml-2">
            {startItem}-{endItem} de {totalElements}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  onClick={() => onPageChange(totalPages - 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages - 1
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}