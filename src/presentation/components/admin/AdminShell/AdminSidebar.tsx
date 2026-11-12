'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/presentation/store/authStore';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import {
  ADMIN_NAV_SECTIONS,
  isNavItemActive,
  type AdminNavItem,
  type AdminNavSection,
} from './adminNavigation';

interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarItem({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: AdminNavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
      className={[
        'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-white/10 font-medium text-white'
          : 'text-slate-300/80 hover:bg-white/5 hover:text-white',
        collapsed ? 'justify-center px-2' : '',
      ].join(' ')}
    >
      {active && (
        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[#7fc4b8]" />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function SidebarSection({
  section,
  collapsed,
  pathname,
  showDivider,
  onNavigate,
}: {
  section: AdminNavSection;
  collapsed: boolean;
  pathname: string;
  showDivider: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className={showDivider ? 'pt-3' : ''}>
      {section.title && !collapsed && (
        <div className="px-3 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400/70">
            {section.title}
          </span>
        </div>
      )}
      {section.title && collapsed && <div className="my-2 border-t border-white/10" />}

      <div className="space-y-0.5">
        {section.items.map((item) => (
          <SidebarItem
            key={`${section.title}-${item.label}`}
            item={item}
            collapsed={collapsed}
            active={isNavItemActive(item, pathname)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export function AdminSidebar({ collapsed, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const filteredSections = useMemo(() => {
    return ADMIN_NAV_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        if (!item.requiredPermission) return true;
        if (isSuperAdmin) return true;
        return hasPermission(item.requiredPermission);
      });
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [hasPermission, isSuperAdmin]);

  const handleLogout = () => {
    authStorage.clear();
    logout();
    router.push('/login');
  };

  return (
    <>
      <nav
        className="flex-1 space-y-1 overflow-y-auto px-2 py-4"
        aria-label="Navegación del administrador"
      >
        {filteredSections.map((section, index) => (
          <SidebarSection
            key={section.title}
            section={section}
            collapsed={collapsed}
            pathname={pathname}
            showDivider={index > 0}
            onNavigate={onNavigate}
          />
        ))}

        <div className={collapsed ? 'my-2 border-t border-white/10' : 'pt-4'}>
          {!collapsed && (
            <div className="px-3 pb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400/70">
                Sesión
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={[
              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300/80 transition-colors hover:bg-rose-500/10 hover:text-rose-200',
              collapsed ? 'justify-center px-2' : '',
            ].join(' ')}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">Cerrar sesión</span>}
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-logout-title"
        >
          <button
            type="button"
            className="fixed inset-0 bg-slate-950/60"
            aria-label="Cerrar diálogo"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="admin-logout-title" className="text-lg font-semibold text-slate-900">
              Cerrar sesión
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              ¿Estás seguro de que quieres cerrar la sesión administrativa?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
