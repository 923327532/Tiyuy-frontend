/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURACIÓN CENTRALIZADA - Único punto de configuración
 * ═══════════════════════════════════════════════════════════════
 * 
 * Si cambias de proveedor (correo, API, hosting, etc.):
 * 1. Solo modifica tu .env
 * 2. NO toques este archivo ni ningún otro
 * 3. Los valores se propagan automáticamente
 * ═══════════════════════════════════════════════════════════════
 */

// ============================================
// CLIENTE (Navegador) - Deben empezar con NEXT_PUBLIC_
// ============================================
export const env = {
  // --- URLs ---
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.tiyuy.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tiyuy.com',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.tiyuy.com',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'TIYUY',

  // --- WebSocket ---
  wsHost: process.env.NEXT_PUBLIC_WS_HOST || '',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || '',

  // --- APIs Externas ---
  googlePlacesKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
  mpPublicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '',
  culqiPublicKey: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || '',
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',

  // --- Entorno ---
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

// ============================================
// SERVIDOR (API Routes de Next.js) - NO tienen NEXT_PUBLIC_
// ============================================
export const serverEnv = {
  backendUrl: process.env.BACKEND_URL || 'https://api.tiyuy.com',
  brevoApiKey: process.env.BREVO_API_KEY || '',
  // AI Copilot Agent - LLM endpoint URL for server-side API routes
  // When changing providers, update LLM_API_URL and LLM_MODEL in env
  llmApiUrl: process.env.LLM_API_URL || 'https://api.deepseek.com/v1/chat/completions',
  llmApiKey: process.env.LLM_API_KEY || '',
  llmModel: process.env.LLM_MODEL || 'deepseek-chat',
} as const;
