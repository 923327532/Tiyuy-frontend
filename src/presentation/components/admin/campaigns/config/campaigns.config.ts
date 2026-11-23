/** Configuración y constantes de la vista admin de Campañas. */

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING_APPROVAL', label: 'Pendiente de aprobación' },
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'PAUSED', label: 'Pausada' },
  { value: 'SUSPENDED', label: 'Suspendida' },
  { value: 'REJECTED', label: 'Rechazada' },
  { value: 'EXPIRED', label: 'Expirada' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

export const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'FEATURED_PROPERTY', label: 'Propiedad destacada' },
  { value: 'FEATURED_PROJECT', label: 'Proyecto destacado' },
  { value: 'HOME_SPOTLIGHT', label: 'Destaque en inicio' },
  { value: 'BANNER', label: 'Banner' },
  { value: 'SLIDER', label: 'Slider' },
  { value: 'PREMIUM_AD', label: 'Anuncio premium' },
  { value: 'SEARCH_BOOST', label: 'Impulso de búsqueda' },
  { value: 'RECOMMENDED', label: 'Recomendada' },
];

export const CAMPAIGN_OWNER_OPTIONS = [
  { value: 'all', label: 'Todos los anunciantes' },
  { value: 'DEVELOPER', label: 'Inmobiliaria' },
  { value: 'AGENT', label: 'Agente' },
  { value: 'ADMIN', label: 'Administración' },
];

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  CAMPAIGN_STATUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => [o.value, o.label])
);

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  CAMPAIGN_TYPE_OPTIONS.filter((o) => o.value !== 'all').map((o) => [o.value, o.label])
);

export const CAMPAIGN_OWNER_ROLE_LABELS: Record<string, string> = Object.fromEntries(
  CAMPAIGN_OWNER_OPTIONS.filter((o) => o.value !== 'all').map((o) => [o.value, o.label])
);

/** Ubicaciones del enum PlacementLocation traducidas para el detalle. */
export const CAMPAIGN_PLACEMENT_LABELS: Record<string, string> = {
  HOME_MAIN: 'Inicio principal',
  HOME_SPOTLIGHT: 'Destaque en inicio',
  HOME_BANNER: 'Banner de inicio',
  SEARCH_RESULTS: 'Resultados de búsqueda',
  PROPERTY_DETAIL: 'Detalle de propiedad',
  PROJECT_DETAIL: 'Detalle de proyecto',
  PROPERTY_LIST: 'Listado de propiedades',
  PROJECT_LIST: 'Listado de proyectos',
  SIDEBAR: 'Barra lateral',
  SLIDER: 'Carrusel',
  BANNER_TOP: 'Banner superior',
  BANNER_BOTTOM: 'Banner inferior',
  RECOMMENDED: 'Sección recomendados',
  CATEGORY_PAGE: 'Página de categoría',
};

/** Para convertir la etiqueta clickable de la leyenda en filtro de estado. */
export const CAMPAIGN_STATUS_BY_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(CAMPAIGN_STATUS_LABELS).map(([code, label]) => [label, code])
);

/** Tipos de campaña festiva del módulo de marketing. */
export const FESTIVE_TYPE_LABELS: Record<string, string> = {
  CHRISTMAS: 'Navidad',
  NEW_YEAR: 'Año nuevo',
  BLACK_FRIDAY: 'Black Friday',
  CYBER_DAY: 'Cyber Day',
  FIESTAS_PATRIAS: 'Fiestas patrias',
  HALLOWEEN: 'Halloween',
  VALENTINE: 'San Valentín',
  MOTHER_DAY: 'Día de la madre',
};

/** Misma paleta que Agentes/Proyectos. */
export interface CampaignsFilterCriteria {
  promotionType: string;
  ownerRole: string;
  startDateFrom: string;
  startDateTo: string;
}

export const EMPTY_CAMPAIGNS_FILTERS: CampaignsFilterCriteria = {
  promotionType: 'all',
  ownerRole: 'all',
  startDateFrom: '',
  startDateTo: '',
};

export function hasCampaignAdvancedFilters(filters: CampaignsFilterCriteria): boolean {
  return (
    filters.promotionType !== 'all' ||
    filters.ownerRole !== 'all' ||
    Boolean(filters.startDateFrom) ||
    Boolean(filters.startDateTo)
  );
}

export const CHART_PERIODS = ['7D', '30D', '3M', '6M', '1A'];
export const CAMPAIGN_STATUS_CODES = ['ACTIVE', 'PENDING_APPROVAL', 'PAUSED', 'EXPIRED', 'REJECTED'];
export const CAMPAIGN_STATUS_COLORS = ['#0d9488', '#f59e0b', '#8b5cf6', '#64748b', '#f43f5e'];
