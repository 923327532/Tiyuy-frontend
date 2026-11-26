import axios from 'axios';
import { getToken, isTokenExpired, clearTokens } from './token-utils';
import { env, serverEnv } from '@/config/env';

// El backend usa context-path /api
const serverBaseURL = `${serverEnv.backendUrl}/api`;

// En el navegador, usar el proxy de Next.js (/api) para evitar CORS
// En el servidor (SSR), usar la URL directa del backend
const baseURL =
  typeof window === 'undefined'
    ? serverBaseURL
    : '/api';

export const axiosClient = axios.create({
  baseURL,
  timeout: 30000,
});

export const publicApiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry interceptor para Render cold start y errores de red
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const shouldRetry =
      (error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        !error.response) &&
      error.config &&
      !error.config.__retry;

    if (shouldRetry) {
      error.config.__retry = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      return axiosClient.request(error.config);
    }

    return Promise.reject(error);
  }
);

// Retry interceptor for public client
publicApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED' && error.config && !error.config.__retry) {
      error.config.__retry = true;
      return publicApiClient.request(error.config);
    }

    return Promise.reject(error);
  }
);

export const apiClient = axiosClient;

/**
 * Endpoints críticos de sesión: un 401 aquí sí significa que el token dejó de servir.
 * Se mantienen como fatales para no perder el logout real por expiración.
 */
function esEndpointCriticoDeSesion(url: string): boolean {
  return (
    url.includes('/auth/me') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/login') ||
    url.includes('/auth/logout')
  );
}

/**
 * Peticiones opcionales: widgets del dashboard, marketing, notificaciones y favoritos.
 * Un 401 en estas rutas no debe borrar el JWT ni redirigir al login, porque el
 * componente que las consume ya maneja el error y el resto de la sesión sigue válida.
 * (Los checks de favoritos ya capturaban el 401 localmente; se conserva ese comportamiento).
 */
function esWidgetOpcional(url: string): boolean {
  return (
    url.includes('/favorites/check') ||
    url.includes('/dashboard/stats') ||
    url.includes('/dashboard/properties') ||
    url.includes('/dashboard/reports') ||
    url.includes('/dashboard-stats') ||
    url.includes('/projects/project-stats') ||
    url.includes('/discounts') ||
    url.includes('/marketing/stats') ||
    url.includes('/marketing/campaigns') ||
    url.includes('/marketing/banners') ||
    url.includes('/notifications')
  );
}

// Request interceptor: Agrega JWT automáticamente
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers) {
        delete (config.headers as any)['Content-Type'];
        delete (config.headers as any)['content-type'];
      }
    } else {
      if (!config.headers) {
        config.headers = {} as any;
      }
      if (!(config.headers as any)['Content-Type'] && !(config.headers as any)['content-type']) {
        (config.headers as any)['Content-Type'] = 'application/json';
      }
    }

    if (typeof window !== 'undefined') {
      const token = getToken();

      if (token) {
        const url = config.url || '';
        const tokenExpirado = isTokenExpired(token);

        // 🔥 PREVENTIVO: Si el token ya expiró, limpiar y redirigir al login
        // ANTES de hacer la petición, evitando el 401 innecesario.
        // Solo se aplica a peticiones protegidas normales: en widgets opcionales
        // dejamos que el componente maneje el error sin cerrar toda la sesión.
        if (tokenExpirado && !esWidgetOpcional(url)) {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(new Error('Token expirado'));
        }

        // No adjuntamos un token vencido a un widget opcional; el backend
        // responderá 401 y el interceptor de respuesta omitirá el logout.
        if (!tokenExpirado) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Manejo de errores centralizado
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';

      // Solo cerramos sesión si es un endpoint crítico o una petición protegida
      // normal. Los widgets opcionales (dashboard, marketing, notificaciones,
      // favoritos/check) manejan el 401 por su cuenta y no deben expulsar al usuario.
      const debeCerrarSesion =
        esEndpointCriticoDeSesion(url) || !esWidgetOpcional(url);

      if (debeCerrarSesion && typeof window !== 'undefined') {
        clearTokens();
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;