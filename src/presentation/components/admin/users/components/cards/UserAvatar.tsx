'use client';

import { getInitials, getFullName } from './Config';

interface UserAvatarProps {
  user: {
    id: number;
    profilePhotoUrl?: string | null;
    enabled: boolean;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
}

export function UserAvatar({ user }: UserAvatarProps) {
  const fullName = getFullName(user);

  return (
    <div className="relative shrink-0">
      {user.profilePhotoUrl ? (
        <img
          src={user.profilePhotoUrl}
          alt={`Fotografía de ${fullName}`}
          loading="lazy"
          decoding="async"
          className={`h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200 ${!user.enabled ? 'grayscale opacity-60' : ''}`}
        />
      ) : (
        <div
          aria-label={`Iniciales de ${fullName}`}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F0F3] text-sm font-bold text-[#164E63] ring-1 ring-slate-200"
        >
          {getInitials(user)}
        </div>
      )}

      <span
        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${user.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`}
        aria-label={user.enabled ? 'Cuenta activa' : 'Cuenta suspendida'}
      />
    </div>
  );
}