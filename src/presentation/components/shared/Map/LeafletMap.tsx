'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issue (DEBE ir antes de cualquier uso de L)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ═══════════════════════════════════════════════════════════════════
// CARGA DE CSS: Doble estrategia para producción
// ═══════════════════════════════════════════════════════════════════
// 1. Importación directa del módulo (funciona en dev, a veces falla en prod)
// 2. Inyección de link CDN como respaldo (garantizado en prod)
// ═══════════════════════════════════════════════════════════════════

// Intento #1: Importar CSS vía módulo (puede ser tree-shakeado en prod)
try {
  require('leaflet/dist/leaflet.css');
} catch (_e) {
  // Fallback silencioso
}

// Intento #2: Inyectar CDN link como respaldo (si no está ya en el DOM)
if (typeof document !== 'undefined' && !document.getElementById('leaflet-css-cdn')) {
  const link = document.createElement('link');
  link.id = 'leaflet-css-cdn';
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface LeafletMapProps {
  children: React.ReactNode;
  center?: [number, number];
  zoom?: number;
  bounds?: Bounds | null;
  className?: string;
  onMapReady?: (map: L.Map) => void;
}

function MapBoundsUpdater({ bounds }: { bounds: Bounds | null | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      const padding = 0.02;
      map.fitBounds(
        [
          [bounds.minLat - padding, bounds.minLng - padding],
          [bounds.maxLat + padding, bounds.maxLng + padding],
        ],
        { padding: [50, 50], maxZoom: 15 }
      );
    }
  }, [map, bounds]);

  return null;
}

function MapReadyHandler({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }

    // ═══════════════════════════════════════════════════════════════
    // ESTRATEGIA ROBUSTA DE INVALIDACIÓN PARA PRODUCCIÓN
    // ═══════════════════════════════════════════════════════════════
    // En producción, el contenedor puede tardar en tener tamaño real
    // por la hidratación de Next.js, CSS, imágenes, etc.
    // Necesitamos invalidar en múltiples momentos con tiempos largos.
    // ═══════════════════════════════════════════════════════════════

    const invalidate = () => {
      try {
        if (map && map.getContainer()) {
          const container = map.getContainer();
          // Solo invalidar si el contenedor tiene tamaño visible
          if (container.clientWidth > 0 && container.clientHeight > 0) {
            map.invalidateSize(true);
          }
        }
      } catch (_e) {
        // Ignorar errores silenciosamente
      }
    };

    // Fase 1: Invalidaciones tempranas (requestAnimationFrame ya cubre el primer paint)
    requestAnimationFrame(() => invalidate());

    // Fase 2: Invalidaciones progresivas para cubrir carga asíncrona
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [100, 300, 500, 1000, 2000, 3000];
    delays.forEach((delay) => {
      timers.push(setTimeout(() => invalidate(), delay));
    });

    // Fase 3: ResizeObserver para detectar cambios de tamaño en tiempo real
    if (typeof ResizeObserver !== 'undefined') {
      try {
        const container = map.getContainer();
        if (container) {
          const observer = new ResizeObserver(() => {
            invalidate();
          });
          observer.observe(container);

          return () => {
            observer.disconnect();
            timers.forEach(clearTimeout);
          };
        }
      } catch (_e) {
        // Ignorar errores de ResizeObserver
      }
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [map, onMapReady]);

  return null;
}

export function LeafletMap({
  children,
  center = [-12.0464, -77.0428],
  zoom = 12,
  bounds,
  className = 'w-full h-full',
  onMapReady,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapBoundsUpdater bounds={bounds} />
      <MapReadyHandler onMapReady={onMapReady} />
      {children}
    </MapContainer>
  );
}
