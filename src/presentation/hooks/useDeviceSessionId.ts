'use client';

/**
 * Obtiene el deviceSessionId de MercadoPago esperando a que security.js termine de cargar.
 * Sin esto MP rechaza con cc_rejected_high_risk porque no puede asociar el dispositivo.
 * MP_DEVICE_SESSION_ID lo genera security.js de MP cuando termina de cargar.
 */
export function getDeviceSessionId(): Promise<string> {
  return new Promise((resolve) => {
    // Caso 1: Ya está disponible
    if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
      resolve((window as any).MP_DEVICE_SESSION_ID);
      return;
    }

    // Caso 2: Esperar a que security.js termine de cargar (polling hasta 5s)
    const maxAttempts = 25; // ~5 segundos con intervalos de 200ms
    let attempts = 0;

    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
        clearInterval(checkInterval);
        resolve((window as any).MP_DEVICE_SESSION_ID);
        return;
      }

      // Fallback: inyectar security.js manualmente si no aparece
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);

        const script = document.createElement('script');
        script.src = 'https://www.mercadopago.com/v2/security.js';
        script.setAttribute('view', 'checkout');
        script.onload = () => {
          setTimeout(() => {
            resolve((window as any).MP_DEVICE_SESSION_ID || '');
          }, 500);
        };
        script.onerror = () => resolve('');
        document.head.appendChild(script);
      }
    }, 200);
  });
}