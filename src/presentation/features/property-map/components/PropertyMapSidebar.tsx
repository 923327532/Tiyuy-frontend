'use client';

import { useState, useMemo } from 'react';
import { MapSearchResult, MapItem } from '@/core/domain/entities/MapTypes';
import { PropertyMapCard } from './PropertyMapCard';
import { groupByDistrict } from '../utils/mapUtils';
import { X, Layers, List, Map as MapIcon, Loader2 } from 'lucide-react';

interface PropertyMapSidebarProps {
  searchResult: MapSearchResult | null;
  isLoading: boolean;
  error: string | null;
  selectedItemId: number | null;
  onSelectItem: (id: number | null) => void;
  onClose: () => void;
  /** Etiqueta para el tipo de item (ej: "propiedad", "proyecto") */
  itemLabel?: string;
  itemLabelPlural?: string;
  /** URL base para los links de detalle */
  detailBaseUrl?: string;
}

type ViewMode = 'list' | 'grouped';

export function PropertyMapSidebar({
  searchResult,
  isLoading,
  error,
  selectedItemId,
  onSelectItem,
  onClose,
  itemLabel = 'propiedad',
  itemLabelPlural = 'propiedades',
  detailBaseUrl = '/property/',
}: PropertyMapSidebarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const groupedItems = useMemo(() => {
    if (!searchResult?.items) return new Map();
    return groupByDistrict(searchResult.items);
  }, [searchResult]);

  const handleItemClick = (id: number) => {
    onSelectItem(selectedItemId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] capitalize">
            {searchResult ? (
              <>{searchResult.totalResults} {searchResult.totalResults === 1 ? itemLabel : itemLabelPlural}</>
            ) : (
              <>{itemLabelPlural}</>
            )}
          </h2>
          {searchResult && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {searchResult.requestedArea}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle view */}
          <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-[var(--bg-card)] shadow-sm text-blue-600' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              title="Vista lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grouped' ? 'bg-[var(--bg-card)] shadow-sm text-blue-600' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              title="Agrupar por distrito"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            title="Cerrar mapa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
            <p className="text-sm capitalize">Buscando {itemLabelPlural}...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <p className="text-xs text-red-400 mt-1">Intenta de nuevo más tarde</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && searchResult && searchResult.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
            <MapIcon className="w-12 h-12 mb-3 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-secondary)] capitalize">No hay {itemLabelPlural} en esta zona</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Prueba con otros filtros o amplía el área de búsqueda</p>
          </div>
        )}

        {/* List view */}
        {!isLoading && !error && searchResult && searchResult.items.length > 0 && viewMode === 'list' && (
          <div className="space-y-3">
            {/* Deduplicar por ID para evitar que una misma propiedad aparezca varias veces */}
            {Array.from(
              new Map(searchResult.items.map((item) => [item.id, item])).values()
            ).map((item, index) => (
              <PropertyMapCard
                key={`${item.id}-${item.district}-${index}`}
                item={item}
                isSelected={selectedItemId === item.id}
                onSelect={handleItemClick}
                detailBaseUrl={detailBaseUrl}
              />
            ))}
          </div>
        )}

        {/* Grouped view */}
        {!isLoading && !error && searchResult && searchResult.items.length > 0 && viewMode === 'grouped' && (
          <div className="space-y-6">
            {Array.from(groupedItems.entries()).map(([district, items]) => (
              <div key={district}>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {district}
                  <span className="text-xs font-normal text-[var(--text-muted)]">({items.length})</span>
                </h3>
                <div className="space-y-3">
                  {items.map((item: MapItem, idx: number) => (
                    <PropertyMapCard
                      key={`${item.id}-${item.district}-${idx}`}
                      item={item}
                      isSelected={selectedItemId === item.id}
                      onSelect={handleItemClick}
                      detailBaseUrl={detailBaseUrl}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
