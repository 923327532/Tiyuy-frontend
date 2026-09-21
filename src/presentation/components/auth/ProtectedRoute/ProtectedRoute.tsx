'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/presentation/store/authStore';
import { authStorage } from '@/infrastructure/storage';
import { AuthRepository } from '@/infrastructure/repositories';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT';
  requiredRoles?: ('USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT')[];
}

export function ProtectedRoute({ children, requiredRole, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, setAuth, setAdminProfile } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);

  const allowedRoles = requiredRoles || (requiredRole ? [requiredRole] : []);

  useEffect(() => {
    const token = authStorage.getToken();
    const savedUser = authStorage.getUser();

    if (token && savedUser) {
      setAuth(token, savedUser);

      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];
      if (savedUser && adminRoles.includes(savedUser.role)) {
        const authRepo = new AuthRepository();
        authRepo.getAdminProfile()
          .then((profile: any) => {
            if (profile) {
              setAdminProfile(
                profile.adminRoleType,
                profile.departments || [],
                profile.permissions || [],
                profile.isActive
              );
            }
          })
          .catch((err: any) => {
            console.error('Error refreshing admin profile:', err);
          });
      }
    }

    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      // Only navigate if not already navigating to login
      if (!isNavigatingToLogin) {
        setIsNavigatingToLogin(true);
        router.push('/login');
      }
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role as any)) {
      return;
    }
  }, [isAuthenticated, user, allowedRoles, router, isInitializing, isNavigatingToLogin]);

  // While checking auth or navigating to login, render nothing (no flash)
  if (isInitializing || isNavigatingToLogin || !isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">
              No tienes permisos para acceder a esta sección.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
