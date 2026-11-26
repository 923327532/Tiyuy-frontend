/** Catálogo de ubicaciones y modos de despliegue de banners (alineado con PlacementLocation del backend). */

export const PLACEMENT_OPTIONS = [
  { value: 'HOME_MAIN', label: 'Home · Principal' },
  { value: 'HOME_SPOTLIGHT', label: 'Home · Spotlight' },
  { value: 'HOME_BANNER', label: 'Home · Banner' },
  { value: 'SEARCH_RESULTS', label: 'Resultados de búsqueda' },
  { value: 'PROPERTY_DETAIL', label: 'Detalle de propiedad' },
  { value: 'PROJECT_DETAIL', label: 'Detalle de proyecto' },
  { value: 'PROPERTY_LIST', label: 'Listado de propiedades' },
  { value: 'PROJECT_LIST', label: 'Listado de proyectos' },
  { value: 'SIDEBAR', label: 'Barra lateral' },
  { value: 'SLIDER', label: 'Carrusel principal' },
  { value: 'BANNER_TOP', label: 'Banner superior' },
  { value: 'BANNER_BOTTOM', label: 'Banner inferior' },
  { value: 'RECOMMENDED', label: 'Recomendados' },
  { value: 'CATEGORY_PAGE', label: 'Página de categoría' },
] as const;

export const PLACEMENT_LABELS: Record<string, string> = Object.fromEntries(
  PLACEMENT_OPTIONS.map((option) => [option.value, option.label])
);

export const DISPLAY_MODE_OPTIONS = [
  {
    value: 'INTEGRATED',
    label: 'Integrado al carrusel',
    description: 'Se mezcla con las imágenes del carrusel principal.',
  },
  {
    value: 'SOLO_BANNER',
    label: 'Banner individual',
    description: 'Se muestra solo como pieza publicitaria independiente.',
  },
] as const;

export type BannerDisplayModeValue = 'INTEGRATED' | 'SOLO_BANNER';

export const BANNER_STATUS_FILTERS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'scheduled', label: 'Programados' },
  { value: 'paused', label: 'Pausados' },
  { value: 'expired', label: 'Expirados' },
] as const;

export type BannerStatusFilter = (typeof BANNER_STATUS_FILTERS)[number]['value'];

export type BannerBadgeVariant = 'success' | 'info' | 'neutral' | 'warning';

export const BANNER_STATUS_VARIANTS: Record<
  Extract<BannerStatusFilter, 'active' | 'scheduled' | 'paused' | 'expired'>,
  BannerBadgeVariant
> = {
  active: 'success',
  scheduled: 'info',
  paused: 'neutral',
  expired: 'warning',
};
