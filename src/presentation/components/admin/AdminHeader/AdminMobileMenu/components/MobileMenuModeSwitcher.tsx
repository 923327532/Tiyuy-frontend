'use client';

import { ShieldCheck, User } from 'lucide-react';

interface MobileMenuModeSwitcherProps {
  isAdminMode: boolean;
  roleType: string;
  onSwitchMode: (userMode: boolean) => void;
}

export function MobileMenuModeSwitcher({
  isAdminMode,
  roleType,
  onSwitchMode,
}: MobileMenuModeSwitcherProps) {
  return (
    <section aria-labelledby="mode-title">
      <h3
        id="mode-title"
        className="
          mb-2 px-2
          text-[10px] font-bold uppercase
          tracking-[0.16em] text-slate-400
        "
      >
        Modo de navegación
      </h3>

      <div className="space-y-2">
        {/* MODO USUARIO */}
        <button
          type="button"
          onClick={() => onSwitchMode(true)}
          aria-pressed={!isAdminMode}
          className={`
            flex w-full items-center gap-3
            rounded-xl border p-3 text-left
            transition
            ${
              !isAdminMode
                ? 'border-cyan-400/30 bg-cyan-400/10'
                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
            }
          `}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
            <User className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white">
              Modo usuario
            </span>

            <span className="block text-xs text-slate-400">
              Ver plataforma como usuario
            </span>
          </span>

          {!isAdminMode && (
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
          )}
        </button>

        {/* MODO ADMIN */}
        <button
          type="button"
          onClick={() => onSwitchMode(false)}
          aria-pressed={isAdminMode}
          className={`
            flex w-full items-center gap-3
            rounded-xl border p-3 text-left
            transition
            ${
              isAdminMode
                ? 'border-cyan-400/30 bg-cyan-400/10'
                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
            }
          `}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
            <ShieldCheck className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white">
              Modo {roleType}
            </span>

            <span className="block text-xs text-slate-400">
              Panel de administración
            </span>
          </span>

          {isAdminMode && (
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
          )}
        </button>
      </div>
    </section>
  );
}
