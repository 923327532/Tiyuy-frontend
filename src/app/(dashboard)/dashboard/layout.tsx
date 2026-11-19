'use client';

import { createContext, useState, useRef, useEffect, useContext, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/presentation/store/authStore';
import {
  Flame, Home, Heart, Users, Building,
  Megaphone, Diamond, User, ChevronDown, LogOut, PanelLeftClose, PanelLeft
} from 'lucide-react';

type DashboardSidebarContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextType | undefined>(undefined);

export function useDashboardSidebar() {
  const context = useContext(DashboardSidebarContext);
  if (!context) {
    throw new Error('useDashboardSidebar must be used within DashboardSidebarContext');
  }
  return context;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  iconActive?: React.ReactNode;
  label: string;
  show?: boolean;
  collapsed: boolean;
  isMobile: boolean;
  isActive: (path: string) => boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const NavItem = ({ href, icon, iconActive, label, show = true, collapsed, isMobile, isActive, setSidebarOpen }: NavItemProps) => {
  if (!show) return null;
  const active = isActive(href);
  return (
    <Link
      href={href}
      onClick={() => {
        if (isMobile) setSidebarOpen(false);
      }}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
        active
          ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-medium'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
      }`}
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{active && iconActive ? iconActive : icon}</span>
      <span className={`transition-all duration-200 overflow-hidden ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
        {label}
      </span>
      {active && !collapsed && (
        <span className="ml-auto w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
          {label}
        </div>
      )}
    </Link>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleResize = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const userRole = (user?.role || '').toString().toUpperCase();
  const isAgent = ['AGENT', 'DEVELOPER', 'ADMIN', 'INMOBILIARIA'].includes(userRole);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const hideSidebar =
    pathname === '/dashboard/projects/new' ||
    pathname.startsWith('/dashboard/projects/new/') ||
    /^\/dashboard\/projects\/\d+\/edit(\/|$)/.test(pathname);

  return (
    <DashboardSidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, isMobile }}>
      <div className="flex min-h-screen bg-[var(--bg-secondary)]">
        {isMobile && sidebarOpen && !hideSidebar && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {!hideSidebar && (
          <aside
            className={`bg-[var(--bg-card)] border-r border-[var(--border-color)] min-h-screen flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
              isMobile
                ? `fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl lg:hidden`
                : collapsed
                ? 'w-16'
                : 'w-64'
            }`}
          >
            <div className="px-3 pt-2 pb-1">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 w-full"
                title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
              >
                {collapsed ? <PanelLeft className="w-5 h-5 flex-shrink-0" /> : <PanelLeftClose className="w-5 h-5 flex-shrink-0" />}
                <span className={`text-sm font-medium transition-all duration-200 overflow-hidden ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  Menú
                </span>
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
              <NavItem
                href="/dashboard/crm-leads"
                icon={<Flame className="w-5 h-5 flex-shrink-0" />}
                label="Oportunidades"
                show={isAgent && userRole !== 'DEVELOPER'}
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <NavItem
                href="/my-properties"
                icon={<Home className="w-5 h-5 flex-shrink-0" />}
                label="Mis Propiedades"
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <NavItem
                href="/dashboard/favorites"
                icon={<Heart className="w-5 h-5 flex-shrink-0" />}
                iconActive={<Heart className="w-5 h-5 flex-shrink-0 text-rose-500" fill="#f43f5e" />}
                label="Favoritos"
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <NavItem
                href="/dashboard/clients"
                icon={<Users className="w-5 h-5 flex-shrink-0" />}
                label="Clientes"
                show={isAgent}
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <NavItem
                href="/dashboard/agents"
                icon={<Building className="w-5 h-5 flex-shrink-0" />}
                label="Mis Agentes"
                show={userRole === 'DEVELOPER'}
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <NavItem
                href={userRole === 'AGENT' ? '/agent/marketing' : '/dashboard/marketing'}
                icon={<Megaphone className="w-5 h-5 flex-shrink-0" />}
                label="Marketing"
                show={userRole === 'AGENT' || userRole === 'DEVELOPER'}
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <NavItem
                href="/plans"
                icon={<Diamond className="w-5 h-5 flex-shrink-0" />}
                label="Planes"
                collapsed={collapsed}
                isMobile={isMobile}
                isActive={isActive}
                setSidebarOpen={setSidebarOpen}
              />

              <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                {!collapsed && (
                  <p className="px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Configuración</p>
                )}
                <NavItem
                  href="/dashboard"
                  icon={<User className="w-5 h-5 flex-shrink-0" />}
                  label="Mi Perfil"
                  collapsed={collapsed}
                  isMobile={isMobile}
                  isActive={isActive}
                  setSidebarOpen={setSidebarOpen}
                />
              </div>
            </nav>

            <div className="p-3 border-t border-[var(--border-color)] relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
                title={collapsed ? user?.email || 'Usuario' : undefined}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={`flex-1 text-left min-w-0 transition-all duration-200 overflow-hidden ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.email || 'Usuario'}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{userRole}</p>
                </div>
                {!collapsed && (
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-16 left-3 right-3 bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] py-2 z-50">
                  <button
                    onClick={() => { logout(); setIsDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        <main className={`${hideSidebar ? 'w-full max-w-8xl mx-auto' : 'flex-1'} overflow-auto`}>
          {children}
        </main>
      </div>
    </DashboardSidebarContext.Provider>
  );
}