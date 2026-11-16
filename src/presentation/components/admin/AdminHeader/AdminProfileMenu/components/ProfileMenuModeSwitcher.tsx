'use client';

import { ShieldCheck, User } from 'lucide-react';

interface ProfileMenuModeSwitcherProps {
  isAdminMode: boolean;
  roleType: string;
  onSwitchMode: (userMode: boolean) => void;
}

export function ProfileMenuModeSwitcher({
  isAdminMode,
  roleType,
  onSwitchMode,
}: ProfileMenuModeSwitcherProps) {
  return (
    <div role="group" aria-label="Modo de navegación">
      <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Modo de navegación
      </p>

      {/* MODO USUARIO */}
      <button
        type="button"
        role="menuitemradio"
        onClick={() => onSwitchMode(true)}
        aria-checked={!isAdminMode}
        className={`
          flex w-full items-center gap-3
          rounded-lg px-3 py-2.5
          text-left transition
          ${
            !isAdminMode
              ? 'bg-cyan-400/10 text-cyan-300'
              : 'text-white/75 hover:bg-white/[0.07] hover:text-white'
          }
        `}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07]">
          <User className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">
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

      {/* MODO ADMINISTRADOR */}
      <button
        type="button"
        role="menuitemradio"
        onClick={() => onSwitchMode(false)}
        aria-checked={isAdminMode}
        className={`
          mt-1 flex w-full items-center gap-3
          rounded-lg px-3 py-2.5
          text-left transition
          ${
            isAdminMode
              ? 'bg-cyan-400/10 text-cyan-300'
              : 'text-white/75 hover:bg-white/[0.07] hover:text-white'
          }
        `}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07]">
          <ShieldCheck className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">
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
  );
}
