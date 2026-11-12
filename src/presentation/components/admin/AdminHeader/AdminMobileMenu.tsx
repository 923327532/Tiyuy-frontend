'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Building2,
  DollarSign,
  LogOut,
  Megaphone,
  Settings,
  ShieldCheck,
  Tag,
  User,
} from 'lucide-react';
import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { useAdminModeStore } from '@/presentation/store/adminModeStore';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';

interface AdminMobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { label: 'Nuevo usuario', href: '/admin/users?action=create', icon: User },
  { label: 'Nueva propiedad', href: '/admin/properties?action=create', icon: Building2 },
  { label: 'Nueva campaña', href: '/admin/campaigns?action=create', icon: Megaphone },
  { label: 'Nuevo descuento', href: '/admin/discounts?action=create', icon: Tag },
];

const LINKS = [
  { label: 'Notificaciones', href: '/admin/notifications', icon: Bell },
  { label: 'Finanzas', href: '/admin/finance', icon: DollarSign },
  { label: 'Mi perfil', href: '/admin/profile', icon: User },
  { label: 'Configuración de cuenta', href: '/admin/profile', icon: Settings },
];

export function AdminMobileMenu({ open, onClose }: AdminMobileMenuProps) {
  const { adminProfile } = useAdminProfile();
  const { user, logout } = useAuthStore();
  const { setUserMode } = useAdminModeStore();
  const router = useRouter();

  if (!open) return null;

  const profileUser = {
    photoUrl: user?.photoUrl,
    firstName: adminProfile?.firstName || user?.firstName,
    lastName: adminProfile?.lastName || user?.lastName,
  };

  const goTo = (href: string) => {
    onClose();
    router.push(href);
  };

  const switchMode = (userMode: boolean) => {
    onClose();
    setUserMode(userMode);
    router.push(userMode ? '/dashboard' : '/admin');
  };

  return (
    <div className="fixed inset-0 top-14 z-40 md:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/50" />
      <div
        className="absolute right-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-[#0f2e3a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-5 p-4">
          <div className="flex items-center gap-3 border-b border-white/15 pb-4">
            <UserAvatar user={profileUser} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {adminProfile?.firstName} {adminProfile?.lastName}
              </p>
              <p className="truncate text-xs text-slate-300">{adminProfile?.email}</p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-200">
              {adminProfile?.roleType?.replace('_', ' ')}
            </span>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Acciones rápidas
            </p>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.href}
                    type="button"
                    onClick={() => goTo(action.href)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/15 pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Navegación
            </p>
            <div className="space-y-1">
              {LINKS.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/15 pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Modo
            </p>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <User className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-medium">Modo usuario</span>
                <span className="block text-xs text-slate-300">Ver como usuario</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => switchMode(false)}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-medium">
                  Modo {adminProfile?.roleType?.replace('_', ' ') || 'administrador'}
                </span>
                <span className="block text-xs text-slate-300">Panel admin</span>
              </span>
            </button>
          </div>

          <div className="border-t border-white/15 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-200 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
