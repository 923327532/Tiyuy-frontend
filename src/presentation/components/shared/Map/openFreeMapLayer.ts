'use client';


export const OPENFREEMAP_LIBERTY_STYLE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

export function addOpenFreeMapLayer(map: any): void {
  // Nunca ejecutar en el servidor.
  if (typeof window === 'undefined' || !map) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const leaflet = require('leaflet');

    // Capa raster detallada de Esri World Street Map (calles tipo Google).
    leaflet
      .tileLayer(OPENFREEMAP_LIBERTY_STYLE, {
        maxZoom: 19,
        attribution:
          'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, (c) OpenStreetMap contributors',
      })
      .addTo(map);
  } catch (error) {
    // Si el servicio raster no responde, aplicar otro raster claro de respaldo
    // para que el mapa jamás quede en blanco (mantiene los marcadores operativos).
    console.warn('[Basemap] No se pudo cargar Esri World Street Map, usando fallback.', error);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const leaflet = require('leaflet');
    leaflet
      .tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
          attribution:
            '&copy; Esri &mdash; Esri, HERE, Garmin, (c) OpenStreetMap contributors',
        }
      )
      .addTo(map);
  }
}


