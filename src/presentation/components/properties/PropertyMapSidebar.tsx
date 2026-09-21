 'use client';

import React from 'react';
import { MapPropertySummary, MapCoverageInfo } from '@/core/domain/entities/Property';
import { PropertyMapCard } from './PropertyMapCard';
import { CheckCircle, Image, Info, TriangleAlert, X } from 'lucide-react';

interface PropertyMapSidebarProps {
  properties: MapPropertySummary[];
  selectedPropertyId: number | null;
  isLoading: boolean;
  totalResults: number;
  coverageInfo: MapCoverageInfo | null;
  onSelectProperty: (id: number | null) => void;
  onClose: () => void;
}

export function PropertyMapSidebar({
  properties,
  selectedPropertyId,
  isLoading,
  totalResults,
  coverageInfo,
  onSelectProperty,
  onClose,
}: PropertyMapSidebarProps) {
  return (
    <div className="hidden md:flex md:flex-col md:h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Propiedades</h2>
          {!isLoading && (
            <p className="text-sm text-gray-500">
              {totalResults} {totalResults === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Coverage message - colores según nivel */}
      {coverageInfo?.message && (
        <div className={`mx-4 mt-3 px-3 py-2 rounded-lg border ${
          coverageInfo.coverage === 'EXACT_DISTRICT' 
            ? 'bg-green-50 border-green-200' 
            : coverageInfo.coverage === 'NEARBY_DISTRICTS'
              ? 'bg-amber-50 border-amber-200'
              : coverageInfo.coverage === 'NO_RESULTS'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-2">
            {/* Icono según nivel */}
            {coverageInfo.coverage === 'EXACT_DISTRICT' && (
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            {coverageInfo.coverage === 'NEARBY_DISTRICTS' && (
              <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            )}
            {coverageInfo.coverage === 'NO_RESULTS' && (
              <TriangleAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            {coverageInfo.coverage !== 'EXACT_DISTRICT' && coverageInfo.coverage !== 'NEARBY_DISTRICTS' && coverageInfo.coverage !== 'NO_RESULTS' && (
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${
                coverageInfo.coverage === 'EXACT_DISTRICT' 
                  ? 'text-green-700' 
                  : coverageInfo.coverage === 'NEARBY_DISTRICTS'
                    ? 'text-amber-700'
                    : coverageInfo.coverage === 'NO_RESULTS'
                      ? 'text-red-700'
                      : 'text-blue-700'
              }`}>{coverageInfo.message}</p>
              
              {/* Mostrar distritos cercanos cuando es NEARBY_DISTRICTS */}
              {coverageInfo.coverage === 'NEARBY_DISTRICTS' && coverageInfo.nearbyDistricts.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {coverageInfo.nearbyDistricts
                    .filter(d => d.toLowerCase() !== coverageInfo.searchedDistrict?.toLowerCase())
                    .slice(0, 5)
                    .map((district, i) => (
                      <span key={i} className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                        {district}
                      </span>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Buscando propiedades...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && properties.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No se encontraron propiedades en esta zona</p>
            <p className="text-xs text-gray-400 mt-1">Intenta buscar en otra ubicación</p>
          </div>
        </div>
      )}

      {/* Property list - Desktop: vertical list; Mobile: 2 cards grid */}
      {!isLoading && properties.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Desktop */}
          <div className="hidden md:flex md:flex-col gap-3">
            {properties.map((property) => (
              <PropertyMapCard
                key={property.id}
                property={property}
                isSelected={selectedPropertyId === property.id}
                onClick={() => onSelectProperty(
                  selectedPropertyId === property.id ? null : property.id
                )}
                requestedDistrict={coverageInfo?.searchedDistrict}
              />
            ))}
          </div>
          {/* Mobile: grid 2 columnas, sin scroll */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {properties.map((property) => (
              <PropertyMapCard
                key={property.id}
                property={property}
                isSelected={selectedPropertyId === property.id}
                onClick={() => onSelectProperty(
                  selectedPropertyId === property.id ? null : property.id
                )}
                requestedDistrict={coverageInfo?.searchedDistrict}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
