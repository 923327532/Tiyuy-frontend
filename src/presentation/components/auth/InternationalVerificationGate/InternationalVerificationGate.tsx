'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/presentation/store/authStore';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { Clock, ShieldAlert, ShieldCheck, LogOut } from 'lucide-react';

/**
 * Bloquea las zonas privadas para usuarios con documento internacional
 * que aún no han sido aprobados (PENDING/REJECTED).
 * Una vez aprobado (VERIFIED), el acceso es normal.
 */
export function InternationalVerificationGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user: authUser, logout, setUser } = useAuthStore();

  const { data: user, isLoading } = useQuery({
    queryKey: ['international-verification-gate'],
    queryFn: async () => {
      const response = await axiosClient.get('/auth/me');
      const userData = response.data;
      if (userData) setUser(userData);
      return userData;
    },
    initialData: authUser,
    enabled: !!authUser,
  });

  // Solo aplica a usuarios internacionales
  if (!user || user.documentType !== 'INTERNATIONAL') {
    return <>{children}</>;
  }

  const status = user.verificationStatus;

  // Aprobado: acceso normal
  if (status === 'VERIFIED') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
        {status === 'REJECTED' ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Documento rechazado</h1>
            <p className="text-sm text-gray-600 mb-6">
              No pudimos validar tu documento. Vuelve a subir tus documentos para completar tu verificación.
            </p>
            <Link
              href="/kyc-internacional"
              className="block w-full bg-[var(--brand-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Verificar identidad
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Tu documento está siendo revisado</h1>
            <p className="text-sm text-gray-600 mb-6">
              Aún no puedes acceder a esta área privada. Un administrador está revisando tu documento de
              identidad. Te avisaremos cuando sea aprobado.
            </p>
            <Link
              href="/"
              className="block w-full bg-[var(--brand-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Ir al inicio
            </Link>
          </>
        )}

        {user.documentImageUrl && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Documento enviado · en revisión
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
