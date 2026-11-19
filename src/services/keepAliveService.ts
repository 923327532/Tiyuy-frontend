/**
 * Servicio keep-alive para evitar cold start del backend.
 * Hace un ping al backend cada 4 minutos para mantenerlo despierto.
 */
let intervalId: ReturnType<typeof setInterval> | null = null;

const KEEP_ALIVE_URL = '/api/payments/health';
const INTERVAL_MS = 4 * 60 * 1000; // cada 4 minutos

async function pingBackend() {
  try {
    const response = await fetch(KEEP_ALIVE_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // timeout 10s
    });
    if (response.ok) {
      console.debug('[KeepAlive] Backend responde OK');
    } else {
      console.debug('[KeepAlive] Backend respondió con status:', response.status);
    }
  } catch {
    // Silencioso - no queremos loguear errores de keep-alive
  }
}

export function startKeepAlive() {
  if (typeof window === 'undefined') return; // Solo en cliente
  if (intervalId) return; // Ya iniciado

  // Primer ping inmediato para despertar el backend
  pingBackend();

  // Luego cada 4 minutos
  intervalId = setInterval(pingBackend, INTERVAL_MS);
  console.debug('[KeepAlive] Servicio iniciado');
}

export function stopKeepAlive() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.debug('[KeepAlive] Servicio detenido');
  }
}