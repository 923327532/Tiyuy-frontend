'use client';

import Link from 'next/link';

import { LogOut } from 'lucide-react';

interface SidebarFooterProps {
  collapsed: boolean;
  onLogoutClick: () => void;
}

const BUTTON_CLASSES = `
  flex w-full items-center gap-3 rounded-lg px-3 py-2
  text-sm text-slate-300 transition-colors
  hover:bg-rose-500/10 hover:text-rose-200
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-cyan-400
`;

function SidebarLogo({ size }: { size: 'sm' | 'md' }) {
  return (
    <Link
      href="/admin"
      aria-label="Ir al panel administrativo"
      className="flex justify-center transition-opacity hover:opacity-80"
    >
      <img
        src="/assets/images/logo_s.svg"
        alt="TIYUY"
        className={
          size === 'sm'
            ? 'h-7 w-auto object-contain'
            : 'h-9 w-auto object-contain'
        }
      />
    </Link>
  );
}

export function SidebarFooter({
  collapsed,
  onLogoutClick,
}: SidebarFooterProps) {
  if (collapsed) {
    return (
      <div
        className="
          shrink-0 border-t border-white/10
          bg-[#0c2731] px-2 py-3
        "
      >
        <SidebarLogo size="sm" />

        <button
          type="button"
          onClick={onLogoutClick}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className={`${BUTTON_CLASSES} mt-2 justify-center px-2`}
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="
        shrink-0 border-t border-white/10
        bg-[#0c2731] px-3 py-4
      "
    >
      <button
        type="button"
        onClick={onLogoutClick}
        className={BUTTON_CLASSES}
      >
        <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
        <span className="truncate">Cerrar sesión</span>
      </button>

      <div className="mt-4">
        <SidebarLogo size="md" />
      </div>
    </div>
  );
}
