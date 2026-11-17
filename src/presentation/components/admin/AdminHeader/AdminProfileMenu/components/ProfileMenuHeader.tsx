'use client';

import { ShieldCheck } from 'lucide-react';

import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import type { ProfileMenuUserData } from '../types';

interface ProfileMenuHeaderProps {
  profile: ProfileMenuUserData;
}

export function ProfileMenuHeader({ profile }: ProfileMenuHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={profile} size="md" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {profile.firstName} {profile.lastName}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-400">
            {profile.email || 'Cuenta administrativa'}
          </p>

          <span
            className="
              mt-2 inline-flex items-center
              gap-1 rounded-full
              bg-cyan-400/10 px-2 py-0.5
              text-[10px] font-medium
              capitalize text-cyan-300
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
