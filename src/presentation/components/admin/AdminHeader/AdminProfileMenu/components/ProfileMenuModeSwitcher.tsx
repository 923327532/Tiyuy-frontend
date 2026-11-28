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
      <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-admin-sidebar-heading)]">
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
              ? 'bg-[var(--bg-admin-sidebar-active)] text-[var(--color-admin-accent)]'
              : 'text-[var(--text-admin-sidebar-muted)] hover:bg-[var(--bg-admin-sidebar-hover)] hover:text-[var(--text-admin-sidebar)]'
          }
        `}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-admin-sidebar-hover)]">
          <User className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">
            Modo usuario
          </span>

          <span className="block text-xs text-[var(--text-admin-sidebar-muted)]">
            Ver plataforma como usuario
          </span>
        </span>

        {!isAdminMode && (
          <span className="h-2 w-2 rounded-full bg-[var(--color-admin-accent)]" />
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
              ? 'bg-[var(--bg-admin-sidebar-active)] text-[var(--color-admin-accent)]'
              : 'text-[var(--text-admin-sidebar-muted)] hover:bg-[var(--bg-admin-sidebar-hover)] hover:text-[var(--text-admin-sidebar)]'
          }
        `}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-admin-sidebar-hover)]">
          <ShieldCheck className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">
            Modo {roleType}
          </span>

          <span className="block text-xs text-[var(--text-admin-sidebar-muted)]">
            Panel de administración
          </span>
        </span>

        {isAdminMode && (
          <span className="h-2 w-2 rounded-full bg-[var(--color-admin-accent)]" />
        )}
      </button>
    </div>
  );
}
