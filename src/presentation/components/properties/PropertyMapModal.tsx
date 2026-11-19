'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyMap } from '@/presentation/hooks/usePropertyMap';
import { PropertyMapView } from './PropertyMapView';
import { PropertyMapSidebar } from './PropertyMapSidebar';
import { PropertyFilter } from '@/core/domain/entities/PropertyFilter';
import { X } from 'lucide-react';

interface PropertyMapModalProps {
  filters?: PropertyFilter;
  onClose: () => void;
}

export function PropertyMapModal({ filters, onClose }: PropertyMapModalProps) {
  const {
    searchResult,
    isLoading,
    selectedPropertyId,
    search,
    selectProperty,
    reset,
  } = usePropertyMap();

  const [page, setPage] = useState(0);
  // Mobile: mostrar 2 cards; Desktop: 10
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setItemsPerPage(window.innerWidth < 640 ? 2 : 10);
    const handleResize = () => setItemsPerPage(window.innerWidth < 640 ? 2 : 10);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load all properties when modal opens (sin filtros = todos)
  useEffect(() => {
    search(filters || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page when results change
  useEffect(() => {
    setPage(0);
  }, [searchResult?.properties?.length]);

  // Al cerrar el modal NO reseteamos el store porque comparte el estado
  // con el mini mapa del padre. Si reseteamos, el mini mapa se queda sin datos.
  // En su lugar, el padre se encarga de refrescar cuando sea necesario.

  const allProperties = searchResult?.properties || [];
  const totalPages = Math.max(1, Math.ceil(allProperties.length / itemsPerPage));
  const paginatedProperties = allProperties.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div className="relative w-full h-full flex md:flex-row">
        {/* Sidebar - solo desktop */}
        <div className="hidden md:block md:w-72 lg:w-80 bg-white md:rounded-l-2xl overflow-hidden z-10 md:h-full">
          <PropertyMapSidebar
            properties={paginatedProperties}
            selectedPropertyId={selectedPropertyId}
            isLoading={isLoading}
            totalResults={searchResult?.totalResults || 0}
            coverageInfo={searchResult ? {
              coverage: searchResult.effectiveCoverage,
              searchedDistrict: searchResult.requestedArea,
              nearbyDistricts: searchResult.districtsIncluded || [],
              message: searchResult.coverageMessage || '',
            } : null}
            onSelectProperty={selectProperty}
            onClose={onClose}
          />
          {/* Pagination Desktop */}
          {!isLoading && allProperties.length > itemsPerPage && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
              <button onClick={() => setPage((p: number) => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-light text-brand-dark hover:bg-brand-light-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Anterior</button>
              <span className="text-xs text-brand-dark font-semibold">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage((p: number) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-light text-brand-dark hover:bg-brand-light-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Siguiente</button>
            </div>
          )}
        </div>

        {/* Mobile: contador flotante + mapa a pantalla completa */}
        <div className="md:hidden absolute top-4 left-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{allProperties.length}</span>
            <span className="text-xs text-gray-500">propiedades</span>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center">
          <X className="w-4 h-4 text-gray-700" />
        </button>

        {/* Map - full height on mobile */}
        <div className="flex-1 h-full">
          <PropertyMapView
            properties={allProperties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={selectProperty}
            requestedDistrict={searchResult?.requestedArea}
            districtsIncluded={searchResult?.districtsIncluded}
          />
        </div>
      </div>
    </div>
  );
}
