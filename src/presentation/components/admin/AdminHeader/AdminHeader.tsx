'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  DollarSign,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  X,
} from 'lucide-react';

import { useUnifiedNotifications } from '@/presentation/hooks/useUnifiedNotifications';
import { AdminSearch } from './AdminSearch';
import { AdminCreateMenu } from './AdminCreateMenu';
import { AdminProfileMenu } from './AdminProfileMenu';
import { AdminMobileMenu } from './AdminMobileMenu';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export function AdminHeader({
  onToggleSidebar,
  sidebarCollapsed = false,
}: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { unreadCount } = useUnifiedNotifications('general');

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((previous) => !previous);
  }, []);

  const notificationLabel =
    unreadCount > 0
      ? `Notificaciones, ${unreadCount} sin leer`
      : 'Notificaciones';

  return (
    <>
      <header
        className="
          sticky top-0 z-50
          flex h-16 items-center justify-between
          border-b border-white/10
          bg-[#0f2e3a]
          px-3 text-white
          shadow-[0_2px_12px_rgba(0,0,0,0.12)]
          sm:px-5
          lg:px-6
        "
      >
        {/* IZQUIERDA: Sidebar y logo */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">

          {onToggleSidebar && (
            <>
              {/* Móvil: hamburguesa para abrir el drawer */}
              <button
                type="button"
                onClick={onToggleSidebar}
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl text-white/75
                  transition-colors
                  hover:bg-white/10 hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-white/70
                  md:hidden
                "
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Escritorio: contrae/expande el sidebar */}
              <button
                type="button"
                onClick={onToggleSidebar}
                className="
                  hidden h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl text-white/75
                  transition-colors
                  hover:bg-white/10 hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-white/70
                  md:flex
                "
                aria-label={
                  sidebarCollapsed
                    ? 'Expandir barra lateral'
                    : 'Contraer barra lateral'
                }
                aria-pressed={sidebarCollapsed}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                ) : (
                  <PanelLeftClose
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                )}
              </button>
            </>
          )}

          {/* Logo desktop */}
          <Link
            href="/admin"
            className="
              hidden shrink-0 items-center
              transition-opacity hover:opacity-80
              sm:flex
            "
            aria-label="Ir al panel administrativo"
          >
            <img
              src="/assets/images/logo_s.svg"
              alt="TIYUY"
              className="h-10 w-auto object-contain"
            />
          </Link>

        </div>

        {/* CENTRO: Búsqueda */}
        <div className="flex min-w-0 flex-1 items-center justify-center px-2 sm:px-4">
          <AdminSearch />
        </div>

        {/* DERECHA: Acciones */}
        <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-4 sm:gap-2">

          <AdminCreateMenu />

          {/* Notificaciones */}
          <Link
            href="/admin/notifications"
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-xl text-white/75
              transition-colors
              hover:bg-white/10 hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-white/70
            "
            aria-label={notificationLabel}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />

            {unreadCount > 0 && (
              <span
                className="
                  absolute right-1 top-1
                  flex h-[17px] min-w-[17px] items-center
                  justify-center rounded-full
                  bg-rose-500 px-1
                  text-[10px] font-bold text-white
                  ring-2 ring-[#0f2e3a]
                "
                aria-hidden="true"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Finanzas */}
          <Link
            href="/admin/finance"
            className="
              hidden h-10 w-10 items-center justify-center
              rounded-xl text-white/75
              transition-colors
              hover:bg-white/10 hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-white/70
              sm:flex
            "
            aria-label="Ir a finanzas"
          >
            <DollarSign className="h-5 w-5" aria-hidden="true" />
          </Link>

          {/* Menú rápido móvil */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl text-white/75
              transition-colors
              hover:bg-white/10 hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-white/70
              md:hidden
            "
            aria-label={
              isMobileMenuOpen
                ? 'Cerrar menú rápido'
                : 'Abrir menú rápido'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="admin-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PlusCircle className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Perfil */}
          <AdminProfileMenu />
        </div>
      </header>

      {/* Menú móvil */}
      <AdminMobileMenu
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  );
}
