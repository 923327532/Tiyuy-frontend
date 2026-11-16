'use client';

import type { RefObject } from 'react';
import { ChevronDown } from 'lucide-react';

import { UserAvatar } from '@/presentation/components/shared/UserAvatar';

interface ProfileMenuTriggerProps {
  open: boolean;
  onToggle: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  user: {
    photoUrl?: string;
    firstName?: string;
    lastName?: string;
  };
}

export function ProfileMenuTrigger({
  open,
  onToggle,
  triggerRef,
  user,
}: ProfileMenuTriggerProps) {
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-haspopup="menu"
      aria-controls="admin-profile-dropdown"
      aria-label={
        open ? 'Cerrar menú de perfil' : 'Abrir menú de perfil'
      }
      className="
        group flex items-center gap-1.5
        rounded-full p-0.5
        transition
        hover:bg-white/10
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0f2e3a]
      "
    >
      <span
        className="
          rounded-full ring-2 ring-transparent
          transition
          group-hover:ring-cyan-400/50
        "
      >
        <UserAvatar user={user} size="sm" />
      </span>

      <ChevronDown
        className={`
          hidden h-4 w-4 text-white/60
          transition-transform duration-200
          xl:block
          ${open ? 'rotate-180' : ''}
        `}
        aria-hidden="true"
      />
    </button>
  );
}
