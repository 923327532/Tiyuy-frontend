/**
 * GitHub-style Admin Sidebar Component
 * Collapsible hamburger menu with hierarchical navigation
 */

'use client';

import { useState } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  CreditCard, 
  Tag, 
  Megaphone, 
  Settings, 
  BarChart3, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Package,
  DollarSign,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Bell,
  Activity,
  Globe2
} from 'lucide-react';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  badge?: number;
  requiredPermissions?: string[];
}

export function GitHubSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard', 'analytics', 'user-management', 'property-management', 'communications', 'finance', 'campaigns', 'admin-management']);

  const { hasPermission } = usePermissions();
  const pathname = usePathname();

  // Build navigation dynamically based on backend departments and permissions
  const navigation: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Panel de Control',
      icon: <Home className="w-4 h-4" />,
      path: '/admin'
    },
    // Analytics and Reports Department
    {
      id: 'analytics',
      label: 'Analiticas y Reportes',
      icon: <BarChart3 className="w-4 h-4" />,
      children: [
        {
          id: 'dashboard-analytics',
          label: 'Dashboard Analitico',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/admin/analytics',
          requiredPermissions: ['ANALYTICS_DASHBOARD']
        },
        {
          id: 'analytics-view',
          label: 'Analiticas Avanzadas',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/admin/analytics',
          requiredPermissions: ['ANALYTICS_VIEW']
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/admin/reports',
          requiredPermissions: ['ANALYTICS_VIEW']
        },
        {
          id: 'export',
          label: 'Exportar Datos',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/admin/reports/export',
          requiredPermissions: ['ANALYTICS_EXPORT']
        },
        {
          id: 'audit',
          label: 'Registro de Auditoria',
          icon: <AlertTriangle className="w-4 h-4" />,
          path: '/admin/audit',
          requiredPermissions: ['AUDIT_LOGS_VIEW']
        }
      ]
    },
    // User Management Department
    {
      id: 'user-management',
      label: 'Gestion de Usuarios',
      icon: <Users className="w-4 h-4" />,
      children: [
        {
          id: 'regular-users',
          label: 'Usuarios Regulares',
          icon: <Users className="w-4 h-4" />,
          path: '/admin/users',
          requiredPermissions: ['USERS_VIEW']
        },
        {
          id: 'international-users',
          label: 'Extranjeros',
          icon: <Globe2 className="w-4 h-4" />,
          path: '/admin/international',
          requiredPermissions: ['USERS_VIEW']
        },
        {
          id: 'create-user',
          label: 'Crear Usuario',
          icon: <Users className="w-4 h-4" />,
          path: '/admin/users?action=create',
          requiredPermissions: ['USERS_CREATE']
        },
        {
          id: 'agencies',
          label: 'Inmobiliarias',
          icon: <Building2 className="w-4 h-4" />,
          path: '/admin/agencies',
          requiredPermissions: ['AGENCIES_VIEW']
        },
        {
          id: 'agents',
          label: 'Agentes',
          icon: <Users className="w-4 h-4" />,
          path: '/admin/agents',
          requiredPermissions: ['USERS_VIEW']
        },
        {
          id: 'verify-users',
          label: 'Verificar Usuarios',
          icon: <CheckCircle className="w-4 h-4" />,
          path: '/admin/users/verify',
          requiredPermissions: ['USERS_VERIFY']
        },
        {
          id: 'user-groups',
          label: 'Grupos de Usuarios',
          icon: <Users className="w-4 h-4" />,
          path: '/admin/groups',
          requiredPermissions: ['GROUPS_VIEW']
        },
        {
          id: 'manage-groups',
          label: 'Gestionar Grupos',
          icon: <Users className="w-4 h-4" />,
          path: '/admin/groups?action=manage',
          requiredPermissions: ['GROUPS_MANAGE']
        }
      ]
    },
    // Property and Project Management Department
    {
      id: 'property-management',
      label: 'Gestion de Propiedades y Proyectos',
      icon: <Building2 className="w-4 h-4" />,
      children: [
        {
          id: 'properties',
          label: 'Propiedades',
          icon: <Building2 className="w-4 h-4" />,
          path: '/admin/properties',
          requiredPermissions: ['PROPERTIES_VIEW']
        },
        {
          id: 'moderate-properties',
          label: 'Moderar Propiedades',
          icon: <AlertTriangle className="w-4 h-4" />,
          path: '/admin/properties/moderate',
          requiredPermissions: ['PROPERTIES_MODERATE']
        },
        {
          id: 'featured-properties',
          label: 'Propiedades Destacadas',
          icon: <Target className="w-4 h-4" />,
          path: '/admin/properties/featured',
          requiredPermissions: ['PROPERTIES_FEATURE']
        },
        {
          id: 'projects',
          label: 'Proyectos',
          icon: <Package className="w-4 h-4" />,
          path: '/admin/projects',
          requiredPermissions: ['PROJECTS_VIEW']
        },
        {
          id: 'moderate-projects',
          label: 'Moderar Proyectos',
          icon: <AlertTriangle className="w-4 h-4" />,
          path: '/admin/projects/moderate',
          requiredPermissions: ['PROJECTS_MODERATE']
        }
      ]
    },
    // Communications and Events Department
    {
      id: 'communications',
      label: 'Comunicaciones y Eventos',
      icon: <Megaphone className="w-4 h-4" />,
      children: [
        {
          id: 'activities',
          label: 'Actividades Recientes',
          icon: <Activity className="w-4 h-4" />,
          path: '/admin/activities',
          requiredPermissions: ['EVENTS_VIEW']
        },
        {
          id: 'communications-view',
          label: 'Centro de Soporte',
          icon: <AlertTriangle className="w-4 h-4" />,
          path: '/admin/communications',
          requiredPermissions: ['COMMUNICATIONS_VIEW']
        },
        {
          id: 'chat-monitor',
          label: 'Monitor de Chat',
          icon: <Bell className="w-4 h-4" />,
          path: '/admin/chat',
          requiredPermissions: ['CHAT_MONITOR']
        },
        {
          id: 'notifications',
          label: 'Notificaciones',
          icon: <Bell className="w-4 h-4" />,
          path: '/admin/notifications',
          requiredPermissions: ['NOTIFICATIONS_SEND']
        },
        {
          id: 'send-notification',
          label: 'Enviar Notificacion',
          icon: <Bell className="w-4 h-4" />,
          path: '/admin/notifications?action=send',
          requiredPermissions: ['NOTIFICATIONS_SEND']
        }
      ]
    },
    // Finance and Monetization Department
    {
      id: 'finance',
      label: 'Finanzas y Monetizacion',
      icon: <DollarSign className="w-4 h-4" />,
      children: [
        {
          id: 'finance-overview',
          label: 'Vista Financiera',
          icon: <DollarSign className="w-4 h-4" />,
          path: '/admin/finance',
          requiredPermissions: ['FINANCE_VIEW']
        },
        {
          id: 'subscriptions',
          label: 'Suscripciones',
          icon: <CreditCard className="w-4 h-4" />,
          path: '/admin/subscriptions',
          requiredPermissions: ['FINANCE_MANAGE_SUBSCRIPTIONS']
        },
        {
          id: 'payments',
          label: 'Pagos y Transacciones',
          icon: <CreditCard className="w-4 h-4" />,
          path: '/admin/payments',
          requiredPermissions: ['FINANCE_VIEW']
        },
        {
          id: 'refunds',
          label: 'Reembolsos',
          icon: <DollarSign className="w-4 h-4" />,
          path: '/admin/refunds',
          requiredPermissions: ['FINANCE_REFUNDS']
        },
        {
          id: 'discounts',
          label: 'Codigos de Descuento',
          icon: <Tag className="w-4 h-4" />,
          path: '/admin/discounts',
          requiredPermissions: ['DISCOUNTS_CREATE']
        },
        {
          id: 'manage-discounts',
          label: 'Gestionar Descuentos',
          icon: <Tag className="w-4 h-4" />,
          path: '/admin/discounts?action=manage',
          requiredPermissions: ['DISCOUNTS_MANAGE']
        },
        {
          id: 'real-estate-discounts',
          label: 'Descuentos Inmobiliarios',
          icon: <Target className="w-4 h-4" />,
          path: '/admin/real-estate-discounts',
          requiredPermissions: ['DISCOUNTS_CREATE']
        }
      ]
    },
    // Campaigns Module (formerly Marketing)
    {
      id: 'campaigns',
      label: 'Campañas',
      icon: <Megaphone className="w-4 h-4" />,
      path: '/admin/campaigns',
      children: [
        {
          id: 'campaigns-dashboard',
          label: 'Panel de Campañas',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/admin/campaigns',
          requiredPermissions: ['COMMUNICATIONS_MANAGE']
        },
        {
          id: 'campaigns-list',
          label: 'Campañas',
          icon: <Calendar className="w-4 h-4" />,
          path: '/admin/campaigns/list',
          requiredPermissions: ['COMMUNICATIONS_MANAGE']
        },
        {
          id: 'campaigns-banners',
          label: 'Banners',
          icon: <Target className="w-4 h-4" />,
          path: '/admin/campaigns/banners',
          requiredPermissions: ['COMMUNICATIONS_MANAGE']
        },
        {
          id: 'campaigns-festive',
          label: 'Campañas Festivas',
          icon: <Calendar className="w-4 h-4" />,
          path: '/admin/campaigns/festive',
          requiredPermissions: ['COMMUNICATIONS_MANAGE']
        }
      ]
    },


    // Admin Management (SuperAdmin only)
    {
      id: 'admin-management',
      label: 'Control de Administracion',
      icon: <Settings className="w-4 h-4" />,
      children: [
        {
          id: 'admin-users',
          label: 'Usuarios Admin',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/admins',
          requiredPermissions: ['ADMINS_VIEW']
        },
        {
          id: 'create-admin',
          label: 'Crear Admin',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/admins?action=create',
          requiredPermissions: ['ADMINS_CREATE']
        },
        {
          id: 'manage-admins',
          label: 'Gestionar Admins',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/admins?action=manage',
          requiredPermissions: ['ADMINS_UPDATE']
        },
        {
          id: 'departments',
          label: 'Gestion de Departamentos',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/departments',
          requiredPermissions: ['DEPARTMENTS_MANAGE']
        },
        {
          id: 'system-config',
          label: 'Configuracion del Sistema',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/settings',
          requiredPermissions: ['SYSTEM_CONFIG']
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const hasPermissionForItem = (item: NavItem): boolean => {
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }
    return item.requiredPermissions.some(permission => hasPermission(permission));
  };

  const filterNavigation = (items: NavItem[]): NavItem[] => {
    return items.filter(item => hasPermissionForItem(item)).map(item => ({
      ...item,
      children: item.children ? filterNavigation(item.children) : undefined
    }));
  };

  const filteredNavigation = filterNavigation(navigation);

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);
    const isActive = pathname === item.path;
    const hasActiveChild = item.children?.some(child => pathname === child.path);

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`
            flex items-center justify-center px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all duration-200
            ${isActive || hasActiveChild ? 'border-l-4' : ''}
            ${level > 0 ? 'ml-4' : ''}
          `}
          style={{
            backgroundColor: (isActive || hasActiveChild) ? '#f0f9f4' : 'transparent',
            borderColor: (isActive || hasActiveChild) ? '#1693a5' : 'transparent',
            color: (isActive || hasActiveChild) ? '#1693a5' : '#7cb490'
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && isExpanded && (
              <button
                onClick={() => toggleSection(item.id)}
                className="p-1 rounded transition-colors duration-200 hover:bg-white/50"
                style={{ color: '#7cb490' }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && isExpanded && (
              <div className="w-4" />
            )}
            <div className={`w-5 h-5 flex items-center justify-center`}>
              {item.icon}
            </div>
            {isExpanded && (
              <>
                {item.path ? (
                  <Link 
                    href={item.path} 
                    className="flex-1 font-medium transition-colors duration-200 hover:opacity-80"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex-1 font-medium">{item.label}</span>
                )}
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r z-40 shadow-lg transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-16'}
      `} style={{ borderColor: '#1693a5' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#1693a5', backgroundColor: '#f0f9f4' }}>
          {isExpanded && (
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logo.svg"
                alt="TIYUY"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="font-semibold text-sm" style={{ color: '#1693a5' }}>Admin Panel</span>
                <div className="text-xs" style={{ color: '#7cb490' }}>Tiyuy Platform</div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/50"
            style={{ color: '#1693a5' }}
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {isExpanded && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7cb490' }}>
                Main Navigation
              </h3>
            </div>
          )}
          <div className="px-2">
            {filteredNavigation.map(item => renderNavItem(item))}
          </div>
        </nav>

        {/* Footer */}
        {isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: '#1693a5', backgroundColor: '#f0f9f4' }}>
            <div className="text-xs text-center" style={{ color: '#1693a5' }}>
              <div className="font-medium">Administra Tiyuy</div>
              <div className="mt-1">Version 1.0.0</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
