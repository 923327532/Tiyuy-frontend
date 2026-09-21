'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { XCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://www.tiyuy.com';

/**
 * Página de confirmación de pago con lógica completa de fallback:
 * 
 * REGLAS DE NEGOCIO:
 * - status=failure  → mostrar rechazo inmediato, NO procesar nada
 * - status=pending  → mostrar pendiente, NO procesar nada (YAPE/efectivo)
 * - status=success o sin status + paymentId REAL → procesar + polling
 * - paymentId="rejected" o "pending" o "unknown" → no son paymentId reales, no procesar
 */
export function PaymentConfirmationClient({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<'loading' | 'processing' | 'success' | 'pending' | 'failure' | 'error'>('loading');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
  const [subscriptionTier, setSubscriptionTier] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Obtener parámetros de la URL
  const subscriptionId = searchParams.get('subscription_id');
  const urlStatus = searchParams.get('status');

  /**
   * Llama al endpoint que fuerza el procesamiento del pago consultando a MP
   * Solo debe llamarse cuando tenemos un paymentId REAL (no fake como "rejected")
   */
  const forceProcessPayment = useCallback(async (): Promise<boolean> => {
    const isFakeId = !paymentId || paymentId === 'unknown' || paymentId === 'undefined' 
                   || paymentId === 'rejected' || paymentId === 'pending';
    if (isFakeId) return false;

    try {
      setStatus('processing');
      
      const response = await fetch(`${API_BASE}/api/finance/mercadopago/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentId: paymentId,
          subscriptionId: subscriptionId
        })
      });

      const data = await response.json();
      console.log('🔧 Force process payment response:', data);
      
      if (data.activated) {
        setStatus('success');
        setSubscriptionTier(data.tier || '');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error forcing payment process:', err);
      return false;
    }
  }, [paymentId, subscriptionId]);

  /**
   * Verifica si la suscripción ya está activa via el check-payment endpoint
   */
  const checkSubscriptionStatus = useCallback(async (): Promise<boolean> => {
    if (!subscriptionId || subscriptionId === 'null' || subscriptionId === 'undefined') {
      return false;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/finance/mercadopago/check-payment?subscriptionId=${subscriptionId}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      
      console.log('🔍 Check payment status:', data);
      setSubscriptionStatus(data.status || '');
      
      if (data.activated) {
        setStatus('success');
        setSubscriptionTier(data.tier || '');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error checking subscription status:', err);
      return false;
    }
  }, [subscriptionId]);

  /**
   * Lógica principal - se ejecuta una vez al cargar la página.
   * Decide qué hacer según el status que MP haya enviado en la URL.
   */
  useEffect(() => {
    let isCancelled = false;
    let pollInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let pollCount = 0;
    const MAX_POLLS = 15;

    const init = async () => {
      // Caso 1: MP dijo rechazo explícito
      if (urlStatus === 'failure') {
        setStatus('failure');
        setErrorMessage('El pago fue rechazado por MercadoPago. Puedes intentar con otro método de pago.');
        return;
      }

      // Caso 2: MP dijo pendiente (YAPE, efectivo, etc.)
      if (urlStatus === 'pending') {
        setStatus('pending');
        setSubscriptionStatus('PENDING');
        return;
      }

      // Caso 3: paymentId no es real (viene de /failure o /pending sin payment)
      const isFakePaymentId = !paymentId || paymentId === 'unknown' || paymentId === 'undefined' 
                            || paymentId === 'rejected' || paymentId === 'pending';
      
      if (isFakePaymentId) {
        // Solo polling de verificación si tenemos subscriptionId
        if (subscriptionId && subscriptionId !== 'null' && subscriptionId !== 'undefined') {
          const activated = await checkSubscriptionStatus();
          if (activated || isCancelled) return;
          
          pollInterval = setInterval(async () => {
            if (isCancelled) return;
            pollCount++;
            if (await checkSubscriptionStatus()) {
              if (pollInterval) clearInterval(pollInterval);
            } else if (pollCount >= MAX_POLLS && pollInterval) {
              clearInterval(pollInterval);
              setStatus('pending');
            }
          }, 3000);
        } else {
          setStatus('pending');
          setSubscriptionStatus('PENDING');
        }
        return;
      }

      // Caso 4: paymentId REAL - procesar y hacer polling para confirmar activación
      const activated = await forceProcessPayment();
      if (isCancelled || activated) return;

      pollInterval = setInterval(async () => {
        if (isCancelled) return;
        pollCount++;
        if (await checkSubscriptionStatus()) {
          if (pollInterval) clearInterval(pollInterval);
        } else if (pollCount >= MAX_POLLS && pollInterval) {
          clearInterval(pollInterval);
          setStatus('pending');
          setSubscriptionStatus('PENDING');
        }
      }, 3000);

      timeoutId = setTimeout(() => {
        if (isCancelled) return;
        if (pollInterval) clearInterval(pollInterval);
        setStatus('pending');
        setSubscriptionStatus('PENDING');
      }, 60000);
    };

    init();

    return () => {
      isCancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [paymentId, subscriptionId, urlStatus, forceProcessPayment, checkSubscriptionStatus]);

  /**
   * Auto-redirección después de éxito
   * Usa window.location.href para forzar recarga completa de la página
   * y que React Query refetchee la suscripción activa desde el backend.
   * Con router.push(), la caché stale de ['subscription', 'active']
   * hace que el plan no se pinte como activo.
   */
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setIsRedirecting(true);
        // Forzar recarga completa para que React Query refetchee la suscripción
        window.location.href = '/dashboard?payment_success=true';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  /**
   * Reintentar procesamiento manual (botón "Verificar Estado")
   */
  const handleRetry = async () => {
    setStatus('processing');
    setErrorMessage('');
    
    const isFakePaymentId = !paymentId || paymentId === 'unknown' || paymentId === 'undefined' 
                          || paymentId === 'rejected' || paymentId === 'pending';
    
    if (!isFakePaymentId) {
      const activated = await forceProcessPayment();
      if (activated) return;
    }
    
    // Polling de verificación
    let pollCount = 0;
    const interval = setInterval(async () => {
      pollCount++;
      if (await checkSubscriptionStatus()) {
        clearInterval(interval);
      } else if (pollCount >= 10) {
        clearInterval(interval);
        setStatus('pending');
      }
    }, 3000);
  };

  // ── RENDERIZADO POR ESTADO ──

  if (status === 'loading' || status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Loader2 className="inline-block animate-spin h-16 w-16 text-green-600" />
          <p className="mt-8 text-xl text-gray-600 font-semibold">Verificando tu pago...</p>
          <p className="mt-2 text-sm text-gray-400">
            {status === 'processing' 
              ? 'Estamos consultando con MercadoPago para confirmar tu pago'
              : 'Por favor espera un momento mientras procesamos tu pago'}
          </p>
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Loader2 className="animate-spin h-3 w-3" />
              <span>Consultando estado del pago...</span>
            </div>
            {subscriptionId && (
              <p className="text-xs text-gray-300">
                Suscripción #{subscriptionId}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error en la Confirmación</h1>
          <p className="text-gray-600 mb-6">{errorMessage || 'No pudimos verificar tu pago.'}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
            <button
              onClick={() => router.push('/payments')}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Ver Mis Pagos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failure') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pago No Procesado</h1>
          <p className="text-gray-600 mb-2">{errorMessage || 'El pago no pudo ser completado.'}</p>
          <p className="text-sm text-gray-400 mb-6">
            Puedes intentar nuevamente desde la sección de planes.
          </p>
          <button
            onClick={() => router.push('/plans')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Volver a Planes
          </button>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-yellow-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pago Pendiente</h1>
          <p className="text-gray-600 mb-2">
            Tu pago está siendo procesado por MercadoPago.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Esto puede tomar unos minutos. Vuelve más tarde para verificar el estado.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Verificar Estado
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Ir al Dashboard
            </button>
          </div>
          {subscriptionId && (
            <p className="mt-4 text-xs text-gray-300">
              Si el pago fue exitoso, tu plan se activará automáticamente.
              ID de referencia: {subscriptionId}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Success
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-12 text-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold mb-4">¡Pago Exitoso!</h1>
                  <p className="text-xl mb-8 text-green-100">
                    Tu pago ha sido procesado correctamente
                  </p>
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between">
                      <span className="text-green-100">ID del Pago:</span>
                      <span className="font-mono">#{paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-100">Estado:</span>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        Aprobado
                      </span>
                    </div>
                    {subscriptionTier && (
                      <div className="flex justify-between">
                        <span className="text-green-100">Plan:</span>
                        <span className="text-green-100 font-semibold">{subscriptionTier}</span>
                      </div>
                    )}
                  </div>
                  {isRedirecting && (
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                        <Loader2 className="animate-spin h-4 w-4 text-white" />
                        <span>Redirigiendo al dashboard...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-12 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pago</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué sigue ahora?</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Tu plan ya está activo. ¡Puedes empezar a usarlo!</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Recibirás un email de confirmación</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Puedes publicar propiedades y proyectos</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Transacción</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ID de Referencia:</span>
                        <span className="font-mono text-xs">{paymentId}</span>
                      </div>
                      {subscriptionId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Suscripción:</span>
                          <span className="font-mono text-xs">#{subscriptionId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
                  >
                    Ir al Dashboard
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold cursor-pointer"
                  >
                    Imprimir Comprobante
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}