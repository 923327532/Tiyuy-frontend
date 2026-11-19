/**
 * PropertyCardView Component
 * Displays properties in a card/grid layout for admin management.
 * Follows SOLID principles: Single responsibility (only card rendering),
 * Open/Closed (extensible via render props), Liskov substitution (works with any data shape).
 */

'use client';

import { useState } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { LoadingState, EmptyState } from '@/presentation/components/admin/AdminUIStates';
import { ChevronLeft, ChevronRight, Grid3X3, LayoutList, Eye, Star, Ban, CheckCircle, MessageSquare } from 'lucide-react';

interface CardAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  condition?: (item: T) => boolean;
}

interface PropertyCardViewProps<T> {
  data: T[];
  loading?: boolean;
  error?: string;
  renderCard: (item: T) => React.ReactNode;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
  };
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onViewDetails?: (item: T) => void;
  actions?: CardAction<T>[];
}

export function PropertyCardView<T extends Record<string, any>>({
  data,
  loading = false,
  error,
  renderCard,
  pagination,
  emptyState,
  onViewDetails,
  actions
}: PropertyCardViewProps<T>) {
  if (loading) {
    return <LoadingState message="Cargando propiedades..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4 bg-red-50 rounded-lg p-4 inline-block">
          <span className="text-lg">⚠️</span>
          <p className="mt-2 font-medium">Error: {error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyState?.title || 'No se encontraron propiedades'}
        description={emptyState?.description}
        action={emptyState?.action}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={item.id || index} className="group">
            {renderCard(item)}
            
            {/* Quick Actions Overlay */}
            {actions && actions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(item)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    Ver
                  </button>
                )}
                {actions
                  .filter(action => !action.condition || action.condition(item))
                  .map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => action.onClick(item)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                        action.variant === 'primary'
                          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200'
                          : action.variant === 'danger'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-[var(--bg-card)] px-3 sm:px-6 py-3 sm:py-4 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {((pagination.page - 1) * pagination.size) + 1}-{Math.min(pagination.page * pagination.size, pagination.total)} de{' '}
              {pagination.total}
            </span>

            <select
              value={pagination.size}
              onChange={(e) => pagination.onSizeChange(Number(e.target.value))}
              className="border border-[var(--border-color)] rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[var(--bg-secondary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-[var(--text-primary)]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border-[var(--border-color)] hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] px-2 sm:px-3 py-1.5 sm:py-2 bg-[var(--bg-secondary)] rounded-lg whitespace-nowrap">
              {pagination.page} / {Math.ceil(pagination.total / pagination.size)}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border-[var(--border-color)] hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
