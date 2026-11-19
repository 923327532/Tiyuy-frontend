'use client';

import { ShieldCheck, X } from 'lucide-react';

import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import type { MobileMenuProfileData } from '../types';

interface MobileMenuProfileProps {
  profile: MobileMenuProfileData;
  onClose: () => void;
}

export function MobileMenuProfile({
  profile,
  onClose,
}: MobileMenuProfileProps) {
  return (
    <div className="border-b border-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Panel administrativo
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl text-white/60
            transition hover:bg-white/10 hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <X className="h-5 w-5" />
        </button>
      </div>

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
              rounded-full border border-cyan-400/20
              bg-cyan-400/10 px-2 py-0.5
              text-[10px] font-medium capitalize
              text-cyan-300
            "
          >
            <ShieldCheck className="mr-1 h-3 w-3" />
            {profile.roleType}
          </span>
        </div>
      </div>
    </div>
  );
}
