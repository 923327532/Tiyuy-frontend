'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { useAdminModeStore } from '@/presentation/store/adminModeStore';
import { authStorage } from '@/infrastructure/storage/auth-storage';

import { useProfileMenu } from './hooks/useProfileMenu';
import {
  ProfileMenuDropdown,
  ProfileMenuIdentity,
  ProfileMenuLogoutConfirmation,
  ProfileMenuTrigger,
} from './components';
import type { ProfileMenuUserData } from './types';

export function AdminProfileMenu() {
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const { open, closeMenu, toggleMenu, containerRef, triggerRef } =
    useProfileMenu();

  const { adminProfile } = useAdminProfile();
  const { user, logout } = useAuthStore();
  const { setUserMode } = useAdminModeStore();

  const router = useRouter();
  const pathname = usePathname();

  const profile = useMemo<ProfileMenuUserData>(
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

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() ||
    'Administrador';

  const isAdminMode = pathname.startsWith('/admin');

  const switchMode = useCallback(
    (userMode: boolean) => {
      closeMenu();
      setUserMode(userMode);
      router.push(userMode ? '/dashboard' : '/admin');
    },
    [closeMenu, router, setUserMode],
  );

  const handleLogout = useCallback(() => {
    setLogoutConfirmationOpen(false);
    authStorage.clear();
    logout();
    router.push('/login');
  }, [logout, router]);

  const requestLogout = useCallback(() => {
    closeMenu();
    setLogoutConfirmationOpen(true);
  }, [closeMenu]);

  return (
    <>
      <div
        ref={containerRef}
        className="
          hidden items-center gap-3
          border-l border-[var(--border-admin-sidebar)] pl-3
          md:flex
        "
      >
        <ProfileMenuIdentity
          fullName={fullName}
          email={profile.email}
        />

        <div className="relative">
          <ProfileMenuTrigger
            open={open}
            onToggle={toggleMenu}
            triggerRef={triggerRef}
            user={profile}
          />

          {open && (
            <ProfileMenuDropdown
              profile={profile}
              isAdminMode={isAdminMode}
              onClose={closeMenu}
              onSwitchMode={switchMode}
              onLogout={requestLogout}
            />
          )}
        </div>
      </div>

      <ProfileMenuLogoutConfirmation
        isOpen={logoutConfirmationOpen}
        onCancel={() => setLogoutConfirmationOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
