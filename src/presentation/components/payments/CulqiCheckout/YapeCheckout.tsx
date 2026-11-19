'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader, Smartphone } from 'lucide-react';
import { env } from '@/config/env';
import { authStorage } from '@/infrastructure/storage/auth-storage';

interface Props {
  amount: number;
  subscriptionId: string;
  userEmail: string;
  userDni?: string;
  userNombre?: string;
  userApellido?: string;
  userTelefono?: string;
}

export function YapeCheckout({
  amount,
  subscriptionId,
  userEmail,
  userDni = '',
  userNombre = '',
  userApellido = '',
  userTelefono = '',
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);
  const processingRef = useRef(false);

  const PK = env.culqiPublicKey;

  useEffect(() => {
    if (!PK) return;

    const win = window as any;

    win.culqi = function () {
      if (win.Culqi.token) {
        if (processingRef.current) return;
        processingRef.current = true;
        const token = win.Culqi.token.id;
        const jwt = authStorage.getToken();
        setProcessing(true);

        fetch('/api/finance/culqi/pagar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            token,
            subscriptionId,
            email: userEmail,
            dni: userDni,
            nombre: userNombre,
            apellido: userApellido,
            telefono: userTelefono,
          }),
        })
          .then(r => r.json())
          .then(j => {
            processingRef.current = false;
            setProcessing(false);
            if (j.status === 'approved') {
              window.location.href = `/plans?payment=success&subscription_id=${subscriptionId}`;
            } else {
              setError(j.status_detail || 'Pago rechazado.');
            }
          })
          .catch(() => {
            processingRef.current = false;
            setProcessing(false);
            setError('Error al procesar.');
          });
      } else if (win.Culqi.order) {
        processingRef.current = false;
        setProcessing(false);
        setError('Error: se genero una orden en vez de un token.');
      } else {
        processingRef.current = false;
        setProcessing(false);
        setError(
          win.Culqi.error?.user_message ||
          win.Culqi.error?.merchant_message ||
          'No se pudo realizar tu yapeo. Genera un nuevo codigo de aprobacion en Yape e intenta otra vez.'
        );
      }
    };

    if (win.Culqi && typeof win.Culqi.open === 'function') {
      win.Culqi.publicKey = PK;
      setReady(true);
      return;
    }

    const s = document.createElement('script');
    s.src = 'https://checkout.culqi.com/js/v4';
    s.async = true;
    s.onload = () => {
      if (win.Culqi) {
        win.Culqi.publicKey = PK;
        setReady(true);
      }
    };
    s.onerror = () => setError('Error al cargar Culqi.');
    document.head.appendChild(s);
  }, [PK, subscriptionId, userEmail, userDni, userNombre, userApellido, userTelefono]);

  const pagar = () => {
    if (processingRef.current || processing) return;
    if (!ready) return setError('Culqi no listo.');

    processingRef.current = true;
    setProcessing(true);
    setError(null);

    const c = (window as any).Culqi;
    c.publicKey = PK;

    c.settings({
      title: 'Tiyuy - Yape',
      currency: 'PEN',
      amount: Math.round(amount * 100),
    });

    c.options({
      lang: 'auto',
      installments: false,
      paymentMethods: {
        tarjeta: false,
        yape: true,
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false,
      },
    });

    try {
      c.open();
    } catch {
      processingRef.current = false;
      setProcessing(false);
      setError('Error al abrir Culqi.');
    }

    setTimeout(() => {
      setProcessing(prev => {
        if (prev) {
          processingRef.current = false;
          setError('El formulario no respondio. Intenta de nuevo.');
        }
        return false;
      });
    }, 30000);
  };

  if (!PK) return <p className="text-xs text-red-600">Yape no configurado.</p>;

  return (
    <div className="space-y-3">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
        <Smartphone className="w-10 h-10 text-purple-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-purple-800">Paga con Yape</p>
        <p className="text-xs text-purple-600 mt-1">Se abrira el modal de Culqi para ingresar tu numero Yape</p>
      </div>
      {!ready && !error && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Loader className="w-3 h-3 animate-spin" /> Cargando Culqi...
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={pagar}
        disabled={processing || !ready}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><Loader className="w-4 h-4 animate-spin" /> Procesando...</> : `Pagar S/ ${amount.toFixed(2)} con Yape`}
      </button>
    </div>
  );
}
