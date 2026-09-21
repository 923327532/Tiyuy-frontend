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
        // 🔥 PREVENTIVO: Si el token ya expiró, limpiar y redirigir al login
        // ANTES de hacer la petición, evitando el 401 innecesario
        if (isTokenExpired(token)) {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(new Error('Token expirado'));
        }

        config.headers.Authorization = `Bearer ${token}`;
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
      if (typeof window !== 'undefined') {
        clearTokens();
        // Solo redirigir si no es una petición que ya maneja el 401 internamente
        // (como check de favoritos que captura el 401 y retorna false)
        const url = error.config?.url || '';
        const isHandledLocally = 
          url.includes('/favorites/check') || 
          url.includes('/favorites/check-multiple');
        
        if (!isHandledLocally && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;