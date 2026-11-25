"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/store/authStore";
import { adminRepository } from "@/infrastructure/repositories/AdminRepository";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, adminRoleType } = useAuthStore();
  const hasAttemptedLoad = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const loadAdmin = async () => {
      if (!isAuthenticated || !user?.id) {
        router.replace('/login');
        return;
      }

      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];
      if (!adminRoles.includes(user.role)) {
        router.replace('/');
        return;
      }

      if (adminRoleType || hasAttemptedLoad.current) {
        return;
      }

      try {
        hasAttemptedLoad.current = true;
        const admin = await adminRepository.getAdminByUserId(user.id);

        if (admin?.roleType) {
          useAuthStore.getState().setAdminProfile(
            admin.roleType,
            admin.departments || [],
            useAuthStore.getState().permissions || [],
            admin.active ?? true
          );
        }
      } catch (error) {
        console.error('Error loading admin profile:', error);
      }
    };

    loadAdmin();
  }, [hasHydrated, isAuthenticated, user?.id, user?.role, adminRoleType, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];
  if (!user || !adminRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
