'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapItem, MapSearchResult, MapCoverageType } from '@/core/domain/entities/MapTypes';
import { createPriceMarkerHtml, createClusterMarkerHtml, calculateMapCenter, calculateZoom, formatPrice } from '../utils/mapUtils';
import '../styles/map.css';

// Importar estilos CSS de Leaflet (necesario para que los tiles se rendericen correctamente)
import 'leaflet/dist/leaflet.css';

// Cargar Leaflet y MarkerCluster solo en cliente
const L = typeof window !== 'undefined' ? require('leaflet') : null;

// Cargar MarkerCluster después de Leaflet
if (typeof window !== 'undefined' && L) {
  require('leaflet.markercluster');
}

// Fix para iconos de Leaflet en Next.js
if (typeof window !== 'undefined' && L) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface PropertyMapViewProps {
  searchResult: MapSearchResult | null;
  selectedItemId: number | null;
  onSelectItem: (id: number | null) => void;
  isLoading: boolean;
}

export function PropertyMapView({
  searchResult,
  selectedItemId,
  onSelectItem,
  isLoading,
}: PropertyMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clusterGroupRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !L) return;

    const container = mapContainerRef.current;

    // Forzar tamaño del contenedor antes de inicializar Leaflet
    container.style.width = '100%';
    container.style.height = '100%';

    const center = searchResult?.items?.length
      ? calculateMapCenter(searchResult.items)
      : [-12.0464, -77.0428];

    const zoom = searchResult?.items?.length
      ? calculateZoom(searchResult.items)
      : 12;

    const map = L.map(container, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Tile layer - CartoDB Positron (el más parecido a Google Maps Light)
    // Fondo gris claro, calles blancas, texto gris oscuro, sin amarillo
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Zoom controls personalizados
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    mapRef.current = map;

    // Usar ResizeObserver para invalidar el tamaño del mapa cuando el contenedor cambie de tamaño
    // Esto es crítico para mapas dentro de modales que aparecen dinámicamente
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize(true);
        }
      });
      resizeObserverRef.current.observe(container);
    }

    // Invalidar tamaño inmediatamente después de la inicialización
    // y nuevamente después de que el modal termine de renderizarse
    const invalidateMap = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    };

    // Múltiples invalidaciones para asegurar que el mapa se renderice correctamente
    // después de que el modal y todos los layouts hayan terminado de calcularse
    requestAnimationFrame(() => invalidateMap());
    setTimeout(() => invalidateMap(), 50);
    setTimeout(() => invalidateMap(), 200);
    setTimeout(() => invalidateMap(), 500);

    setMapReady(true);

    return () => {
      // Limpiar ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Actualizar marcadores cuando cambian los resultados
  useEffect(() => {
    if (!mapRef.current || !L || !searchResult) return;

    const map = mapRef.current;
    const coverage = searchResult.effectiveCoverage;

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }

    if (searchResult.items.length === 0) return;

    // Crear grupo de clusters
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: createClusterMarkerHtml(count),
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40),
        });
      },
    });

    // Agregar marcadores
    searchResult.items.forEach((item: MapItem) => {
      if (!item.latitude || !item.longitude) return;

      const isSelected = item.id === selectedItemId;
      const markerHtml = createPriceMarkerHtml(
        item.price,
        item.currency,
        coverage,
        isSelected
      );

      const isProject = item.type === 'PROJECT';
      // Para propiedades: slug está en item.slug. Para proyectos: slug está en item.metadata?.slug o item.slug
      const detailSlug = String(isProject ? (item.metadata?.slug || item.slug || item.id) : (item.slug || item.id));
      // La ruta correcta es /projects/detail/{slug} para proyectos y /property/{slug} para propiedades
      const detailUrl = isProject ? `/projects/detail/${detailSlug}` : `/property/${detailSlug}`;
      
      const marker = L.marker([item.latitude, item.longitude], {
        icon: L.divIcon({
          html: markerHtml,
          className: 'custom-price-marker',
          iconSize: L.point(0, 0),
          iconAnchor: L.point(60, 15),
        }),
      });

      // Popup responsivo para mobile (imagen centrada sin desbordarse, botón compacto)
      const fallbackIcon = isProject ? '&#x1F3D7;&#xFE0F;' : '&#x1F3E0;';
      
      // Contenedor de imagen: ancho completo del popup, alto fijo 120px, sin desbordamiento
      // La imagen se escala para llenar el ancho pero limitada a 120px de alto
      let imageSection: string;
      if (item.imageUrl) {
        const featuredHtml = item.isFeatured 
          ? '<div style="position:absolute;top:4px;left:4px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:8px;font-weight:700;padding:1px 6px;border-radius:20px;z-index:2;line-height:16px;">Destacado</div>'
          : '';
        imageSection = `
          <div style="position:relative;width:100%;height:120px;background:#f3f4f6;overflow:hidden;flex-shrink:0;">
            <img src="${item.imageUrl}" alt="" style="width:100%;height:120px;object-fit:cover;display:block;" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:120px;font-size:36px\\'>${fallbackIcon}</div>'">
            ${featuredHtml}
          </div>`;
      } else {
        imageSection = `<div style="width:100%;height:120px;display:flex;align-items:center;justify-content:center;background:#f3f4f6;flex-shrink:0;"><span style="font-size:36px;line-height:120px">${fallbackIcon}</span></div>`;
      }

      const popupHtml = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border-radius:12px;overflow:hidden;max-width:100%;">
          <a href="${detailUrl}" target="_self" style="text-decoration:none;color:inherit;display:block;">
            ${imageSection}
            <div style="padding:8px 10px;">
              <div style="font-size:12px;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;">
                ${item.title || `${isProject ? 'Proyecto' : item.type} en ${item.district}`}
              </div>
              <div style="font-size:10px;color:#6b7280;margin-bottom:4px;">
                ${item.district}${item.province ? ', ' + item.province : ''}
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:#6b7280;margin-bottom:4px;flex-wrap:wrap;">
                ${item.metadata?.bedrooms ? `<span>🛏️ ${item.metadata.bedrooms}</span>` : ''}
                ${item.metadata?.bathrooms ? `<span>🚿 ${item.metadata.bathrooms}</span>` : ''}
                ${item.metadata?.area ? `<span>📐 ${item.metadata.area}m²</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:3px;border-top:1px solid #f3f4f6;">
                <span style="font-size:13px;font-weight:800;color:#059669;">${formatPrice(item.price, item.currency)}</span>
                <span style="font-size:10px;font-weight:600;color:white;background:#059669;padding:4px 10px;border-radius:6px;white-space:nowrap;">Ver m&aacute;s</span>
              </div>
            </div>
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        minWidth: 200,
        className: 'map-property-popup-container',
        closeButton: true,
      });

      marker.on('click', () => {
        onSelectItem(item.id);
      });

      clusterGroup.addLayer(marker);
      markersRef.current.push(marker);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Ajustar vista si hay items
    if (searchResult.items.length > 0) {
      const bounds = clusterGroup.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    // Invalidar tamaño después de agregar marcadores
    requestAnimationFrame(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    });
  }, [searchResult, selectedItemId, onSelectItem]);

  // Actualizar estilo del marcador seleccionado
  useEffect(() => {
    if (!searchResult || !L) return;

    markersRef.current.forEach((marker, index) => {
      const item = searchResult.items[index];
      if (!item) return;

      const isSelected = item.id === selectedItemId;
      const coverage = searchResult.effectiveCoverage;
      const markerHtml = createPriceMarkerHtml(
        item.price,
        item.currency,
        coverage,
        isSelected
      );

      marker.setIcon(
        L.divIcon({
          html: markerHtml,
          className: 'custom-price-marker',
          iconSize: L.point(0, 0),
          iconAnchor: L.point(60, 15),
        })
      );
    });
  }, [selectedItemId, searchResult]);

  // Centrar en item seleccionado
  useEffect(() => {
    if (!mapRef.current || !searchResult || selectedItemId === null) return;

    const item = searchResult.items.find((p) => p.id === selectedItemId);
    if (item && item.latitude && item.longitude) {
      mapRef.current.setView([item.latitude, item.longitude], 16, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedItemId, searchResult]);

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-[var(--bg-primary)]/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--text-muted)] font-medium">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Leyenda de cobertura */}
      {searchResult && searchResult.items.length > 0 && (
        <div className="absolute bottom-6 left-6 z-[1000] bg-[var(--bg-card)]/90 backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border-color)] p-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Cobertura
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-[var(--text-secondary)]">Distrito exacto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-[var(--text-secondary)]">Distritos cercanos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-xs text-[var(--text-secondary)]">Área metropolitana</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
