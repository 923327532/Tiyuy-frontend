/**
 * Tiyuy Admin Shell Component
 * Sidebar colapsable con iconos, header con buscador y perfil
 * Diseño: dark navy sidebar + header blanco + contenido gris claro
 */

'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { Card } from '@/presentation/components/ui/Card';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminHeader } from '@/presentation/components/admin/AdminHeader/AdminHeader';
import { Activity, Bell, Building, Building2, DollarSign, FileText, Globe2, Image as ImageIcon, Layers, LayoutDashboard, LogOut, Megaphone, MessageSquare, Package, ShieldAlert, ShieldCheck, Tag, TriangleAlert, UserCircle, Users } from 'lucide-react';


interface GitHubShellProps {
  children: ReactNode;
}

// ─── Tipos de navegación ────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ─── Configuración del menú con permisos requeridos ─────────────────────────

interface NavItemWithPermission extends NavItem {
  requiredPermission?: string;
}

interface NavSectionWithPermission {
  title: string;
  items: NavItemWithPermission[];
}

const NAV_SECTIONS: NavSectionWithPermission[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'USUARIOS',
    items: [
      { label: 'Usuarios', href: '/admin/users', icon: Users, requiredPermission: 'USERS_VIEW' },
      { label: 'Extranjeros', href: '/admin/international', icon: Globe2, requiredPermission: 'USERS_VIEW' },
    ],
  },
  {
    title: 'PROPIEDADES',
    items: [
      { label: 'Propiedades', href: '/admin/properties', icon: Building, requiredPermission: 'PROPERTIES_VIEW' },
      { label: 'Proyectos', href: '/admin/projects', icon: Package, requiredPermission: 'PROJECTS_VIEW' },
    ],
  },
  {
    title: 'ACTORES',
    items: [
      { label: 'Agentes Independientes', href: '/admin/agents', icon: UserCircle, requiredPermission: 'USERS_VIEW' },
      { label: 'Inmobiliarias', href: '/admin/agencies', icon: Building2, requiredPermission: 'AGENCIES_VIEW' },
      { label: 'Grupos', href: '/admin/groups', icon: Users, requiredPermission: 'GROUPS_VIEW' },
    ],
  },
  {
    title: 'MONETIZACION',
    items: [
      { label: 'Planes', href: '/admin/plans', icon: Layers, requiredPermission: 'FINANCE_VIEW' },
      { label: 'Descuentos', href: '/admin/discounts', icon: Tag, requiredPermission: 'DISCOUNTS_CREATE' },
      { label: 'Campanas', href: '/admin/campaigns', icon: Megaphone, requiredPermission: 'COMMUNICATIONS_MANAGE' },
      { label: 'Banners', href: '/admin/campaigns/banners', icon: ImageIcon, requiredPermission: 'COMMUNICATIONS_MANAGE' },
      { label: 'Finanzas', href: '/admin/finance', icon: DollarSign, requiredPermission: 'FINANCE_VIEW' },
    ],
  },
  {
    title: 'COMUNICACION',
    items: [
      { label: 'Comunicaciones', href: '/admin/communications', icon: MessageSquare, requiredPermission: 'COMMUNICATIONS_VIEW' },
      { label: 'Notificaciones', href: '/admin/notifications', icon: Bell, requiredPermission: 'NOTIFICATIONS_SEND' },
    ],
  },
  {
    title: 'SERVICIO AL CLIENTE',
    items: [
      { label: 'Reclamos', href: '/admin/reclamos', icon: FileText },
    ],
  },

  {
    title: 'SISTEMA',
    items: [
      { label: 'Administradores', href: '/admin/admins', icon: Users, requiredPermission: 'ADMINS_VIEW' },
      { label: 'Actividad', href: '/admin/activities', icon: Activity, requiredPermission: 'AUDIT_LOGS_VIEW' },
    ],
  },

  {
    title: 'CUENTA',
    items: [
      { label: 'Mi perfil', href: '/admin/profile', icon: UserCircle },
    ],
  },
];

// ─── Sidebar Item ────────────────────────────────────────────────────────────

function SidebarItem({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150
        ${active
          ? 'bg-white/15 text-white font-medium'
          : 'text-[var(--text-muted)] hover:text-white hover:bg-white/10'
        }
        ${collapsed ? 'justify-center px-2' : ''}
      `}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  );
}

// ─── Sidebar completo ────────────────────────────────────────────────────────

function Sidebar({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { hasPermission, isSuperAdmin, isSupport } = usePermissions();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    authStorage.clear();
    logout();
    router.push('/login');
  };

  // Filtra items según permisos dinámicos
  const filteredSections = useMemo(() => {
    return NAV_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        if (!item.requiredPermission) return true;
        if (isSuperAdmin) return true;
        return hasPermission(item.requiredPermission);
      });
      return { ...section, items };
    }).filter((s) => s.items.length > 0);
  }, [isSuperAdmin, hasPermission]);

  return (
    <>
    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
      {filteredSections.map((section, si) => (
        <div key={si} className={si > 0 ? 'pt-3' : ''}>
          {section.title && !collapsed && (
            <div className="px-3 pb-1">
              <span className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">
                {section.title}
              </span>
            </div>
          )}
          {section.title && collapsed && (
            <div className="border-t border-white/10 my-2" />
          )}

          <div className="space-y-0.5">
            {section.items.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href)
                }
              />
            ))}
          </div>
        </div>
      ))}

      <div className={collapsed ? 'border-t border-white/10 my-2' : 'pt-3'}>
        {!collapsed && (
          <div className="px-3 pb-1">
            <span className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">
              SESION
            </span>
          </div>
        )}
        {collapsed && <div className="border-t border-white/10 my-2" />}
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 w-full
            text-[var(--text-muted)] hover:text-red-400 hover:bg-red-900/30
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span className="truncate cursor-pointer">Cerrar sesión</span>}
        </button>
      </div>
    </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-[#1e2a3a] rounded-xl shadow-2xl w-full max-w-sm p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Cerrar sesión</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              ¿Estás seguro de que quieres cerrar sesión?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
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

// ─── Shell Principal ─────────────────────────────────────────────────────────

export function GitHubShell({ children }: GitHubShellProps) {
  const { adminProfile, isLoading, error } = useAdminProfile();
  const { setAdminProfile } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el drawer mobile al navegar a otra sección
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleToggleSidebar = () => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      setCollapsed((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  };

  useEffect(() => {
    if (adminProfile) {
      setAdminProfile(
        adminProfile.roleType,
        adminProfile.departments,
        adminProfile.permissions || adminProfile.additionalPermissions || [],
        adminProfile.active,
      );
    }
  }, [adminProfile, setAdminProfile]);

  const isSuperAdmin = adminProfile?.roleType === 'SUPER_ADMIN';
  const isRegularAdmin = adminProfile?.roleType === 'ADMIN';
  const isSupport = adminProfile?.roleType === 'SUPPORT';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-[var(--text-secondary)] text-sm">Cargando perfil de administrador...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <Card className="max-w-md mx-auto p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <TriangleAlert className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Error de Perfil Admin</h2>
            <p className="text-[var(--text-secondary)] mb-4 text-sm">
              No se pudo cargar el perfil de administrador. Por favor recarga la pagina.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Recargar Pagina
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <Card className="max-w-md mx-auto p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Acceso Restringido</h2>
            <p className="text-[var(--text-secondary)] mb-4 text-sm">
              No tienes privilegios de administrador o tu cuenta no esta activa.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
            >
              Volver al Dashboard
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
      <AdminHeader onToggleSidebar={handleToggleSidebar} />

      <div className="flex h-[calc(100vh-56px)] overflow-hidden relative">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`
            fixed inset-y-0 left-0 top-14 z-40 h-[calc(100vh-56px)] w-[240px]
            bg-[#1a2030] overflow-y-auto transition-transform duration-200 ease-in-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:top-0 md:z-auto md:h-full md:shrink-0 md:translate-x-0
            md:transition-[width] md:duration-200 md:ease-in-out
            ${collapsed ? 'md:w-[60px]' : 'md:w-[240px]'}
          `}
        >
          <Sidebar collapsed={collapsed} />
        </aside>

        <main className="flex-1 h-full overflow-y-auto bg-[var(--bg-secondary)] p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
