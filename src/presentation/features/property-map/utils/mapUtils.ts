
import { MapItem, MapCoverageType } from '@/core/domain/entities/MapTypes';

export function formatPrice(price: number, currency: 'PEN' | 'USD'): string {
  const symbol = currency === 'USD' ? 'US$' : 'S/';
  return `${symbol} ${price.toLocaleString('es-PE')}`;
}

export function getMarkerColor(coverage: MapCoverageType): string {
  switch (coverage) {
    case 'EXACT_DISTRICT':
      return '#00A852'; // Verde Tiyuy
    case 'NEARBY_DISTRICTS':
      return '#F59E0B'; // Naranja Tiyuy
    case 'METRO_AREA':
    case 'PROVINCE':
    case 'REGION':
      return '#4A00E0'; // Morado Tiyuy
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Retorna el color de relleno del marcador (más claro)
 */
export function getMarkerFillColor(coverage: MapCoverageType): string {
  switch (coverage) {
    case 'EXACT_DISTRICT':
      return '#e6f7ed'; // verde claro
    case 'NEARBY_DISTRICTS':
      return '#fef3c7'; // naranja claro
    case 'METRO_AREA':
    case 'PROVINCE':
    case 'REGION':
      return '#ede9fe'; // morado claro
    default:
      return '#f3f4f6'; // gray-100
  }
}

export function createPriceMarkerHtml(
  _price: number,
  _currency: 'PEN' | 'USD',
  _coverage: MapCoverageType,
  isSelected: boolean = false
): string {
  const size = isSelected ? 44 : 38;
  const shadow = isSelected
    ? '0 4px 14px rgba(0,0,0,0.35)'
    : '0 2px 8px rgba(0,0,0,0.20)';

  return `
    <div style="
      width: ${size}px;
      height: ${size}px;
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: pointer;
    ">
      <img
        src="/assets/icons/logo_mapa.png"
        alt="TIYUY"
        style="
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        "
      />
    </div>
  `;
}

/**
 * Crea el HTML para un marker de cluster personalizado
 * Estilo Tiyuy: gradiente verde con sombra suave
 */
export function createClusterMarkerHtml(count: number): string {
  const size = count < 10 ? 42 : count < 50 ? 52 : 62;
  const fontSize = count < 10 ? '13px' : '15px';
  return `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #00A852, #008f44);
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: ${fontSize};
      letter-spacing: -0.02em;
      box-shadow: 0 4px 14px rgba(0, 168, 82, 0.35), 0 1px 3px rgba(0,0,0,0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: transform 0.2s ease;
    ">
      ${count}
    </div>
  `;
}

/**
 * Agrupa items del mapa por distrito
 */
export function groupByDistrict(items: MapItem[]): Map<string, MapItem[]> {
  const groups = new Map<string, MapItem[]>();
  items.forEach((item) => {
    const key = item.district || 'Sin distrito';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  });
  return groups;
}

/**
 * Calcula el centro geográfico de un conjunto de items
 */
export function calculateMapCenter(items: MapItem[]): [number, number] {
  if (items.length === 0) return [-12.0464, -77.0428]; // Lima centro por defecto

  const latSum = items.reduce((sum, item) => sum + item.latitude, 0);
  const lngSum = items.reduce((sum, item) => sum + item.longitude, 0);

  return [latSum / items.length, lngSum / items.length];
}

/**
 * Calcula el zoom apropiado basado en la dispersión de items
 */
export function calculateZoom(items: MapItem[]): number {
  if (items.length <= 1) return 14;

  const lats = items.map((item) => item.latitude);
  const lngs = items.map((item) => item.longitude);

  const latSpread = Math.max(...lats) - Math.min(...lats);
  const lngSpread = Math.max(...lngs) - Math.min(...lngs);
  const maxSpread = Math.max(latSpread, lngSpread);

  if (maxSpread < 0.01) return 15;
  if (maxSpread < 0.05) return 13;
  if (maxSpread < 0.1) return 12;
  if (maxSpread < 0.5) return 11;
  return 10;
}
