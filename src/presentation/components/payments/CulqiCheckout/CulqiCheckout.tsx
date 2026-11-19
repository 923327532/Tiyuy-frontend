'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
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

export function CulqiCheckout({
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

  const PK = env.culqiPublicKey;

  useEffect(() => {
    if (!PK) return;

    const win = window as any;

    // Callback global que Culqi v4 llama internamente
    win.culqi = function () {
      setProcessing(false);
      if (win.Culqi.token) {
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
            token, subscriptionId, email: userEmail,
            dni: userDni, nombre: userNombre, apellido: userApellido, telefono: userTelefono,
          }),
        })
          .then(r => r.json())
          .then(j => {
            setProcessing(false);
            if (j.status === 'approved') window.location.href = '/plans?payment=success&subscription_id=' + subscriptionId;
            else setError(j.status_detail || 'Pago rechazado.');
          })
          .catch(() => {
            setProcessing(false);
            setError('Error al procesar.');
          });
      } else if (win.Culqi.order) {
        setError('Error: se generó order en vez de token.');
      } else {
        setError(win.Culqi.error?.user_message || 'Pago rechazado.');
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
    if (!ready) return setError('Culqi no listo.');
    setProcessing(true);
    setError(null);

    const c = (window as any).Culqi;
    c.publicKey = PK;

    c.settings({
      title: 'Tiyuy',
      currency: 'PEN',
      amount: Math.round(amount * 100),
    });

    c.options({
      lang: 'auto',
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: false,
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false,
      },
    });

    try {
      c.open();
    } catch {
      setProcessing(false);
      setError('Error al abrir Culqi.');
    }

    setTimeout(() => {
      setProcessing(prev => {
        if (prev) setError('El formulario de pago no se pudo abrir. Intenta de nuevo.');
        return false;
      });
    }, 8000);
  };

  if (!PK) return <p className="text-xs text-red-600">Culqi no configurado.</p>;

  return (
    <div>
      {!ready && !error && (
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <Loader className="w-3 h-3 animate-spin" /> Cargando Culqi...
        </p>
      )}
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      <button
        type="button"
        onClick={pagar}
        disabled={processing || !ready}
        className="w-full py-3 bg-[#5CB85C] text-white rounded-lg font-medium hover:bg-[#4a9a3e] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><Loader className="w-4 h-4 animate-spin" /> Procesando...</> : `Pagar S/ ${amount.toFixed(2)}`}
      </button>
    </div>
  );
}