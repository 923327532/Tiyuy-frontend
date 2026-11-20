'use client';

// Mapa base compartido por los mapas de listados (propiedades y proyectos).
// Usa los mismos tiles estándar de OpenStreetMap que el mapa de la descripción de
// propiedad (EnhancedMap), para que todos los mapas de Tiyuy se vean igual.

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Se conserva el nombre antiguo por compatibilidad con código que ya lo importa.
export const OPENFREEMAP_LIBERTY_STYLE = OSM_TILE_URL;

export function addOpenFreeMapLayer(map: any): void {
  // Nunca ejecutar en el servidor.
  if (typeof window === 'undefined' || !map) return;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const leaflet = require('leaflet');

  leaflet
    .tileLayer(OSM_TILE_URL, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    .addTo(map);
}
