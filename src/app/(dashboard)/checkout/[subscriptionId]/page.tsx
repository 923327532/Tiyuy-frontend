'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { BrickCheckout } from '@/presentation/components/payments/BrickCheckout/BrickCheckout';
import { CulqiCheckout } from '@/presentation/components/payments/CulqiCheckout/CulqiCheckout';
import { YapeCheckout } from '@/presentation/components/payments/CulqiCheckout/YapeCheckout';
import { authStorage } from '@/infrastructure/storage/auth-storage';

type PaymentMethod = 'mercadopago' | 'culqi' | 'yape';

export default function CheckoutPage() {
  const params = useParams();
  const sp = useSearchParams();
  const sid = params.subscriptionId as string;
  const [amount, setAmount] = useState(Number(sp.get('amount') || '0'));
  const [plan, setPlan] = useState(sp.get('plan') || 'Plan');
  const [method, setMethod] = useState<PaymentMethod>('mercadopago');
  const [userProfile, setUserProfile] = useState<{
    email: string;
    dni: string;
    nombre: string;
    apellido: string;
    telefono: string;
  }>({ email: '', dni: '', nombre: '', apellido: '', telefono: '' });

  useEffect(() => {
    if (amount > 0) return;
    if (!sid) return;
    fetch(`/api/finance/subscriptions/${sid}/price`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setAmount(d.amount || 0); setPlan(d.plan || 'Plan'); } })
      .catch(() => {});
  }, [sid, amount]);

  // Obtener datos del usuario para Culqi
  useEffect(() => {
    try {
      const token = authStorage.getToken();
      if (!token) return;
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d) {
            setUserProfile({
              email: d.email || '',
              dni: d.profile?.dni || d.dni || '',
              nombre: d.profile?.firstName || d.nombre || '',
              apellido: d.profile?.lastName || d.apellido || '',
              telefono: d.phone || d.telefono || '',
            });
          }
        })
        .catch(() => {});
    } catch (_e) {
      // Silencioso
    }
  }, []);

  if (amount <= 0) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#5CB85C] rounded-full animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-[500px] mx-auto px-4 pt-6 pb-96">
        {/* LED banner */}
        <div className="rounded-xl p-6 mb-6 text-center" style={{ background: '#7AC943' }}>
          <img src="/tiyuy.svg" alt="TIYUY" className="h-8 mx-auto mb-3" />
          <p className="text-white/80 text-sm italic max-w-[400px] mx-auto leading-relaxed">Cada propiedad publicada es una puerta que abres.</p>
          <p className="text-white/40 text-[10px] font-mono tracking-wider uppercase mt-2">pago 100% seguro</p>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Resumen</h2>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-900">{plan}</p>
                <p className="text-xs text-gray-400 mt-0.5">Mensual</p>
              </div>
              <p className="text-xl font-bold text-gray-900">S/ {amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Selector de método de pago */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Método de pago</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setMethod('mercadopago')}
              className={`flex items-center justify-center overflow-visible rounded-xl border-2 transition-all duration-200 h-16 ${
                method === 'mercadopago'
                  ? 'bg-white border-[#009EE3] shadow-md shadow-[#009EE3]/20'
                  : 'bg-white border-gray-200 hover:border-[#009EE3] hover:shadow-sm'
              }`}
            >
              <img src="/assets/images/pagos/mercado-pago-seeklogo.png" alt="Mercado Pago" className="w-full h-full object-contain p-2" />
            </button>
            <button
              type="button"
              onClick={() => setMethod('culqi')}
              className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 h-16 ${
                method === 'culqi'
                  ? 'bg-white border-[#F47323] shadow-md shadow-[#F47323]/20'
                  : 'bg-white border-gray-200 hover:border-[#F47323] hover:shadow-sm'
              }`}
            >
              <img src="/assets/images/pagos/culqui.png" alt="Culqi" className="max-w-[85%] max-h-[85%] object-contain" />
            </button>
            <button
              type="button"
              onClick={() => setMethod('yape')}
              className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 h-16 ${
                method === 'yape'
                  ? 'bg-white border-[#6B21A8] shadow-md shadow-[#6B21A8]/20'
                  : 'bg-white border-gray-200 hover:border-[#6B21A8] hover:shadow-sm'
              }`}
            >
              <img src="/assets/images/pagos/yape.png" alt="Yape" className="max-w-[95%] max-h-[95%] object-contain" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            {method === 'yape' ? 'Yape' : 'Tarjeta'}
          </h2>
          {method === 'mercadopago' ? (
            <BrickCheckout amount={amount} subscriptionId={sid} />
          ) : method === 'yape' ? (
            <YapeCheckout
              amount={amount}
              subscriptionId={sid}
              userEmail={userProfile.email}
              userDni={userProfile.dni}
              userNombre={userProfile.nombre}
              userApellido={userProfile.apellido}
              userTelefono={userProfile.telefono}
            />
          ) : (
            <CulqiCheckout
              amount={amount}
              subscriptionId={sid}
              userEmail={userProfile.email}
              userDni={userProfile.dni}
              userNombre={userProfile.nombre}
              userApellido={userProfile.apellido}
              userTelefono={userProfile.telefono}
            />
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          {method === 'mercadopago' ? 'Procesado por Mercado Pago' : ''}
          {method === 'culqi' ? 'Procesado por Culqi · Tus datos no llegan a nuestro servidor' : ''}
          {method === 'yape' ? 'Procesado por Culqi · Paga desde la app Yape' : ''}
        </p>
      </div>
    </ProtectedRoute>
  );
}
