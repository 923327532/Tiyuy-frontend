'use client';

import { useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMapView } from '@/presentation/hooks/useMapView';
import { PropertyMapSidebar } from './PropertyMapSidebar';
import { MapFilters, MapSearchResult } from '@/core/domain/entities/MapTypes';
import { Menu, X } from 'lucide-react';

// Cargar PropertyMapView dinámicamente (solo cliente, sin SSR)
const PropertyMapView = dynamic(
  () => import('./PropertyMapView').then((mod) => mod.PropertyMapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

interface PropertyMapModalProps {
  /** Función de búsqueda que recibe filtros y retorna MapSearchResult */
  searchFn: (filters: MapFilters) => Promise<MapSearchResult>;
  /** Filtros iniciales para cargar al abrir */
  initialFilters?: MapFilters;
  /** Etiqueta para el tipo de item (ej: "propiedad", "proyecto") */
  itemLabel?: string;
  itemLabelPlural?: string;
  /** URL base para los links de detalle */
  detailBaseUrl?: string;
}

export function PropertyMapModal({
  searchFn,
  initialFilters,
  itemLabel,
  itemLabelPlural,
  detailBaseUrl,
}: PropertyMapModalProps) {
  const {
    isOpen,
    searchResult,
    isLoading,
    error,
    selectedItemId,
    closeMap,
    search,
    selectItem,
    openMap,
  } = useMapView({ searchFn });

  // Abrir el mapa automáticamente al montar el modal
  useEffect(() => {
    openMap(initialFilters);
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelectItem = useCallback(
    (id: number | null) => {
      selectItem(id);
    },
    [selectItem]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Modal fullscreen */}
      <div className="flex h-screen w-screen">
        {/* Sidebar (30% ancho en desktop, oculto en mobile) */}
        <div className="hidden lg:block w-[380px] xl:w-[420px] flex-shrink-0 border-r border-[var(--border-color)]">
          <PropertyMapSidebar
            searchResult={searchResult}
            isLoading={isLoading}
            error={error}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            onClose={closeMap}
            itemLabel={itemLabel}
            itemLabelPlural={itemLabelPlural}
            detailBaseUrl={detailBaseUrl}
          />
        </div>

        {/* Mapa (70% en desktop, 100% en mobile) */}
        <div className="flex-1 relative min-h-0">
          {/* Botón cerrar en mobile */}
          <button
            onClick={closeMap}
            className="lg:hidden absolute top-4 left-4 z-[1000] bg-[var(--bg-card)]/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-[var(--bg-card)] transition-colors"
            aria-label="Cerrar mapa"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          {/* Botón toggle sidebar en mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 z-[1000] bg-[var(--bg-card)]/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-[var(--bg-card)] transition-colors"
            onClick={() => {
              const sidebar = document.getElementById('mobile-map-sidebar');
              if (sidebar) {
                sidebar.classList.toggle('translate-y-0');
                sidebar.classList.toggle('translate-y-full');
              }
            }}
            aria-label="Ver items"
          >
            <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          <PropertyMapView
            searchResult={searchResult}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Sidebar mobile (bottom sheet) */}
      <div
        id="mobile-map-sidebar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] h-[45vh] bg-[var(--bg-primary)] rounded-t-2xl shadow-2xl translate-y-0 transition-transform duration-300 ease-in-out overflow-hidden"
      >
        {/* Handle para arrastrar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border-color)]" />
        </div>
        <div className="h-full overflow-hidden">
          <PropertyMapSidebar
            searchResult={searchResult}
            isLoading={isLoading}
            error={error}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            onClose={closeMap}
            itemLabel={itemLabel}
            itemLabelPlural={itemLabelPlural}
            detailBaseUrl={detailBaseUrl}
          />
        </div>
      </div>
    </div>
  );
}
