'use client';

import Link from 'next/link';
import { ChevronRight, User } from 'lucide-react';

interface ProfileMenuLinksProps {
  onClose: () => void;
}

export function ProfileMenuLinks({ onClose }: ProfileMenuLinksProps) {
  return (
    <Link
      href="/admin/profile"
      role="menuitem"
      onClick={onClose}
      className="
        group flex items-center gap-3
        rounded-lg px-3 py-2.5
        text-sm text-white/75
        transition
        hover:bg-white/[0.07]
        hover:text-white
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400
      "
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.07] text-slate-300">
        <User className="h-4 w-4" />
      </span>

      <span className="flex-1">Mi perfil</span>

      <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1" />
    </Link>
  );
}
