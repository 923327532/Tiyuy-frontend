'use client';

import { useCallback, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { useAdminModeStore } from '@/presentation/store/adminModeStore';

import { useMobileMenuA11y } from './hooks/useMobileMenuA11y';
import {
  MobileMenuFooter,
  MobileMenuModeSwitcher,
  MobileMenuNavigation,
  MobileMenuProfile,
  MobileMenuQuickActions,
} from './components';
import type {
  AdminMobileMenuProps,
  MobileMenuProfileData,
} from './types';

export function AdminMobileMenu({
  open,
  onClose,
}: AdminMobileMenuProps) {
  const { adminProfile } = useAdminProfile();
  const { user, logout } = useAuthStore();
  const { setUserMode } = useAdminModeStore();

  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  const { handlePanelKeyDown } = useMobileMenuA11y({
    open,
    onClose,
    panelRef,
  });

  const profile = useMemo<MobileMenuProfileData>(
    () => ({
      photoUrl: user?.photoUrl,
      firstName: adminProfile?.firstName || user?.firstName || '',
      lastName: adminProfile?.lastName || user?.lastName || '',
      email: adminProfile?.email || user?.email || '',
      roleType:
        adminProfile?.roleType?.replace(/_/g, ' ') || 'Administrador',
    }),
    [adminProfile, user],
  );

  const isAdminMode = pathname.startsWith('/admin');

  const goTo = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const switchMode = useCallback(
    (userMode: boolean) => {
      onClose();
      setUserMode(userMode);
      router.push(userMode ? '/dashboard' : '/admin');
    },
    [onClose, router, setUserMode],
  );

  const handleLogout = useCallback(() => {
    onClose();
    logout();
  }, [onClose, logout]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 md:hidden"
      onClick={onClose}
    >
      {/* BACKDROP */}
      <div
        className="
          absolute inset-0
          bg-slate-950/60
          backdrop-blur-[2px]
          animate-menu-fade-in
          motion-reduce:animate-none
        "
        aria-hidden="true"
      />

      {/* PANEL */}
      <div
        id="admin-mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú administrativo"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handlePanelKeyDown}
        className="
          absolute right-0 top-16 bottom-0
          flex w-80 max-w-[88vw]
          flex-col overflow-y-auto
          border-l border-white/10
          bg-[#0f2e3a]
          shadow-2xl
          outline-none
          animate-menu-slide-in
          motion-reduce:animate-none
        "
      >
        <MobileMenuProfile profile={profile} onClose={onClose} />

        <div className="flex-1 space-y-6 p-4">
          <MobileMenuQuickActions onNavigate={goTo} />

          <MobileMenuNavigation
            pathname={pathname}
            onClose={onClose}
          />

          <MobileMenuModeSwitcher
            isAdminMode={isAdminMode}
            roleType={profile.roleType}
            onSwitchMode={switchMode}
          />
        </div>

        <MobileMenuFooter onLogout={handleLogout} />
      </div>
    </div>
  );
}
