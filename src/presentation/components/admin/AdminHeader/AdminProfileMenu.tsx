'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, LogOut, Settings, ShieldCheck, User } from 'lucide-react';
import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { useAdminModeStore } from '@/presentation/store/adminModeStore';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';

export function AdminProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { adminProfile } = useAdminProfile();
  const { user, logout } = useAuthStore();
  const { setUserMode } = useAdminModeStore();
  const router = useRouter();

  const profileUser = {
    photoUrl: user?.photoUrl,
    firstName: adminProfile?.firstName || user?.firstName,
    lastName: adminProfile?.lastName || user?.lastName,
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const switchMode = (userMode: boolean) => {
    setOpen(false);
    setUserMode(userMode);
    router.push(userMode ? '/dashboard' : '/admin');
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div
      ref={containerRef}
      className="hidden items-center gap-3 border-l border-white/15 pl-3 md:flex"
    >
      <div className="hidden text-right lg:block">
        <p className="max-w-[140px] truncate text-sm font-medium text-white">
          {adminProfile?.firstName} {adminProfile?.lastName}
        </p>
        <p className="max-w-[140px] truncate text-xs text-slate-300">
          {adminProfile?.email}
        </p>
      </div>
      <span className="hidden whitespace-nowrap rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-slate-200 sm:block sm:text-xs">
        {adminProfile?.roleType?.replace('_', ' ')}
      </span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Abrir menú de perfil"
          className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <UserAvatar user={profileUser} size="sm" />
          {!user?.photoUrl && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
              <Camera className="h-3 w-3 text-white" aria-hidden="true" />
            </span>
          )}
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-[#1e4a57] bg-[#0f2e3a] shadow-xl"
          >
            <div className="border-b border-[#1e4a57] p-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={profileUser} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {adminProfile?.firstName} {adminProfile?.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-300">{adminProfile?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/admin/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Ver perfil
              </Link>
              <Link
                href="/admin/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                Configuración de cuenta
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={() => switchMode(true)}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <User className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">Modo usuario</span>
                  <span className="block text-xs text-slate-300">Ver la plataforma como usuario</span>
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => switchMode(false)}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    Modo {adminProfile?.roleType?.replace('_', ' ') || 'administrador'}
                  </span>
                  <span className="block text-xs text-slate-300">Panel de administración</span>
                </span>
              </button>

              <div className="mt-2 border-t border-[#1e4a57] pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-200 transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
