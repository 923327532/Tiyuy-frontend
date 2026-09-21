/**
 * Service for communicating with the AI Copilot Agent backend.
 * Handles sending messages and processing streaming responses
 * with function calling support.
 * Includes local fallback when backend is unavailable.
 */

import { publicApiClient } from '@/infrastructure/api/axios-client';

export interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotMessageRequest {
  message: string;
  currentPath?: string;
  history?: ChatHistoryEntry[];
  isAuthenticated?: boolean;
  userRole?: string;
}

export interface CopilotNavigationAction {
  type: 'NAVIGATE';
  payload: {
    path: string;
    message: string;
  };
}

export interface CopilotScrollToFieldAction {
  type: 'SCROLL_TO_FIELD';
  payload: {
    field: string;
    message: string;
  };
}

export interface CopilotShowResultsAction {
  type: 'SHOW_RESULTS';
  payload: {
    message: string;
    viewAllUrl?: string;
  };
}

export type CopilotAction = CopilotNavigationAction | CopilotScrollToFieldAction | CopilotShowResultsAction;

export interface CopilotMessageResponse {
  text: string;
  action: CopilotAction | null;
  data: Record<string, unknown>[] | null;
}

export const COPILOT_SCROLL_EVENT = 'copilot:scroll-to-field';

/**
 * Comprehensive route configuration for Tiyuy app.
 * Maps user intent keywords to actual app routes with auth requirements.
 *
 * Route categories:
 * - public: anyone can access (guests, logged users, any role)
 * - auth: requires login (any authenticated user)
 * - agent: requires AGENT role
 * - developer: requires DEVELOPER role
 * - admin: requires ADMIN/SUPER_ADMIN role
 */

interface RouteEntry {
  path: string;
  category: 'public' | 'auth' | 'agent' | 'developer' | 'admin';
  label: string;
}

const ROUTE_REGISTRY: RouteEntry[] = [
  // --- Public routes (anyone) ---
  { path: '/', category: 'public', label: 'inicio' },
  { path: '/properties', category: 'public', label: 'propiedades' },
  { path: '/projects', category: 'public', label: 'proyectos' },
  { path: '/inmobiliarias', category: 'public', label: 'inmobiliarias' },
  { path: '/agencies', category: 'public', label: 'agencias' },
  { path: '/agents', category: 'public', label: 'agentes' },
  { path: '/soporte', category: 'public', label: 'soporte,ayuda' },
  { path: '/contact', category: 'public', label: 'contacto' },
  { path: '/blog', category: 'public', label: 'blog' },
  { path: '/about-tiyuy', category: 'public', label: 'tiyuy,conocenos,nosotros' },
  { path: '/rental-guide', category: 'public', label: 'guia alquilar' },
  { path: '/market-radar', category: 'public', label: 'radar,mercado' },
  { path: '/price-per-m2', category: 'public', label: 'precio m2,preciometro' },
  { path: '/libro-de-reclamaciones', category: 'public', label: 'reclamo,reclamaciones,libro' },
  { path: '/cancelacion', category: 'public', label: 'cancelacion' },
  { path: '/privacy', category: 'public', label: 'privacidad' },
  { path: '/terms', category: 'public', label: 'terminos,condiciones' },
  { path: '/seguridad', category: 'public', label: 'seguridad' },
  { path: '/antidiscriminacion', category: 'public', label: 'discriminacion' },
  { path: '/discapacidad', category: 'public', label: 'discapacidad' },
  { path: '/impacto-comunitario', category: 'public', label: 'impacto,comunitario' },
  { path: '/inversores', category: 'public', label: 'inversores,invertir' },
  { path: '/noticias', category: 'public', label: 'noticias' },
  { path: '/politicas-de-cambio', category: 'public', label: 'politicas cambio' },
  { path: '/tips-decoracion', category: 'public', label: 'decoracion,tips' },
  { path: '/trabaja-con-nosotros', category: 'public', label: 'trabajo,trabajar' },
  { path: '/campaigns', category: 'public', label: 'campañas,campanas' },
  { path: '/corredores', category: 'public', label: 'corredores' },
  { path: '/servics', category: 'public', label: 'servicios,servics' },
  { path: '/rent', category: 'public', label: 'alquilar,alquiler' },
  { path: '/sale', category: 'public', label: 'vender,venta,comprar' },
  { path: '/login', category: 'public', label: 'login,iniciar sesion,inicio de sesion,acceder' },
  { path: '/register', category: 'public', label: 'registro,registrarse' },

  // --- Auth required (any logged user) ---
  { path: '/mensajes', category: 'auth', label: 'mensajes,mensajeria,chat' },
  { path: '/mensajes/channels', category: 'auth', label: 'canales' },
  { path: '/mensajes/groups', category: 'auth', label: 'grupos' },
  { path: '/mensajes/contactos', category: 'auth', label: 'contactos' },
  { path: '/my-properties', category: 'auth', label: 'mis propiedades,publicar propiedad' },
  { path: '/my-projects', category: 'auth', label: 'mis proyectos,publicar proyecto' },
  { path: '/plans', category: 'auth', label: 'planes,pagos,precios,premium' },
  { path: '/payments', category: 'auth', label: 'pagos,facturacion' },
  { path: '/notifications', category: 'auth', label: 'notificaciones' },
  { path: '/preferences', category: 'auth', label: 'preferencias,configuracion' },
  { path: '/checkout', category: 'auth', label: 'checkout,pagar' },
  { path: '/profile', category: 'auth', label: 'perfil,cuenta,mi cuenta' },
  { path: '/favorites', category: 'auth', label: 'favoritos,megusta' },
  { path: '/dashboard', category: 'auth', label: 'dashboard,panel,escritorio' },
  { path: '/dashboard/my-properties', category: 'auth', label: 'mis propiedades' },
  { path: '/dashboard/my-properties/new', category: 'auth', label: 'nueva propiedad,publicar' },
  { path: '/dashboard/my-projects', category: 'auth', label: 'mis proyectos' },
  { path: '/dashboard/mis-proyectos', category: 'auth', label: 'mis proyectos' },
  { path: '/dashboard/projects/new', category: 'auth', label: 'nuevo proyecto,crear proyecto' },
  { path: '/dashboard/notifications', category: 'auth', label: 'notificaciones' },
  { path: '/dashboard/payments', category: 'auth', label: 'pagos' },
  { path: '/dashboard/plans', category: 'auth', label: 'planes,suscripcion' },
  { path: '/dashboard/preferences', category: 'auth', label: 'preferencias' },
  { path: '/dashboard/checkout', category: 'auth', label: 'checkout' },
  { path: '/dashboard/profile', category: 'auth', label: 'perfil,mi perfil' },
  { path: '/dashboard/favorites', category: 'auth', label: 'favoritos' },
  { path: '/dashboard/marketing', category: 'auth', label: 'marketing,campanas' },
  { path: '/dashboard/clients', category: 'auth', label: 'clientes,crm' },
  { path: '/dashboard/crm-leads', category: 'auth', label: 'leads,prospectos' },
  { path: '/dashboard/my-contacts', category: 'auth', label: 'mis contactos' },
  { path: '/dashboard/my-contacts/channels', category: 'auth', label: 'canales,cartera' },
  { path: '/dashboard/my-contacts/groups', category: 'auth', label: 'grupos' },

  // --- Agent routes ---
  { path: '/dashboard/agent', category: 'agent', label: 'panel agente,agente' },

  // --- Developer routes ---
  { path: '/dashboard/real-estate', category: 'developer', label: 'panel inmobiliaria,inmobiliaria,developers' },

  // --- Admin routes ---
  { path: '/dashboard/admin', category: 'admin', label: 'panel admin,administracion,admin' },
  { path: '/dashboard/admin/notifications', category: 'admin', label: 'notificaciones admin' },
  { path: '/dashboard/admin/communications', category: 'admin', label: 'comunicaciones admin' },
  { path: '/dashboard/admin/profile', category: 'admin', label: 'perfil admin' },
];

/**
 * Returns the auth category for a path match result.
 */
function getAuthCategory(path: string): 'public' | 'auth' | 'agent' | 'developer' | 'admin' {
  const entry = ROUTE_REGISTRY.find((r) => path.startsWith(r.path));
  return entry?.category ?? 'public';
}

/**
 * Local fallback: matches intents via keywords without calling the backend.
 * Handles authentication-awareness: guest users only see public routes.
 * Checks specific intents first (alquiler, compra, etc.) to match detailed routes.
 */
function localFallbackIntent(message: string, currentPath?: string): CopilotMessageResponse | null {
  if (!message) return null;
  const lower = message.toLowerCase();

  // --- Specific intent matching FIRST (more detailed routes) ---

  // Alquiler: navigate to /rent/departamentos/lima
  if (lower.includes('alquiler') || lower.includes('alquilar') || lower.includes('rentar') || lower.includes('arrendar')) {
    return {
      text: 'Te llevo a la pagina de propiedades en alquiler en Lima.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/rent/departamentos/lima', message: 'Redirigiendo a propiedades en alquiler...' },
      },
      data: null,
    };
  }

  // Compra/venta: navigate to /sale/departamentos/lima
  if (lower.includes('comprar') || lower.includes('venta') || lower.includes('adquirir') || lower.includes('compra')) {
    return {
      text: 'Te llevo a la pagina de propiedades en venta en Lima.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/sale/departamentos/lima', message: 'Redirigiendo a propiedades en venta...' },
      },
      data: null,
    };
  }

  // Precio por metro cuadrado
  if ((lower.includes('precio') && (lower.includes('metro') || lower.includes('m2') || lower.includes('m²') || lower.includes('cuadrado') || lower.includes('indice') || lower.includes('índice'))) ||
      lower.includes('precio por metro') || lower.includes('indice de precio') || lower.includes('índice de precio')) {
    return {
      text: 'Te llevo al reporte de precio por metro cuadrado.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/price-per-m2', message: 'Redirigiendo a precio por metro cuadrado...' },
      },
      data: null,
    };
  }

  // Mercado inmobiliario / market radar
  if (lower.includes('mercado inmobiliario') || lower.includes('market radar') || lower.includes('radar')) {
    return {
      text: 'Te llevo al panel de mercado inmobiliario.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/market-radar', message: 'Redirigiendo al mercado inmobiliario...' },
      },
      data: null,
    };
  }

  // Projects (before generic "proyecto" match)
  if (lower.includes('proyecto') || lower.includes('proyectos') || lower.includes('proyecto inmobiliario') || lower.includes('edificio')) {
    return {
      text: 'Te llevo a la pagina de proyectos inmobiliarios.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/projects', message: 'Redirigiendo a proyectos...' },
      },
      data: null,
    };
  }

  // Planes / precios / suscripciones: navigate to /plans
  if (lower.includes('plan') || lower.includes('planes') || lower.includes('suscripcion') || lower.includes('suscripción') || lower.includes('premium') || lower.includes('precios')) {
    return {
      text: 'Te llevo a la pagina de planes y precios.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/plans', message: 'Redirigiendo a planes y precios...' },
      },
      data: null,
    };
  }

  // Publicar propiedad / agregar propiedad / nuevo inmueble: navigate to /my-properties/new
  if (lower.includes('publicar') || lower.includes('publica') || lower.includes('agregar propiedad') || lower.includes('poner') || lower.includes('agregar un') || lower.includes('agregar una') || lower.includes('nuevo inmueble') || lower.includes('nueva propiedad') || lower.includes('quiero publicar') || lower.includes('quiero poner')) {
    return {
      text: 'Te llevo al formulario para publicar una nueva propiedad.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/my-properties/new', message: 'Redirigiendo al formulario de publicacion...' },
      },
      data: null,
    };
  }

  // --- Generic route keyword matching ---
  // Try to match the message against route keywords
  for (const entry of ROUTE_REGISTRY) {
    const keywords = entry.label.split(',');
    const matched = keywords.some((kw) => {
      const trimmed = kw.trim();
      return trimmed.length > 2 && lower.includes(trimmed);
    });
    if (!matched) continue;

    // Check auth requirements
    if (entry.category !== 'public') {
      return {
        text: `"${entry.label}" requiere iniciar sesion. Puedo llevarte al inicio de sesion o a una seccion publica. ¿Que prefieres?`,
        action: {
          type: 'NAVIGATE' as const,
          payload: { path: '/login', message: 'Redirigiendo al inicio de sesion...' },
        },
        data: null,
      };
    }

    return {
      text: `Te llevo a la seccion de ${entry.label}.`,
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: entry.path, message: `Redirigiendo a ${entry.label}...` },
      },
      data: null,
    };
  }

  // Check generic property search intent (catch-all)
  const propertyKeywords = ['casa', 'departamento', 'terreno', 'local', 'oficina', 'barato', 'economico', 'buscar'];
  if (propertyKeywords.some((kw) => lower.includes(kw))) {
    return {
      text: 'Te llevo a la pagina de todas las propiedades disponibles en todo el Peru.',
      action: {
        type: 'NAVIGATE' as const,
        payload: { path: '/properties', message: 'Redirigiendo a propiedades...' },
      },
      data: null,
    };
  }

  return null;
}

/**
 * Sends a message to the AI Copilot Agent.
 * Falls back to local intent matching if backend is unavailable.
 */
export async function sendCopilotMessage(
  message: string,
  options?: {
    currentPath?: string;
    history?: ChatHistoryEntry[];
  }
): Promise<CopilotMessageResponse> {
  // Get auth context from the store
  let isAuthenticated = false;
  let userRole = '';
  try {
    const { useAuthStore } = require('@/presentation/store/authStore');
    const state = useAuthStore.getState();
    isAuthenticated = state.isAuthenticated;
    userRole = state.user?.role || '';
  } catch {
    // Auth store not available, proceed without auth context
  }

  try {
    const request: CopilotMessageRequest = {
      message,
      currentPath: options?.currentPath ?? '/',
      history: options?.history ?? [],
      isAuthenticated,
      userRole,
    };

    const response = await publicApiClient.post<CopilotMessageResponse>(
      '/v1/copilot/chat',
      request
    );

    return response.data;
  } catch {
    // Backend is unavailable - use local fallback
    const fallback = localFallbackIntent(message, options?.currentPath);
    if (fallback) {
      return fallback;
    }
    return {
      text: 'Puedo ayudarte con estas secciones: inicio, propiedades, proyectos, inmobiliarias, blog, soporte, guia de alquiler, precios por m2, o si tienes cuenta: mensajes, publicar, planes, dashboard. ¿Cual deseas?',
      action: null,
      data: null,
    };
  }
}

/**
 * Checks if the copilot backend is healthy and accessible.
 */
export async function checkCopilotHealth(): Promise<boolean> {
  try {
    const response = await publicApiClient.get('/v1/copilot/health');
    return response.status === 200;
  } catch {
    return false;
  }
}

export interface SuggestionQuestion {
  id: string;
  text: string;
  label: string;
}

export const SUGGESTION_QUESTIONS: SuggestionQuestion[] = [
  {
    id: 'search-cheapest',
    text: 'Quiero ver las propiedades mas economicas en lima',
    label: 'Propiedades economicas en Lima',
  },
  {
    id: 'agency-projects',
    text: 'Cuantos proyectos tiene una inmobiliaria y cuales son',
    label: 'Proyectos de inmobiliaria',
  },
  {
    id: 'publish-guide',
    text: 'No se como publicar mi inmueble, guiame paso a paso',
    label: 'Guia para publicar',
  },
  {
    id: 'help-center',
    text: 'Donde encuentro el centro de ayuda o soporte tecnico',
    label: 'Centro de ayuda',
  },
];