'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { MapPropertySummary } from '@/core/domain/entities/Property';
import dynamic from 'next/dynamic';
import { createTiyuyIcon, createColoredPriceIcon } from '@/presentation/components/shared/Map/tiyuyMarkers';
import { CalendarDays, Folder } from 'lucide-react';

const LeafletMap = dynamic(
  () => import('@/presentation/components/shared/Map/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false }
);

interface PropertyMapViewProps {
  properties: MapPropertySummary[];
  selectedPropertyId: number | null;
  onSelectProperty: (id: number | null) => void;
  center?: [number, number];
  zoom?: number;
  /** Distrito solicitado originalmente (para colorear marcadores) */
  requestedDistrict?: string;
  /** Lista de distritos incluidos en la búsqueda */
  districtsIncluded?: string[];
}

export function PropertyMapView({
  properties,
  selectedPropertyId,
  onSelectProperty,
  center,
  zoom = 12,
  requestedDistrict,
  districtsIncluded,
}: PropertyMapViewProps) {
  const mapRef = useRef<any>(null);
  const defaultCenter: [number, number] = [-12.0464, -77.0428];

  const handleMapReady = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // Fit bounds when properties change
  useEffect(() => {
    if (mapRef.current && properties.length > 0) {
      const L = require('leaflet');
      const bounds = L.latLngBounds(
        properties
          .filter((p) => p.latitude && p.longitude)
          .map((p) => [p.latitude, p.longitude] as [number, number])
      );
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [properties]);

  // Center on selected property
  useEffect(() => {
    if (mapRef.current && selectedPropertyId) {
      const prop = properties.find((p) => p.id === selectedPropertyId);
      if (prop?.latitude && prop?.longitude) {
        mapRef.current.setView([prop.latitude, prop.longitude], 16, { animate: true });
      }
    }
  }, [selectedPropertyId, properties]);

  // Formatear precio
  const formatPrice = (price: number | undefined | null): string => {
    if (!price) return '';
    if (price >= 1000000) {
      return `S/ ${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `S/ ${(price / 1000).toFixed(0)}K`;
    }
    return `S/ ${price.toLocaleString('es-PE')}`;
  };

  const markers = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const { Marker, Popup } = require('react-leaflet');

    return properties
      .filter((p) => p.latitude && p.longitude)
      .map((property) => {
        const isSelected = selectedPropertyId === property.id;
        const priceLabel = formatPrice(property.price);
        
        // Determinar el tipo de match para el color del marcador
        let matchType: 'EXACT' | 'NEARBY' | 'EXPANDED' = 'EXPANDED';
        if (requestedDistrict && property.district?.toLowerCase() === requestedDistrict.toLowerCase()) {
          matchType = 'EXACT';
        } else if (districtsIncluded && districtsIncluded.length > 0) {
          matchType = 'NEARBY';
        }
        
        // Usar icono con precio coloreado según origen
        const icon = priceLabel 
          ? createColoredPriceIcon(priceLabel, matchType, isSelected)
          : createTiyuyIcon(isSelected);

        return (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onSelectProperty(isSelected ? null : property.id),
            }}
          >
            <Popup>
              <div 
                className="w-[220px] cursor-pointer"
                onClick={() => window.location.href = `/property/${property.slug || property.id}`}
              >
                {/* Imagen */}
                {property.mainPhotoUrl && (
                  <div className="w-full h-[120px] rounded-t-lg overflow-hidden mb-2">
                    <img 
                      src={property.mainPhotoUrl} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                
                {/* Tipo y transacción */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {property.transactionType === 'RENT' ? 'ALQUILER' : 'VENTA'}
                  </span>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span className="text-[10px] text-gray-500 capitalize">{property.type?.toLowerCase()}</span>
                </div>

                {/* Precio */}
                <p className="text-sm font-bold text-gray-900">
                  S/ {property.price?.toLocaleString('es-PE')}
                </p>

                {/* Título (sin "| Wasyn") */}
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{property.title?.replace(/\s*\|\s*Wasyn\s*$/i, '').trim() || property.title}</p>

                {/* Ubicación */}
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {property.district}, {property.province}
                </p>

                {/* Características */}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                  {property.bedrooms && (
                    <span className="flex items-center gap-0.5">
                      <Folder className="w-3 h-3" />
                      {property.bedrooms}
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="flex items-center gap-0.5">
                      <CalendarDays className="w-3 h-3" />
                      {property.bathrooms}
                    </span>
                  )}
                  {property.area && (
                    <span>{property.area} m²</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      });
  }, [properties, selectedPropertyId, onSelectProperty]);

  return (
    <div className="w-full h-full relative">
      <LeafletMap 
        center={center || defaultCenter} 
        zoom={zoom} 
        className="w-full h-full"
        onMapReady={handleMapReady}
      >
        {markers}
      </LeafletMap>
      
      {/* Mobile: contador de propiedades en la parte inferior */}
      {properties.length > 0 && (
        <div className="md:hidden absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-gray-900">{properties.length}</span>
            <span className="text-sm text-gray-500">propiedades encontradas</span>
          </div>
        </div>
      )}
    </div>
  );
}
