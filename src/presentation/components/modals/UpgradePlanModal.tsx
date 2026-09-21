'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAvailablePlans, useSubscribeToPlan, useAvailableDeveloperDiscountCodes } from '@/presentation/hooks/useFinance';
import { useActiveSubscription } from '@/presentation/hooks/useFinance';
import { useValidateDeveloperDiscountCode, useUseDeveloperDiscountCode } from '@/presentation/hooks/admin/useDevelopers';
import { SubscriptionPlan } from '@/core/domain/entities/Wallet';
import { ActiveSubscriptionModal } from './ActiveSubscriptionModal';
import { InvalidUpgradeModal } from './InvalidUpgradeModal';
import { PlanCard } from '../finance/PlanCard/PlanCard';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { FinanceRepository } from '@/infrastructure/repositories/FinanceRepository';
import { useQueryClient } from '@tanstack/react-query';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
  const { data: plans, isLoading } = useAvailablePlans();
  const { data: activeSubscription } = useActiveSubscription();
  const { data: availableDiscountCodes } = useAvailableDeveloperDiscountCodes();
  const subscribeMutation = useSubscribeToPlan();
  const queryClient = useQueryClient();
  const [showActiveSubscriptionModal, setShowActiveSubscriptionModal] = useState(false);
  const [showInvalidUpgradeModal, setShowInvalidUpgradeModal] = useState(false);
  const [hasUsedFreePlan, setHasUsedFreePlan] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const financeRepository = new FinanceRepository();

  // Check if user is agent/developer and has available discount codes
  const userRole = authStorage.getUser()?.role;
  const isAgent = userRole === 'AGENT';
  const isDeveloper = userRole === 'DEVELOPER';
  //  SEGURIDAD: Agentes y Developers (inmobiliarias) pueden tener descuentos si tienen agencyId
  const hasAgencyRole = isAgent || isDeveloper;
  const hasDiscountCodes = hasAgencyRole && availableDiscountCodes && availableDiscountCodes.length > 0;
  
  // Auto-aplicar el primer descuento disponible para agentes
  const [autoDiscountCode, setAutoDiscountCode] = useState('');
  const [autoDiscountPercentage, setAutoDiscountPercentage] = useState(0);
  const [isIntelligentDiscount, setIsIntelligentDiscount] = useState(false);
  
  // Estado para controlar si se debe mostrar campo de código manual
  const [showManualCodeField, setShowManualCodeField] = useState(false);
  
  // Hooks para descuentos manuales
  const validateDiscountMutation = useValidateDeveloperDiscountCode();
  const useDiscountMutation = useUseDeveloperDiscountCode();
  const [manualDiscountCode, setManualDiscountCode] = useState('');
  const [appliedManualDiscount, setAppliedManualDiscount] = useState<{
    valid: boolean;
    discountPercentage?: number;
    originalPrice?: number;
    discountedPrice?: number;
    message: string;
  } | null>(null);
  const [isValidatingManual, setIsValidatingManual] = useState(false);
  
  // Función para detectar descuentos inteligentes basados en reglas de negocio - PARA AGENTES Y DEVELOPERS CON DESCUENTOS DE AGENCIA
  const detectIntelligentDiscount = (planPrice: number): { code: string; percentage: number } | null => {
    //  CRÍTICO: Solo agentes y developers con descuentos de agencia pueden tener descuentos inteligentes
    if (!hasAgencyRole || !hasDiscountCodes) {
      return null;
    }
    
    // Regla: Si el precio es 29, aplicar 20% de descuento
    if (planPrice === 29) {
      return {
        code: 'AUTO20',
        percentage: 20
      };
    }
    
    // Regla: Si el precio es 49, aplicar 15% de descuento
    if (planPrice === 49) {
      return {
        code: 'AUTO15',
        percentage: 15
      };
    }
    
    // Regla: Si el precio es 99, aplicar 10% de descuento
    if (planPrice === 99) {
      return {
        code: 'AUTO10',
        percentage: 10
      };
    }
    
    return null;
  };

  // Función para validar descuento manual
  const handleValidateManualDiscount = async (plan: SubscriptionPlan) => {
    if (!manualDiscountCode.trim()) return;
    
    setIsValidatingManual(true);
    try {
      const result = await validateDiscountMutation.mutateAsync({
        code: manualDiscountCode,
        planCode: plan.name // Usar name en lugar de code
      });
      
      setAppliedManualDiscount(result);
      
      if (!result.valid) {
        toast.error(result.message);
      } else {
        toast.success('¡Descuento aplicado correctamente!');
        setDiscountCode(manualDiscountCode);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al validar el código');
    } finally {
      setIsValidatingManual(false);
    }
  };
  
  useEffect(() => {
    if (isAgent && hasDiscountCodes && availableDiscountCodes && availableDiscountCodes.length > 0) {
      // Aplicar automáticamente el primer descuento disponible
      const firstDiscount = availableDiscountCodes[0];
      
      // El código está anidado en discountCode.code
      const discountCodeObj = (firstDiscount as any).discountCode;
      const discountCodeValue = discountCodeObj?.code || discountCodeObj;
      const discountPercentage = discountCodeObj?.discountPercentage || 0;
      
      setAutoDiscountCode(discountCodeValue);
      setAutoDiscountPercentage(discountPercentage);
      setDiscountCode(discountCodeValue);
      setIsIntelligentDiscount(false);
    }
  }, [isAgent, hasDiscountCodes, availableDiscountCodes]);

  // Lógica ultra-inteligente: Solo mostrar descuentos si realmente hay descuentos disponibles
  const hasAnyDiscountAvailable = isIntelligentDiscount || (hasAgencyRole && hasDiscountCodes) || appliedManualDiscount?.valid;
  const showDiscountField = hasAnyDiscountAvailable;

  useEffect(() => {
    const checkFreePlanUsage = async () => {
      if (isOpen) {
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            const userId = user.id;
            const used = await financeRepository.hasUserUsedFreePlan(userId);
            setHasUsedFreePlan(used);
          }
        } catch (error) {
          // Error checking free plan usage
        }
      }
    };

    checkFreePlanUsage();
  }, [isOpen]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // Crear suscripción pendiente primero
    subscribeMutation.mutate({
      planId: plan.id,
      paymentMethod: 'MERCADOPAGO',
      discountCode: discountCode || undefined,
    }, {
      onSuccess: (subscription) => {
        openMercadoPagoPayment(plan, subscription.id);
      },
      onError: (error: any) => {
        // Si es error 409 (ya tiene suscripción activa), mostrar modal bonito
        if (error?.response?.status === 409) {
          setShowActiveSubscriptionModal(true);
        } else if (error?.response?.status === 400 && error?.response?.data?.code === 'INVALID_UPGRADE') {
          setShowInvalidUpgradeModal(true);
        } else {
          toast.error(error.response?.data?.message || 'Error al crear suscripción');
        }
      }
    });
  };

  /**
   * Obtiene el deviceSessionId de MercadoPago esperando a que security.js termine de cargar.
   * security.js se carga de forma async en layout.tsx, pero puede no haber terminado
   * cuando el usuario hace clic en "Suscribirme". Esta función asegura esperar hasta que
   * MP_DEVICE_SESSION_ID esté disponible.
   */
  const getDeviceSessionId = (): Promise<string> => {
    return new Promise((resolve) => {
      // Caso 1: Ya está disponible
      if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
        resolve((window as any).MP_DEVICE_SESSION_ID);
        return;
      }

      // Caso 2: Esperar a que security.js termine de cargar y generar el ID
      // El security.js de MP inyecta MP_DEVICE_SESSION_ID global cuando termina
      let attempts = 0;
      const maxAttempts = 50; // ~5 segundos máximo de espera (50 * 100ms)
      
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
          clearInterval(checkInterval);
          resolve((window as any).MP_DEVICE_SESSION_ID);
          return;
        }
        // Si no aparece después de los intentos, inyectar security.js manualmente
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          
          // Inyectar security.js manualmente como fallback
          const script = document.createElement('script');
          script.src = 'https://www.mercadopago.com/v2/security.js';
          script.setAttribute('view', 'checkout');
          script.async = true;
          script.onload = () => {
            // Dar tiempo extra para que MP_DEVICE_SESSION_ID se genere
            setTimeout(() => {
              if ((window as any).MP_DEVICE_SESSION_ID) {
                resolve((window as any).MP_DEVICE_SESSION_ID);
              } else {
                resolve(''); // Último recurso: vacío
              }
            }, 500);
          };
          script.onerror = () => resolve(''); // Si falla, continuar sin deviceSessionId
          document.head.appendChild(script);
        }
      }, 100);
    });
  };

  const openMercadoPagoPayment = (plan: SubscriptionPlan, subscriptionId: string) => {
    const finalPrice = plan.agencyDiscountedPrice || plan.price;
    window.location.href = `/checkout/${subscriptionId}?amount=${finalPrice}&plan=${encodeURIComponent(plan.name)}`;
  };

  // Determinar si el plan FREE está agotado (si el usuario ya lo usó)
  const isPlanExhausted = (plan: SubscriptionPlan) => {
    if (plan.id !== 'FREE') return false;
    
    // Si tiene suscripción activa diferente de FREE, el FREE está agotado
    if (activeSubscription && (activeSubscription as any).tier !== 'FREE') {
      return true;
    }
    
    // Si tiene suscripción FREE activa pero ya usó todas las publicaciones, está agotado
    if (activeSubscription && (activeSubscription as any).tier === 'FREE' && (activeSubscription as any).publicationsLimit - (activeSubscription as any).publicationsUsed <= 0) {
      return true;
    }
    
    // Si el modal se abre, es porque el usuario intenta publicar otra propiedad
    // Esto significa que ya usó su plan gratuito de 1 propiedad
    return true;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal principal de upgrade */}
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Actualiza tu plan
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Elige el plan perfecto para publicar más propiedades y hacer crecer tu negocio inmobiliario.
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold"
              >
                X
              </button>
            </div>
          </div>

          {/* Discount Code Section - Solo mostrar si realmente hay descuentos disponibles */}
          {showDiscountField && (
            <div className="px-6 pb-4 border-b border-gray-200">
              {isIntelligentDiscount ? (
                // Descuento inteligente - NO mostrar opción manual
                <div className="bg-blue-50 border-blue-200 border rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Descuento inteligente aplicado automáticamente
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-blue-100 border-blue-300 border rounded">
                        <span className="font-mono text-sm font-bold text-blue-800">
                          {autoDiscountCode}
                        </span>
                      </div>
                      <span className="text-xs text-blue-700">
                        -{autoDiscountPercentage}% OFF
                      </span>
                    </div>
                    <div className="text-xs text-blue-600">
                      Descuento especial según precio del plan
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    Este descuento se aplicó automáticamente basado en el precio del plan seleccionado.
                  </div>
                </div>
              ) : (hasAgencyRole && hasDiscountCodes) ? (
                // Descuento de agencia - NO mostrar opción manual
                <div className="bg-green-50 border-green-200 border rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Descuento de agencia aplicado automáticamente
                  </label>
                  <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-green-100 border-green-300 border rounded">
                      <span className="font-mono text-sm font-bold text-green-800">
                        {autoDiscountCode}
                      </span>
                    </div>
                    <span className="text-xs text-green-700">
                      -{autoDiscountPercentage}% OFF
                    </span>
                  </div>
                  <div className="text-xs text-green-600">
                    Descuento de tu inmobiliaria aplicado
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-700">
                  Descuento de agencia disponible y aplicado automáticamente.
                </div>
              </div>
            ) : showDiscountField ? (
              // Solo código manual - porque no hay automáticos
              <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-4">
                <label className="block text-sm font-medium text-yellow-900 mb-2">
                  ¿Tienes un código de descuento?
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ingresa tu código de descuento"
                    value={manualDiscountCode}
                    onChange={(e) => setManualDiscountCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    disabled={isValidatingManual}
                  />
                  <div className="text-xs text-yellow-700">
                    Agrega tu código personal para obtener un descuento especial.
                  </div>
                  {appliedManualDiscount?.valid ? (
                    <div className="text-xs text-green-600">
                      {appliedManualDiscount.message}
                    </div>
                  ) : (
                    <div className="text-xs text-red-600">
                      {appliedManualDiscount?.message}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No hay planes disponibles en este momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Modal de suscripción activa */}
    <ActiveSubscriptionModal
      isOpen={showActiveSubscriptionModal}
      onClose={() => {
        setShowActiveSubscriptionModal(false);
        onClose(); // Cerrar también el modal principal
      }}
      activeSubscription={activeSubscription || null}
    />

      {/* Modal de upgrade inválido */}
      <InvalidUpgradeModal
        isOpen={showInvalidUpgradeModal}
        onClose={() => {
          setShowInvalidUpgradeModal(false);
        }}
        currentPlan={activeSubscription?.plan?.name}
        selectedPlan={undefined}
      />
    </>
  );
}