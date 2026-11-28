'use client';

import { LogOut } from 'lucide-react';

interface ProfileMenuLogoutProps {
  onLogout: () => void;
}

export function ProfileMenuLogout({ onLogout }: ProfileMenuLogoutProps) {
  return (
    <div role="none" className="mt-2 border-t border-[var(--border-admin-sidebar)] pt-2">
      <button
        type="button"
        role="menuitem"
        onClick={onLogout}
        className="
          flex w-full items-center gap-3
          rounded-lg px-3 py-2.5
          text-sm font-medium text-rose-300
          transition
          hover:bg-rose-400/10
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-rose-400
        "
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-400/10">
          <LogOut className="h-4 w-4" />
        </span>

        Cerrar sesión
      </button>
    </div>
  );
}
