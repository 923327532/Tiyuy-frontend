'use client';

import { useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { env } from '@/config/env';

export function useMercadoPagoInit() {
  useEffect(() => {
    if (env.mpPublicKey) {
      initMercadoPago(env.mpPublicKey, { locale: 'es-PE' });
    } else {
      console.warn('NEXT_PUBLIC_MP_PUBLIC_KEY no configurada');
    }
  }, []);
}