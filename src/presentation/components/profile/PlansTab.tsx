'use client';

import { useState, useEffect } from 'react';
import { User } from '@/core/domain/entities';
import { Button } from '@/presentation/components/ui';
import { useAvailablePlans, useActiveSubscription, useSubscribeToPlan, useAvailableDeveloperDiscountCodes } from '@/presentation/hooks/useFinance';
import { useMyProperties } from '@/presentation/hooks/useProperties';
import { PlanCard } from '@/presentation/components/finance';
import { SubscriptionPlan } from '@/core/domain/entities/Wallet';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { toast } from 'sonner';
import { Crown, Loader } from 'lucide-react';

interface PlansTabProps {
  user: User;
}

export const PlansTab: React.FC<PlansTabProps> = ({ user }) => {
  const { data: plans, isLoading } = useAvailablePlans();
  const { data: activeSubscription, refetch: refetchSubscription } = useActiveSubscription();
  const { data: propertiesData } = useMyProperties();
  const { data: agentDiscounts } = useAvailableDeveloperDiscountCodes();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const subscribeMutation = useSubscribeToPlan();

  // Debug: Ver qué descuentos está recibiendo el agente
  console.log('Agente ID:', user.id);
  console.log('Descuentos del agente:', agentDiscounts);

  // Calculate published properties count
  const publishedCount = (propertiesData?.properties || []).filter(
    (p: any) => p.status === 'PUBLISHED'
  ).length;

  useEffect(() => {
    refetchSubscription();
  }, [refetchSubscription]);

  // Lógica para detectar plan agotado (misma que /planes)
  const isPlanExhausted = (plan: SubscriptionPlan) => {
    if (plan.id !== 'FREE') return false;

    // Tiene suscripción de pago → FREE agotado
    if (activeSubscription && (activeSubscription as any).tier !== 'FREE') return true;

    // Tiene FREE pero sin publicaciones restantes → agotado
    if (activeSubscription && (activeSubscription as any).tier === 'FREE' 
        && activeSubscription.remainingPublications <= 0) return true;

    // Sin suscripción pero ya publicó 1 → agotado
    if (!activeSubscription && publishedCount >= 1) return true;

    return false;
  };

  /**
   * Obtiene el deviceSessionId de MercadoPago esperando a que security.js termine de cargar.
   * Sin esto MP rechaza con cc_rejected_high_risk.
   */
  const getDeviceSessionId = (): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
        resolve((window as any).MP_DEVICE_SESSION_ID);
        return;
      }
      let attempts = 0;
      const maxAttempts = 50;
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
          clearInterval(checkInterval);
          resolve((window as any).MP_DEVICE_SESSION_ID);
          return;
        }
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          const script = document.createElement('script');
          script.src = 'https://www.mercadopago.com/v2/security.js';
          script.setAttribute('view', 'checkout');
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              resolve((window as any).MP_DEVICE_SESSION_ID || '');
            }, 500);
          };
          script.onerror = () => resolve('');
          document.head.appendChild(script);
        }
      }, 100);
    });
  };

  // Lógica de suscripción con descuento automático
  const handleSubscribe = () => {
    if (!selectedPlan) return;

    // Obtener el mejor descuento disponible automáticamente
    const bestDiscount = agentDiscounts?.find((discount: any) => 
      discount.status === 'ACTIVE' && 
      (!discount.validUntil || new Date(discount.validUntil) > new Date())
    );

    console.log('Mejor descuento encontrado:', bestDiscount);
    console.log('Código de descuento a usar:', bestDiscount?.code);

    subscribeMutation.mutate({
      planId: selectedPlan.id,
      paymentMethod: 'MERCADOPAGO',
      discountCode: bestDiscount?.code,
    }, {
      onSuccess: async (subscription) => {
        try {
          console.log('Suscripcion creada exitosamente:', subscription);
          const token = authStorage.getToken();
          console.log('Token obtenido:', token ? 'Presente' : 'Ausente');
          
          // 🔴 CRÍTICO: Obtener deviceSessionId para antifraude
          const deviceSessionId = await getDeviceSessionId();
          console.log('MP Device Session ID (PlansTab):', deviceSessionId || '(no disponible)');
          
          const response = await fetch(
            `/api/finance/mercadopago/create-preference`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                subscriptionId: subscription.id.toString(),
                title: selectedPlan.name,
                unitPrice: selectedPlan.price,
                frontendUrl: window.location.origin,
                deviceSessionId  // 🔴 CRÍTICO: fingerprint del dispositivo
              })
            }
          );

          console.log('Respuesta de create-preference:', response.status, response.statusText);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en create-preference:', response.status, errorText);
            toast.error(`Error al crear preferencia de pago: ${response.status}`);
            return;
          }

          const data = await response.json();
          console.log('Datos de preferencia:', data);
          // Usar init_point (producción) primero. sandbox_init_point solo para pruebas.
          const url = data.init_point || data.initPoint ||
                      data.sandbox_init_point || data.sandboxInitPoint;

          console.log('URL de pago:', url);

          if (url) {
            window.location.href = url;
          } else {
            console.error('No se encontro URL en respuesta:', Object.keys(data));
            toast.error('No se recibio URL de pago del servidor');
          }
        } catch (error) {
          console.error('Error en flujo de pago:', error);
          toast.error('Error al iniciar el pago: ' + (error as any).message);
        }
      },
      onError: (error: any) => {
        if (error?.response?.status === 409) {
          toast.error('Ya tienes una suscripción activa');
        } else {
          toast.error(error.response?.data?.message || 'Error al crear suscripción');
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Mi Plan</h2>
        <p className="text-gray-600">
          Elige el plan que mejor se adapte a tus necesidades como {user.role === 'AGENT' ? 'agente inmobiliario' : 'desarrollador'}.
        </p>
      </div>

      {/* Códigos de Descuento Disponibles - Solo para agentes */}
      {user.role === 'AGENT' && agentDiscounts && agentDiscounts.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">Tus Códigos de Descuento</h3>
          </div>
          <div className="space-y-3">
            {agentDiscounts.map((discount: any, index: number) => (
              <div key={index} className="bg-white rounded-lg border border-green-300 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-lg font-bold text-green-800 bg-green-100 px-3 py-1 rounded">
                      {discount.code}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      {discount.discountPercentage}% de descuento
                    </p>
                    {discount.validUntil && (
                      <p className="text-xs text-green-600 mt-1">
                        Válido hasta: {new Date(discount.validUntil).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => navigator.clipboard.writeText(discount.code)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Copiar código
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-700 mt-3">
            Usa estos códigos al momento de pagar para obtener tu descuento
          </p>
        </div>
      )}

      {/* Plan Actual */}
      {activeSubscription && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Plan Actual</p>
              <p className="text-lg font-bold text-blue-900">
                {(activeSubscription as any).tier || activeSubscription.plan?.id || 'Gratis'}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Activo
            </div>
          </div>
        </div>
      )}

      {/* Planes Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando planes...</p>
          </div>
        ) : plans ? (
          plans.map((plan) => {
            const backendTier = activeSubscription
              ? (activeSubscription as any).tier || activeSubscription.plan?.id
              : null;
            const isActive = !activeSubscription
              ? plan.id === 'FREE'
              : backendTier === plan.id;
            const isExhausted = isPlanExhausted(plan);

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelectPlan={setSelectedPlan}
                isSelected={selectedPlan?.id === plan.id}
                isActive={isActive && !isExhausted}
                isExhausted={isExhausted}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-red-600">No se pudieron cargar los planes. Intenta nuevamente.</p>
          </div>
        )}
      </div>

      {/* Botón de suscripción */}
      {selectedPlan && (
        <div className="mt-8 text-center">
          <Button
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending}
            variant="primary"
            className="min-w-[200px]"
          >
            {subscribeMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin h-5 w-5" />
                Procesando...
              </span>
            ) : (
              `Suscribirse al Plan ${selectedPlan.name} - S/ ${selectedPlan.price.toLocaleString('es-PE')}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
