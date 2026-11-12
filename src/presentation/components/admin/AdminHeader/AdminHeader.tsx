'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, DollarSign, Menu, PlusCircle, X } from 'lucide-react';
import { useUnifiedNotifications } from '@/presentation/hooks/useUnifiedNotifications';
import { AdminSearch } from './AdminSearch';
import { AdminCreateMenu } from './AdminCreateMenu';
import { AdminProfileMenu } from './AdminProfileMenu';
import { AdminMobileMenu } from './AdminMobileMenu';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { unreadCount } = useUnifiedNotifications('general');

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#1e4a57] bg-[#0f2e3a] px-3 py-2 text-white shadow-sm sm:px-4">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="shrink-0 rounded-md p-1.5 transition hover:bg-white/10 sm:p-2"
                aria-label="Alternar barra lateral"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            <Link
              href="/admin"
              className="hidden shrink-0 items-center transition hover:opacity-80 sm:flex"
              aria-label="Ir al resumen administrativo"
            >
              <img
                src="/assets/images/logo_s.svg"
                alt="TIYUY"
                className="h-10 w-auto object-contain sm:h-12 md:h-14"
              />
            </Link>
          </div>

          <AdminSearch />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          <AdminCreateMenu />

          <Link
            href="/admin/notifications"
            className="relative rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white sm:p-2"
            aria-label={
              unreadCount > 0
                ? `Notificaciones, ${unreadCount} sin leer`
                : 'Notificaciones'
            }
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white sm:-right-1 sm:-top-1 sm:h-5 sm:w-5 sm:text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/finance"
            className="hidden rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex sm:p-2"
            aria-label="Ir a finanzas"
          >
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setShowMobileMenu((value) => !value)}
            className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label={showMobileMenu ? 'Cerrar menú rápido' : 'Abrir menú rápido'}
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PlusCircle className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <AdminProfileMenu />
        </div>
      </header>

      <AdminMobileMenu
        open={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />
    </>
  );
}
