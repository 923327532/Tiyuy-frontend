'use client';

import type { ProfileMenuUserData } from '../types';
import { ProfileMenuFooter } from './ProfileMenuFooter';
import { ProfileMenuHeader } from './ProfileMenuHeader';
import { ProfileMenuLinks } from './ProfileMenuLinks';
import { ProfileMenuLogout } from './ProfileMenuLogout';
import { ProfileMenuModeSwitcher } from './ProfileMenuModeSwitcher';

interface ProfileMenuDropdownProps {
  profile: ProfileMenuUserData;
  isAdminMode: boolean;
  onClose: () => void;
  onSwitchMode: (userMode: boolean) => void;
  onLogout: () => void;
}

export function ProfileMenuDropdown({
  profile,
  isAdminMode,
  onClose,
  onSwitchMode,
  onLogout,
}: ProfileMenuDropdownProps) {
  return (
    <div
      id="admin-profile-dropdown"
      role="menu"
      aria-label="Menú de perfil"
      className="
        absolute right-0 top-full z-50 mt-3
        w-72 overflow-hidden
        rounded-xl border border-[var(--border-admin-sidebar)]
        bg-[var(--bg-admin-sidebar)]
        shadow-[0_12px_40px_rgba(0,0,0,0.35)]
        animate-menu-drop-in
        motion-reduce:animate-none
      "
    >
      <ProfileMenuHeader profile={profile} />

      <div className="p-2" role="none">
        <ProfileMenuLinks onClose={onClose} />

        <div
          role="separator"
          className="my-2 border-t border-[var(--border-admin-sidebar)]"
        />

        <ProfileMenuModeSwitcher
          isAdminMode={isAdminMode}
          roleType={profile.roleType}
          onSwitchMode={onSwitchMode}
        />

        <ProfileMenuLogout onLogout={onLogout} />
      </div>

      <ProfileMenuFooter />
    </div>
  );
}
