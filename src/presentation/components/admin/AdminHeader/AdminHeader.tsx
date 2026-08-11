/**
 * Admin Header Component
 * GitHub-style header for admin module - Fully Responsive
 */

'use client';

import { useState, useEffect } from 'react';
import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { useAdminModeStore } from '@/presentation/store/adminModeStore';
import { usePermissions } from '@/presentation/hooks/usePermissions';

import { Button } from '@/presentation/components/ui/Button';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import { Bell, Building2, Camera, ChevronDown, Globe2, HelpCircle, LogOut, Megaphone, Menu, Plus, PlusCircle, Search, Settings, ShieldCheck, Tag, User, LayoutDashboard, Package, Users, DollarSign, Layers, MessageSquare, Activity, UserCircle, Building2 as BuildingIcon, Tag as TagIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const { adminProfile } = useAdminProfile();
  const { logout, user } = useAuthStore();
  const { isSuperAdmin, isRegularAdmin, isSupport, hasPermission } = usePermissions();
  const { isUserMode, setUserMode } = useAdminModeStore();
  const router = useRouter();


  // Rutas de navegación para el buscador
  const searchRoutes = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, keywords: ['dashboard', 'inicio', 'panel'] },
    { label: 'Usuarios', href: '/admin/users', icon: Users, keywords: ['usuarios', 'users', 'clientes'], permission: 'USERS_VIEW' },
    { label: 'Extranjeros', href: '/admin/international', icon: Globe2, keywords: ['extranjeros', 'internacional', 'kyc', 'documento'], permission: 'USERS_VIEW' },
    { label: 'Propiedades', href: '/admin/properties', icon: BuildingIcon, keywords: ['propiedades', 'properties', 'inmuebles'], permission: 'PROPERTIES_VIEW' },
    { label: 'Proyectos', href: '/admin/projects', icon: Package, keywords: ['proyectos', 'projects'], permission: 'PROJECTS_VIEW' },
    { label: 'Agentes Independientes', href: '/admin/agents', icon: UserCircle, keywords: ['agentes', 'agents'], permission: 'USERS_VIEW' },
    { label: 'Inmobiliarias', href: '/admin/agencies', icon: Building2, keywords: ['inmobiliarias', 'agencias', 'agencies'], permission: 'AGENCIES_VIEW' },
    { label: 'Grupos', href: '/admin/groups', icon: Users, keywords: ['grupos', 'groups'], permission: 'GROUPS_VIEW' },
    { label: 'Planes', href: '/admin/plans', icon: Layers, keywords: ['planes', 'plans', 'suscripciones'], permission: 'FINANCE_VIEW' },
    { label: 'Descuentos', href: '/admin/discounts', icon: TagIcon, keywords: ['descuentos', 'discounts'], permission: 'DISCOUNTS_CREATE' },
    { label: 'Campañas', href: '/admin/campaigns', icon: Megaphone, keywords: ['campañas', 'campaigns', 'marketing'], permission: 'COMMUNICATIONS_MANAGE' },
    { label: 'Finanzas', href: '/admin/finance', icon: DollarSign, keywords: ['finanzas', 'finance', 'pagos'], permission: 'FINANCE_VIEW' },
    { label: 'Comunicaciones', href: '/admin/communications', icon: MessageSquare, keywords: ['comunicaciones', 'communications', 'soporte'], permission: 'COMMUNICATIONS_VIEW' },
    { label: 'Notificaciones', href: '/admin/notifications', icon: Bell, keywords: ['notificaciones', 'notifications'], permission: 'NOTIFICATIONS_SEND' },
    { label: 'Administradores', href: '/admin/admins', icon: ShieldCheck, keywords: ['administradores', 'admins', 'admin'], permission: 'ADMINS_VIEW' },
    { label: 'Actividad', href: '/admin/activities', icon: Activity, keywords: ['actividad', 'activities', 'auditoria'], permission: 'AUDIT_LOGS_VIEW' },
    { label: 'Mi perfil', href: '/admin/profile', icon: User, keywords: ['perfil', 'profile', 'mi cuenta'] },
  ];

  // Filtrar rutas según búsqueda y permisos
  const filteredRoutes = searchQuery.trim()
    ? searchRoutes.filter(route => {
        if (route.permission && !isSuperAdmin && !hasPermission(route.permission)) return false;
        const query = searchQuery.toLowerCase();
        const matchLabel = route.label.toLowerCase().includes(query);
        const matchKeywords = route.keywords.some(k => k.includes(query));
        const matchHref = route.href.toLowerCase().includes(query);
        return matchLabel || matchKeywords || matchHref;
      })
    : [];

  const handleSearchSelect = (href: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    router.push(href);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredRoutes.length > 0) {
      handleSearchSelect(filteredRoutes[0].href);
    }
    if (e.key === 'Escape') {
      setShowSearchResults(false);
      const input = e.target as HTMLInputElement;
      input.blur();
    }
    if (e.key === '/' && document.activeElement !== e.currentTarget) {
      e.preventDefault();
      const input = e.currentTarget as HTMLInputElement;
      input.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu || showCreateMenu) {
        setShowProfileMenu(false);
        setShowCreateMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu, showCreateMenu]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setShowMobileMenu(false);
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
    setShowCreateMenu(false);
  };

  const handleSwitchToUserMode = () => {
    setShowProfileMenu(false);
    setUserMode(true);
    router.push('/dashboard');
  };

  const handleSwitchToAdminMode = () => {
    setShowProfileMenu(false);
    setUserMode(false);
    router.push('/admin');
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCreateMenu(!showCreateMenu);
    setShowProfileMenu(false);
  };

  const handleCreateAction = (action: string) => {
    setShowCreateMenu(false);
    switch (action) {
      case 'user':
        router.push('/admin/users?action=create');
        break;
      case 'property':
        router.push('/admin/properties?action=create');
        break;
      case 'campaign':
        router.push('/admin/campaigns?action=create');
        break;
      case 'discount':
        router.push('/admin/discounts?action=create');
        break;
      case 'admin':
        if (isSuperAdmin) {
          router.push('/admin/admins?action=create');
        }
        break;
      case 'roles':
        if (isSuperAdmin) {
          router.push('/admin/admins');
        }
        break;
      default:
        break;
    }
  };

  const hasProfilePhoto = user?.photoUrl;
  const profileUser = {
    photoUrl: user?.photoUrl,
    firstName: adminProfile?.firstName || user?.firstName,
    lastName: adminProfile?.lastName || user?.lastName
  };

  return (
    <header className="px-3 sm:px-4 py-2 flex items-center justify-between sticky top-0 z-50 border-b shadow-lg" style={{ backgroundColor: '#1693a5', borderColor: '#7cb490', color: 'white' }}>
      {/* Left side - Hamburger, Logo and Search */}
      <div className="flex items-center gap-0 flex-1 min-w-0">
        {/* Logo + Hamburger - responsive width */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Hamburger Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 sm:p-2 rounded-md hover:bg-white/20 transition shrink-0"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Tiyuy Logo - hidden on very small screens, visible on sm+ */}
          <Link href="/admin" className="hidden sm:flex items-center hover:opacity-80 transition shrink-0">
            <img 
              src="/assets/images/logo_s.svg"
              alt="Tiyuy Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Search Bar - responsive */}
        <div className="flex-1 max-w-md lg:max-w-xl ml-2 sm:ml-4 md:ml-8 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderColor: '#7cb490',
                color: 'white'
              }}
              onKeyDown={handleSearchKeyDown}
            />
            <div className="hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs rounded bg-gray-200 text-gray-500">/</kbd>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && filteredRoutes.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-72 sm:max-h-80 overflow-y-auto">
              {filteredRoutes.map((route, index) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.href}
                    onMouseDown={() => handleSearchSelect(route.href)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-left text-xs sm:text-sm transition-colors hover:bg-gray-50 ${
                      index === 0 ? 'border-l-2' : ''
                    }`}
                    style={index === 0 ? { borderLeftColor: '#1693a5' } : {}}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: '#1693a5' }} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{route.label}</p>
                      <p className="text-xs text-gray-500 truncate">{route.href}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {showSearchResults && searchQuery.trim() && filteredRoutes.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500">No se encontraron resultados para "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        {/* Create Button - hidden on mobile, visible on md+ */}
        <div className="hidden md:block relative">
          <Button 
            size="sm" 
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 text-xs sm:text-sm"
            onClick={handleCreateClick}
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden lg:inline">Create</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
          
          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 sm:w-64 rounded-lg shadow-xl z-50" style={{ backgroundColor: '#1693a5', borderColor: '#7cb490' }}>
              <div className="py-1">
                <button
                  onClick={() => handleCreateAction('user')}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-white/10 flex items-center gap-2 sm:gap-3 transition-colors duration-200"
                  style={{ color: 'white' }}
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Nuevo usuario
                </button>
                <button
                  onClick={() => handleCreateAction('property')}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-white/10 flex items-center gap-2 sm:gap-3 transition-colors duration-200"
                  style={{ color: 'white' }}
                >
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Nueva propiedad
                </button>
                <button
                  onClick={() => handleCreateAction('campaign')}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-white/10 flex items-center gap-2 sm:gap-3 transition-colors duration-200"
                  style={{ color: 'white' }}
                >
                  <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Nueva campania
                </button>
                <button
                  onClick={() => handleCreateAction('discount')}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-white/10 flex items-center gap-2 sm:gap-3 transition-colors duration-200"
                  style={{ color: 'white' }}
                >
                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Nuevo descuento
                </button>
                {isSuperAdmin && (
                  <>
                    <button
                      onClick={() => handleCreateAction('admin')}
                      className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-white/10 flex items-center gap-2 sm:gap-3 pt-2 transition-colors duration-200"
                      style={{ color: 'white', borderTop: `1px solid #7cb490` }}
                    >
                      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Nuevo admin
                    </button>
                    <button
                      onClick={() => handleCreateAction('roles')}
                      className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-white/10 flex items-center gap-2 sm:gap-3 transition-colors duration-200"
                      style={{ color: 'white' }}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Roles del sistema
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Link href="/admin/notifications" className="relative p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
              {notifications}
            </span>
          )}
        </Link>

        {/* Finanzas - hidden on very small screens */}
        <Link href="/admin/finance" className="hidden sm:inline-flex p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition">
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>

        {/* Mobile Menu Toggle - visible on small screens */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition"
          aria-label="Toggle mobile menu"
        >
          {showMobileMenu ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
        </button>

        {/* Admin Profile - hidden on mobile, visible on md+ */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-white/20">
          <div className="hidden lg:block text-right">
            <p className="text-xs sm:text-sm font-medium text-white truncate max-w-[120px]">
              {adminProfile?.firstName} {adminProfile?.lastName}
            </p>
            <p className="text-[10px] sm:text-xs text-teal-100 truncate max-w-[120px]">{adminProfile?.email}</p>
          </div>
          <div className={`hidden sm:block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
            isSuperAdmin ? 'bg-purple-600 text-white' :
            isRegularAdmin ? 'bg-blue-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {adminProfile?.roleType?.replace('_', ' ')}
          </div>

          {/* Avatar */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="relative group"
              title={hasProfilePhoto ? "Ver perfil" : "Agregar foto de perfil (click aqui)"}
            >
              <UserAvatar user={profileUser} size="sm" />
              {!hasProfilePhoto && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
            
            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-lg shadow-xl z-50" style={{ backgroundColor: '#1693a5', borderColor: '#7cb490' }}>
                <div className="p-3 sm:p-4 border-b" style={{ borderColor: '#7cb490' }}>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={profileUser} size="md" />
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {adminProfile?.firstName} {adminProfile?.lastName}
                      </p>
                      <p className="text-xs text-teal-100 truncate">{adminProfile?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition"
                  >
                    <User className="w-4 h-4" />
                    Ver perfil
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Link>

                  {/* Modo Usuario */}
                  <button
                    onClick={handleSwitchToUserMode}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition mt-1"
                    style={{ color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-medium text-white text-sm">Modo Usuario</p>
                      <p className="text-xs text-teal-100">Ver la plataforma como usuario</p>
                    </div>
                  </button>

                  {/* Modo Admin */}
                  <button
                    onClick={handleSwitchToAdminMode}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition mt-1"
                    style={{ color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSuperAdmin ? 'bg-purple-600' :
                      isRegularAdmin ? 'bg-blue-600' :
                      'bg-gray-600'
                    }`}>
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-medium text-white text-sm">
                        Modo {adminProfile?.roleType?.replace('_', ' ') || 'Admin'}
                      </p>
                      <p className="text-xs text-teal-100">Panel de administración</p>
                    </div>
                  </button>

                  <div className="border-t mt-2 pt-2" style={{ borderColor: '#7cb490' }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition"
                      style={{ color: '#ffcccc' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 top-[56px] z-40 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div 
            className="absolute right-0 top-0 w-72 max-w-[85vw] h-full shadow-2xl overflow-y-auto"
            style={{ backgroundColor: '#1693a5' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Perfil rápido */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
                <UserAvatar user={profileUser} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white text-sm truncate">
                    {adminProfile?.firstName} {adminProfile?.lastName}
                  </p>
                  <p className="text-xs text-teal-100 truncate">{adminProfile?.email}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                  isSuperAdmin ? 'bg-purple-600 text-white' :
                  isRegularAdmin ? 'bg-blue-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {adminProfile?.roleType?.replace('_', ' ')}
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="space-y-1 mb-4 pb-4 border-b border-white/20">
                <p className="text-[10px] font-semibold tracking-widest text-teal-200 uppercase mb-2">Acciones rápidas</p>
                <button
                  onClick={() => { handleCreateAction('user'); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition text-left"
                >
                  <User className="w-4 h-4" />
                  Nuevo usuario
                </button>
                <button
                  onClick={() => { handleCreateAction('property'); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition text-left"
                >
                  <Building2 className="w-4 h-4" />
                  Nueva propiedad
                </button>
                <button
                  onClick={() => { handleCreateAction('campaign'); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition text-left"
                >
                  <Megaphone className="w-4 h-4" />
                  Nueva campaña
                </button>
                <button
                  onClick={() => { handleCreateAction('discount'); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition text-left"
                >
                  <Tag className="w-4 h-4" />
                  Nuevo descuento
                </button>
              </div>

              {/* Navegación */}
              <div className="space-y-1 mb-4 pb-4 border-b border-white/20">
                <p className="text-[10px] font-semibold tracking-widest text-teal-200 uppercase mb-2">Navegación</p>
                <Link
                  href="/admin/notifications"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition"
                >
                  <Bell className="w-4 h-4" />
                  Notificaciones
                </Link>
                <Link
                  href="/admin/finance"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition"
                >
                  <DollarSign className="w-4 h-4" />
                  Finanzas
                </Link>
                <Link
                  href="/admin/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition"
                >
                  <User className="w-4 h-4" />
                  Mi perfil
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition"
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              </div>

              {/* Modo Usuario / Admin */}
              <div className="space-y-1 mb-4 pb-4 border-b border-white/20">
                <p className="text-[10px] font-semibold tracking-widest text-teal-200 uppercase mb-2">Modo</p>
                <button
                  onClick={() => { handleSwitchToUserMode(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition text-left"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-white text-sm">Modo Usuario</p>
                    <p className="text-xs text-teal-100">Ver como usuario</p>
                  </div>
                </button>
                <button
                  onClick={() => { handleSwitchToAdminMode(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition text-left"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isSuperAdmin ? 'bg-purple-600' :
                    isRegularAdmin ? 'bg-blue-600' :
                    'bg-gray-600'
                  }`}>
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-white text-sm">
                      Modo {adminProfile?.roleType?.replace('_', ' ') || 'Admin'}
                    </p>
                    <p className="text-xs text-teal-100">Panel admin</p>
                  </div>
                </button>
              </div>

              {/* Cerrar sesión */}
              <button
                onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition"
                style={{ color: '#ffcccc' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
