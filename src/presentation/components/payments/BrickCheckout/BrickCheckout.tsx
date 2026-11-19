'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { getDeviceSessionId } from '@/presentation/hooks/useDeviceSessionId';
import { authStorage } from '@/infrastructure/storage/auth-storage';

interface Props {
  amount: number;
  subscriptionId: string;
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

// Mapa de traducción de errores de MercadoPago (fallback para el frontend)
const MP_ERROR_TRANSLATIONS: Record<string, string> = {
  'cc_rejected_insufficient_amount': 'Fondos insuficientes en la tarjeta.',
  'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto. Verifica el CVV.',
  'cc_rejected_bad_filled_card_number': 'Número de tarjeta incorrecto. Verifica el número.',
  'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta. Verifica la fecha.',
  'cc_rejected_call_for_authorize': 'Debes autorizar el pago llamando a tu banco.',
  'cc_rejected_card_disabled': 'Tarjeta deshabilitada. Contacta a tu banco.',
  'cc_rejected_duplicated_payment': 'Pago duplicado. Ya realizaste este pago antes.',
  'cc_rejected_high_risk': 'Pago rechazado por prevención de fraude. Intenta con otra tarjeta o contacta a tu banco.',
  'cc_rejected_max_attempts': 'Alcanzaste el máximo de intentos. Espera unos minutos e intenta de nuevo.',
  'cc_rejected_blacklist': 'Pago rechazado por prevención de fraude. Contacta a tu banco.',
  'rejected_high_risk': 'Pago rechazado por prevención de fraude. Intenta con otra tarjeta.',
};

/**
 * Traduce un status_detail de MercadoPago a un mensaje legible.
 * Si no está en el mapa, intenta limpiar el código raw.
 */
function translateMpError(statusDetail: string): string {
  if (!statusDetail) return 'El pago fue rechazado. Intenta con otra tarjeta.';
  const cleaned = statusDetail.replace(/^Pago rechazado: /, '');
  if (MP_ERROR_TRANSLATIONS[cleaned]) return MP_ERROR_TRANSLATIONS[cleaned];
  // Si el backend ya tradujo (empieza con mayúscula o es español), devolverlo tal cual
  if (!cleaned.startsWith('cc_rejected') && !cleaned.startsWith('rejected')) return statusDetail;
  // Fallback: limpiar underscores y mostrar en minúsculas
  return 'Pago rechazado: ' + cleaned.replace(/_/g, ' ').toLowerCase();
}

export function BrickCheckout({ amount, subscriptionId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardDni, setCardDni] = useState('');

  // Cargar SDK al montar
  useEffect(() => {
    if (!PUBLIC_KEY) return;
    if (!(window as any).MercadoPago) {
      const s = document.createElement('script');
      s.src = 'https://sdk.mercadopago.com/js/v2';
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  const formatCardNumber = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PUBLIC_KEY) { setError('Error de configuración.'); return; }
    setProcessing(true);
    setError(null);

    try {
      // Esperar SDK
      while (!(window as any).MercadoPago) {
        await new Promise(r => setTimeout(r, 200));
      }

      const mp = new (window as any).MercadoPago(PUBLIC_KEY, { locale: 'es-PE' });
      const [month, year] = cardExpiry.split('/');
      const cleanCardNumber = cardNumber.replace(/\s/g, '');

      if (!month || !year) {
        setError('Fecha de vencimiento inválida.');
        setProcessing(false);
        return;
      }

      // 1. Detectar el payment_method_id REAL a partir del BIN (primeros 6 dígitos)
      const bin = cleanCardNumber.slice(0, 6);
      let paymentMethodId = '';

      try {
        const paymentMethods = await mp.getPaymentMethods({ bin });
        if (paymentMethods?.results?.length > 0) {
          paymentMethodId = paymentMethods.results[0].id;
        }
      } catch (pmErr) {
        console.error('Error consultando payment methods:', pmErr);
      }

      if (!paymentMethodId) {
        setError('No pudimos identificar el tipo de tarjeta. Verifica el número ingresado.');
        setProcessing(false);
        return;
      }

      // 2. Tokenizar la tarjeta con el método correcto del SDK v2: createCardToken
      const tokenResponse = await mp.createCardToken({
        cardNumber: cleanCardNumber,
        cardExpirationMonth: month,
        cardExpirationYear: '20' + year,
        securityCode: cardCvv,
        cardholderName: cardName,
        cardholderIdentification: { type: 'DNI', number: cardDni },
      });

      if (!tokenResponse?.id) {
        setError('Error al procesar la tarjeta.');
        setProcessing(false);
        return;
      }

      // 3. Enviar al backend con el payment_method_id real detectado por BIN
      const dsid = await getDeviceSessionId();
      const token = authStorage.getToken();
      const r = await fetch('/api/finance/mercadopago/process-brick-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          token: tokenResponse.id,
          payment_method_id: paymentMethodId,
          installments: 1,
          subscriptionId,
          deviceSessionId: dsid,
        }),
      });

      const j = await r.json();
      if (j.status === 'approved') {
        window.location.href = `/plans?payment=success&subscription_id=${subscriptionId}`;
      } else if (j.status === 'pending') {
        window.location.href = `/plans?payment=pending&subscription_id=${subscriptionId}`;
      } else {
        setError(translateMpError(j.status_detail || '') || 'El pago fue rechazado.');
      }
    } catch (e: any) {
      console.error('Error completo en BrickCheckout:', e);
      setError(e?.message || 'Error al procesar el pago.');
    }
    setProcessing(false);
  };

  if (!PUBLIC_KEY) return <p className="text-xs text-red-600">Error de configuración.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Número de tarjeta</label>
        <input
          type="text"
          value={cardNumber}
          onChange={e => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 1234 1234 1234"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5CB85C]"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Vencimiento</label>
          <input
            type="text"
            value={cardExpiry}
            onChange={e => setCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5CB85C]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
          <input
            type="text"
            value={cardCvv}
            onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            maxLength={4}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5CB85C]"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del titular</label>
        <input
          type="text"
          value={cardName}
          onChange={e => setCardName(e.target.value.toUpperCase())}
          placeholder="Como figura en la tarjeta"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5CB85C]"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">DNI</label>
        <input
          type="text"
          value={cardDni}
          onChange={e => setCardDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
          placeholder="12345678"
          maxLength={8}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5CB85C]"
          required
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={processing}
        className="w-full py-3 bg-[#5CB85C] text-white rounded-lg font-medium hover:bg-[#4a9a3e] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><Loader className="w-4 h-4 animate-spin" /> Procesando...</> : `Pagar S/ ${amount.toFixed(2)}`}
      </button>
    </form>
  );
}