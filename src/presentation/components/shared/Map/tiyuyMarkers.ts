'use client';

const TIYUY_LOGO_URL = '/assets/icons/logo_mapa.png';

function createLogoIconHtml(size: number, isSelected: boolean): string {
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
        src="${TIYUY_LOGO_URL}"
        alt="TIYUY"
        style="width: 100%; height: 100%; object-fit: contain; display: block;"
      />
    </div>
  `;
}

/** Crea un icono Leaflet circular con el logo de TIYUY (pin de posición). */
function createLogoIcon(isSelected: boolean = false): any {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const size = isSelected ? 44 : 38;
  return L.divIcon({
    html: createLogoIconHtml(size, isSelected),
    className: 'tiyuy-logo-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

/** Marcador de posición (proyecto/propiedad) → logo de TIYUY. */
export function createTiyuyIcon(isSelected: boolean = false): any {
  return createLogoIcon(isSelected);
}


/** Marcador de posición compacto → logo de TIYUY. */
export function createCompactTiyuyIcon(isSelected: boolean = false): any {
  return createLogoIcon(isSelected);
}

/** Marcador con precio (proyecto/propiedad) → solo el logo de TIYUY. */
export function createPriceIcon(_price: string, isSelected: boolean = false, _color?: string): any {
  return createLogoIcon(isSelected);
}

export function createCompactPriceIcon(_price: string, isSelected: boolean = false): any {
  return createLogoIcon(isSelected);
}

export function createColoredPriceIcon(_price: string, _matchType: 'EXACT' | 'NEARBY' | 'EXPANDED', isSelected: boolean = false): any {
  return createLogoIcon(isSelected);
}

/** Cluster: logo de TIYUY con un pequeño contador (preserva la agrupación). */
export function createClusterIcon(count: number): any {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const size = count > 99 ? 56 : count > 9 ? 48 : 40;
  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <img src="${TIYUY_LOGO_URL}" alt="TIYUY" style="width:100%;height:100%;object-fit:contain;display:block;" />
        <div style="position:absolute;bottom:-4px;right:-6px;background:#00A852;color:#fff;font-size:10px;font-weight:800;min-width:16px;height:16px;padding:0 3px;border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.3);white-space:nowrap;">${count}</div>
      </div>
    `,
    className: 'tiyuy-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Helpers SVG que ya no se usan; se conservan por compatibilidad de imports.
export const TIYUY_MARKER_SVG = '';
export const TIYUY_MARKER_SELECTED_SVG = '';
export function createPriceMarkerSvg(_price: string, _isSelected: boolean = false): string {
  return '';
}
export function createCompactPriceMarkerSvg(_price: string, _isSelected: boolean = false): string {
  return '';
}
export function createCompactTiyuySvg(_isSelected: boolean = false): string {
  return '';
}
export function createClusterSvg(_count: number): string {
  return '';
}

