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
        text-sm text-[var(--text-admin-sidebar-muted)]
        transition
        hover:bg-[var(--bg-admin-sidebar-hover)]
        hover:text-[var(--text-admin-sidebar)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-admin-accent)]
      "
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-admin-sidebar-hover)] text-[var(--text-admin-sidebar-muted)]">
        <User className="h-4 w-4" />
      </span>

      <span className="flex-1">Mi perfil</span>

      <ChevronRight className="h-4 w-4 text-[var(--text-admin-sidebar-heading)] transition group-hover:translate-x-1" />
    </Link>
  );
}
