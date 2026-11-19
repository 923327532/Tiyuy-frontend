'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { authStorage } from '@/infrastructure/storage/auth-storage';
import { useAuthStore } from '@/presentation/store/authStore';

/**
 * Cierra la sesión administrativa y redirige al login.
 */
export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return useCallback(() => {
    authStorage.clear();
    logout();
    router.push('/login');
  }, [logout, router]);
}
