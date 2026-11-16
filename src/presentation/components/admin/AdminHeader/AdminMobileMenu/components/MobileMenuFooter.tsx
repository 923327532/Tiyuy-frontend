'use client';

import { LogOut } from 'lucide-react';

interface MobileMenuFooterProps {
  onLogout: () => void;
}

export function MobileMenuFooter({ onLogout }: MobileMenuFooterProps) {
  return (
    <div className="border-t border-white/10 p-4">
      <button
        type="button"
        onClick={onLogout}
        className="
          flex w-full items-center gap-3
          rounded-xl border border-rose-400/10
          bg-rose-400/[0.05] px-4 py-3
          text-sm font-medium text-rose-300
          transition hover:border-rose-400/20
          hover:bg-rose-400/10
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-rose-400
        "
      >
        <LogOut className="h-[18px] w-[18px]" />
        Cerrar sesión
      </button>

      <p className="mt-3 text-center text-[10px] text-slate-500">
        TIYUY · Panel administrativo
      </p>
    </div>
  );
}
