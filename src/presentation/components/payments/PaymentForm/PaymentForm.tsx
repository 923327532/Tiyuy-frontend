'use client';

import { useEffect, useRef, useState } from 'react';
import { PaymentRequest } from '@/core/domain/entities/Wallet';
import { useProcessPayment } from '@/presentation/hooks/usePayments';
import { useValidateDeveloperDiscountCode, useUseDeveloperDiscountCode } from '@/presentation/hooks/admin/useDevelopers';
import { apiClient } from '@/infrastructure/api/axios-client';
import { Icon } from '@iconify/react';
import { Check, CreditCard, Crown, DollarSign, Globe, Loader, Shield } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  description: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  planName?: string;
  planCode?: string;
  userId?: number;
}

export function PaymentForm({ 
  amount, 
  description, 
  onPaymentSuccess,
  onPaymentError,
  planName,
  planCode = 'BASIC',
  userId
}: PaymentFormProps) {
  const processPaymentMutation = useProcessPayment();
  const validateDiscountMutation = useValidateDeveloperDiscountCode();
  const useDiscountMutation = useUseDeveloperDiscountCode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardFormReady, setCardFormReady] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    valid: boolean;
    discountPercentage?: number;
    originalPrice?: number;
    discountedPrice?: number;
    message: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const finalAmount = appliedDiscount?.discountedPrice ?? amount;
  // Referencia compartida a la instancia de MP para usar en ambos flujos
  const mpRef = useRef<any>(null);

  // Obtener deviceSessionId del security.js de MP
  const getDeviceSessionId = (): string => {
    if (typeof window !== 'undefined' && (window as any).MP_DEVICE_SESSION_ID) {
      return (window as any).MP_DEVICE_SESSION_ID;
    }
    return '';
  };

  // Botón "Pagar con MercadoPago" (Checkout Pro)
  const handleMercadoPagoCheckout = async () => {
    setIsProcessing(true);
    try {
      // security.js (cargado desde layout.tsx) ya generó MP_DEVICE_SESSION_ID
      // Este ID es el device fingerprint que MP necesita para evaluar riesgo
      const deviceSessionId = getDeviceSessionId();
      console.log('MP Device Session ID:', deviceSessionId);
      
      const response = await apiClient.post('/finance/mercadopago/create-preference', {
        subscriptionId: null,
        unitPrice: finalAmount,
        title: planName || description,
        frontendUrl: window.location.origin,
        deviceSessionId,
      });

      const data = response.data;
      
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else if (data.sandboxInitPoint) {
        window.location.href = data.sandboxInitPoint;
      } else {
        onPaymentError('Error al obtener el punto de pago');
      }
    } catch (error: any) {
      onPaymentError(error.response?.data?.error || error.message || 'Error al iniciar el pago con MercadoPago');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setIsValidating(true);
    try {
      const result = await validateDiscountMutation.mutateAsync({
        code: discountCode,
        planCode
      });
      
      setAppliedDiscount(result);
      
      if (!result.valid) {
        onPaymentError(result.message);
      }
    } catch (error: any) {
      onPaymentError(error.message || 'Error al validar el código');
    } finally {
      setIsValidating(false);
    }
  };

  const handleUseDiscount = async () => {
    if (!appliedDiscount?.valid || !userId) return;
    
    try {
      await useDiscountMutation.mutateAsync({
        code: discountCode,
        planCode,
        userId
      });
    } catch (error: any) {
      console.error('Error usando descuento:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MercadoPago) {
      const mp = new (window as any).MercadoPago(
        process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
        { locale: 'es-PE' }
      );
      mpRef.current = mp; // Guardar referencia para usarla en handleMercadoPagoCheckout

      const cardForm = mp.cardForm({
        amount: Number(finalAmount),
        autoMount: true,
        processingMode: 'aggregator',
        callback: {
          onReady: () => {
            setCardFormReady(true);
            console.log('MercadoPago card form ready');
          },
          onSubmit: async (cardData: any) => {
            setIsProcessing(true);
            try {
              if (appliedDiscount?.valid && userId) {
                await handleUseDiscount();
              }

              const sessionId = mp.getSessionId();
              const deviceSessionId = getDeviceSessionId();
              console.log('MP Session ID (cardForm):', sessionId, 'Device:', deviceSessionId);

              const result = await processPaymentMutation.mutateAsync({
                token: cardData.token,
                amount: finalAmount,
                description,
                sessionId,
                deviceSessionId,
              });

              if (result.status === 'APPROVED') {
                onPaymentSuccess(String(result.transactionId || result.id));
              } else {
                onPaymentError(result.errorMessage || 'Pago rechazado');
              }
            } catch (error: any) {
              onPaymentError(error.message || 'Error al procesar el pago');
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (error: any) => {
            console.error('MercadoPago error:', error);
            onPaymentError(error.message || 'Error en el formulario de pago');
            setIsProcessing(false);
          }
        }
      });

      cardForm.mount('cardForm_container');

      return () => {
        cardForm.unmount();
      };
    }
  }, [finalAmount, description]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {planName ? `Suscribirse al ${planName}` : 'Realizar Pago'}
        </h2>
        <p className="text-4xl font-bold text-green-600 mb-2">
          S/ {finalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </p>
        {appliedDiscount?.valid && (
          <div className="text-sm text-green-600 mb-1">
            <span className="line-through text-gray-400">
              S/ {amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <span className="ml-2 font-semibold">
              {appliedDiscount.discountPercentage}% de descuento aplicado
            </span>
          </div>
        )}
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Discount Code Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4" />
          ¿Tienes un código de descuento de tu inmobiliaria?
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código (ej: DESCUENTO20)"
            className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
            disabled={appliedDiscount?.valid || isValidating}
          />
          <button
            onClick={handleValidateDiscount}
            disabled={!discountCode.trim() || isValidating || appliedDiscount?.valid}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              appliedDiscount?.valid
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
            }`}
          >
            {isValidating ? (
              <span className="flex items-center gap-1">
                <Loader className="animate-spin h-4 w-4" />
                Validando...
              </span>
            ) : appliedDiscount?.valid ? (
              '✓ Aplicado'
            ) : (
              'Aplicar'
            )}
          </button>
        </div>
        {appliedDiscount?.valid && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <Check className="w-3 h-3" />
            {appliedDiscount.message}
          </p>
        )}
        {appliedDiscount && !appliedDiscount.valid && (
          <p className="text-xs text-red-600 mt-2">{appliedDiscount.message}</p>
        )}
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Credit Card Form */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Tarjeta de Crédito/Débito
          </h3>
          <div 
            id="cardForm_container" 
            className="min-h-[200px] bg-white rounded-lg p-4"
          />
          {!cardFormReady && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 mt-2">Cargando formulario seguro...</p>
            </div>
          )}
        </div>

        {/* Other Payment Methods */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Otros Métodos de Pago
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleMercadoPagoCheckout}
              disabled={isProcessing}
              className="w-full p-4 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="simple-icons:mercadopago" className="w-8 h-8" />
              <span className="font-semibold">
                {isProcessing ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}
              </span>
            </button>
            
            <button className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">Yape (Próximamente)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Pago 100% Seguro</p>
            <p>Tu información está protegida con encriptación SSL</p>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {(isProcessing || processPaymentMutation.isPending) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Procesando Pago</h3>
              <p className="text-gray-600">Por favor espera, estamos procesando tu pago de forma segura...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}