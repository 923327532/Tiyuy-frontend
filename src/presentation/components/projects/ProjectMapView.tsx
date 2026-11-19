'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { ProjectMapSummary } from '@/core/domain/entities/PropertyMapResult';
import dynamic from 'next/dynamic';
import { createTiyuyIcon, createPriceIcon, createCompactPriceIcon, createCompactTiyuyIcon } from '@/presentation/components/shared/Map/tiyuyMarkers';
import { Building } from 'lucide-react';

const LeafletMap = dynamic(
  () => import('@/presentation/components/shared/Map/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false }
);

interface ProjectMapViewProps {
  projects: ProjectMapSummary[];
  selectedProjectId: number | null;
  onSelectProject: (id: number | null) => void;
  center?: [number, number];
  zoom?: number;
  compact?: boolean;
}

export function ProjectMapView({
  projects,
  selectedProjectId,
  onSelectProject,
  center,
  zoom = 12,
  compact = false,
}: ProjectMapViewProps) {
  const mapRef = useRef<any>(null);
  const defaultCenter: [number, number] = [-12.0464, -77.0428];

  const handleMapReady = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // Fit bounds when projects change
  useEffect(() => {
    if (mapRef.current && projects.length > 0) {
      const L = require('leaflet');
      const bounds = L.latLngBounds(
        projects
          .filter((p) => p.latitude && p.longitude)
          .map((p) => [p.latitude, p.longitude] as [number, number])
      );
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [projects]);

  // Center on selected project
  useEffect(() => {
    if (mapRef.current && selectedProjectId) {
      const project = projects.find((p) => p.id === selectedProjectId);
      if (project?.latitude && project?.longitude) {
        mapRef.current.setView([project.latitude, project.longitude], 16, { animate: true });
      }
    }
  }, [selectedProjectId, projects]);

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

    return projects
      .filter((p) => p.latitude && p.longitude)
      .map((project) => {
        const isSelected = selectedProjectId === project.id;
        const priceLabel = formatPrice(project.priceFrom);
        
        // Usar icono compacto o normal según el modo
        const icon = compact
          ? (priceLabel
              ? createCompactPriceIcon(priceLabel, isSelected)
              : createCompactTiyuyIcon(isSelected))
          : (priceLabel
              ? createPriceIcon(priceLabel, isSelected)
              : createTiyuyIcon(isSelected));

        return (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onSelectProject(isSelected ? null : project.id),
            }}
          >
            <Popup>
              <div 
                className="w-[220px] cursor-pointer"
                onClick={() => window.location.href = `/projects/detail/${project.slug || project.id}`}
              >
                {/* Imagen */}
                {project.coverImageUrl && (
                  <div className="w-full h-[120px] rounded-t-lg overflow-hidden mb-2">
                    <img 
                      src={project.coverImageUrl} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                
                {/* Tipo y fase */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    PROYECTO
                  </span>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span className="text-[10px] text-gray-500 capitalize">{project.phase?.toLowerCase()}</span>
                </div>

                {/* Precio desde */}
                <p className="text-sm font-bold text-gray-900">
                  Desde S/ {project.priceFrom?.toLocaleString('es-PE')}
                  {project.priceTo && ` - S/ ${project.priceTo.toLocaleString('es-PE')}`}
                </p>

                {/* Nombre */}
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1 font-medium">{project.name}</p>

                {/* Ubicación */}
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {project.district}, {project.province}
                </p>

                {/* Características */}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                  {project.totalUnits && (
                    <span className="flex items-center gap-0.5">
                      <Building className="w-3 h-3" />
                      {project.totalUnits} {project.totalUnits === 1 ? 'unidad' : 'unidades'}
                    </span>
                  )}
                  {project.areaFrom && (
                    <span>Desde {project.areaFrom} m²</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      });
  }, [projects, selectedProjectId, onSelectProject]);

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
    </div>
  );
}
