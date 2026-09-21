/**
 * Bulk Actions Bar Component
 * Bottom bar when items are selected for mass operations
 */

'use client';

import { Play, Pause, Trash2, Download, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onPublish: () => void;
  onPause: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
  isProcessing?: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onPublish,
  onPause,
  onDelete,
  onExport,
  onClear,
  isProcessing,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 sm:left-1/2 right-0 sm:right-auto sm:-translate-x-1/2 z-50 bg-white rounded-none sm:rounded-xl shadow-xl border-t sm:border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 sm:min-w-[500px] sm:max-w-[95vw] lg:min-w-[600px]">
      <div className="flex items-center justify-between sm:justify-start gap-3 border-b sm:border-b-0 sm:border-r border-gray-200 pb-2 sm:pb-0 sm:pr-4">
        <span className="text-xs sm:text-sm font-medium text-gray-900">
          {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
        </span>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Limpiar seleccion"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <span className="text-[10px] sm:text-sm text-gray-500 mr-1 sm:mr-2 hidden sm:inline">Acciones masivas:</span>

        <button
          onClick={onPublish}
          disabled={isProcessing}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Publicar</span>
        </button>

        <button
          onClick={onPause}
          disabled={isProcessing}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50"
        >
          <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Pausar</span>
        </button>

        <button
          onClick={onDelete}
          disabled={isProcessing}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-50 text-red-700 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>

        <button
          onClick={onExport}
          disabled={isProcessing}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 text-gray-700 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>
    </div>
  );
}
