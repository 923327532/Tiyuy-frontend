'use client';

import { ShieldCheck } from 'lucide-react';

import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import type { ProfileMenuUserData } from '../types';

interface ProfileMenuHeaderProps {
  profile: ProfileMenuUserData;
}

export function ProfileMenuHeader({ profile }: ProfileMenuHeaderProps) {
  return (
    <div className="border-b border-[var(--border-admin-sidebar)] bg-[var(--bg-admin-sidebar-hover)] p-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={profile} size="md" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--text-admin-sidebar)]">
            {profile.firstName} {profile.lastName}
          </p>

          <p className="mt-0.5 truncate text-xs text-[var(--text-admin-sidebar-muted)]">
            {profile.email || 'Cuenta administrativa'}
          </p>

          <span
            className="
              mt-2 inline-flex items-center
              gap-1 rounded-full
              bg-[var(--bg-admin-sidebar-active)] px-2 py-0.5
              text-[10px] font-medium
              capitalize text-[var(--color-admin-accent)]
            "
          >
            <ShieldCheck className="h-3 w-3" />
            {profile.roleType}
          </span>
        </div>
      </div>
    </div>
  );
}
