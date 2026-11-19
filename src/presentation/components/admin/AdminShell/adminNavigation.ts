import type { ElementType } from 'react';
import {
  Activity,
  Bell,
  Building,
  Building2,
  DollarSign,
  FileText,
  Globe2,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  Tag,
  UserCircle,
  Users,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: ElementType;
  requiredPermission?: string;
  /** Only mark the item as active on an exact pathname match. */
  exact?: boolean;
  /** Set to false for shortcut entries that share a route with another module. */
  showActive?: boolean;
  /** Extra terms used by the header search. */
  keywords?: string[];
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

/**
 * Single source of truth for the admin navigation.
 * Routes are kept identical to the existing pages so no functionality is lost.
 */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    title: 'General',
    items: [
      {
        label: 'Resumen',
        href: '/admin',
        icon: LayoutDashboard,
        exact: true,
        keywords: ['resumen', 'dashboard', 'inicio', 'panel'],
      },
    ],
  },
  {
    title: 'Inventario',
    items: [
      {
        label: 'Propiedades',
        href: '/admin/properties',
        icon: Building,
        requiredPermission: 'PROPERTIES_VIEW',
        keywords: ['propiedades', 'inmuebles', 'properties', 'inventario'],
      },
      {
        label: 'Proyectos',
        href: '/admin/projects',
        icon: Package,
        requiredPermission: 'PROJECTS_VIEW',
        keywords: ['proyectos', 'projects', 'desarrollos'],
      },
    ],
  },
  {
    title: 'Comercial',
    items: [
      {
        label: 'Contactos y grupos',
        href: '/admin/groups',
        icon: Users,
        requiredPermission: 'GROUPS_VIEW',
        keywords: ['contactos', 'grupos', 'canales', 'leads', 'comunidad'],
      },
      {
        label: 'Agentes',
        href: '/admin/agents',
        icon: UserCircle,
        requiredPermission: 'USERS_VIEW',
        keywords: ['agentes', 'agents', 'independientes'],
      },
      {
        label: 'Inmobiliarias',
        href: '/admin/agencies',
        icon: Building2,
        requiredPermission: 'AGENCIES_VIEW',
        keywords: ['inmobiliarias', 'agencias', 'agencies'],
      },
      {
        label: 'Marketing',
        href: '/admin/campaigns',
        icon: Megaphone,
        requiredPermission: 'COMMUNICATIONS_MANAGE',
        keywords: ['marketing', 'campanas', 'campaigns', 'promociones'],
      },
      {
        label: 'Banners',
        href: '/admin/campaigns/banners',
        icon: ImageIcon,
        requiredPermission: 'COMMUNICATIONS_MANAGE',
        keywords: ['banners', 'publicidad', 'imagenes'],
      },
    ],
  },
  {
    title: 'Negocio',
    items: [
      {
        label: 'Finanzas',
        href: '/admin/finance',
        icon: DollarSign,
        requiredPermission: 'FINANCE_VIEW',
        keywords: ['finanzas', 'finance', 'pagos', 'ingresos'],
      },
      {
        label: 'Planes',
        href: '/admin/plans',
        icon: Layers,
        requiredPermission: 'FINANCE_VIEW',
        keywords: ['planes', 'suscripciones', 'plans'],
      },
      {
        label: 'Descuentos',
        href: '/admin/discounts',
        icon: Tag,
        requiredPermission: 'DISCOUNTS_CREATE',
        keywords: ['descuentos', 'cupones', 'discounts'],
      },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      {
        label: 'Moderación',
        href: '/admin/properties',
        icon: ShieldCheck,
        requiredPermission: 'PROPERTIES_MODERATE',
        showActive: false,
        keywords: ['moderacion', 'aprobar', 'pendientes'],
      },
      {
        label: 'Soporte',
        href: '/admin/communications',
        icon: MessageSquare,
        requiredPermission: 'COMMUNICATIONS_VIEW',
        keywords: ['soporte', 'tickets', 'comunicaciones', 'incidencias'],
      },
      {
        label: 'Reclamos',
        href: '/admin/reclamos',
        icon: FileText,
        keywords: ['reclamos', 'quejas', 'indecopi'],
      },
      {
        label: 'Notificaciones',
        href: '/admin/notifications',
        icon: Bell,
        requiredPermission: 'NOTIFICATIONS_SEND',
        keywords: ['notificaciones', 'avisos', 'notifications'],
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        label: 'Usuarios',
        href: '/admin/users',
        icon: Users,
        requiredPermission: 'USERS_VIEW',
        keywords: ['usuarios', 'users', 'clientes', 'cuentas'],
      },
      {
        label: 'Extranjeros',
        href: '/admin/international',
        icon: Globe2,
        requiredPermission: 'USERS_VIEW',
        keywords: ['extranjeros', 'internacional', 'kyc', 'documentos'],
      },
      {
        label: 'Administradores',
        href: '/admin/admins',
        icon: ShieldCheck,
        requiredPermission: 'ADMINS_VIEW',
        keywords: ['administradores', 'admins', 'equipo'],
      },
      {
        label: 'Actividad',
        href: '/admin/activities',
        icon: Activity,
        requiredPermission: 'AUDIT_LOGS_VIEW',
        keywords: ['actividad', 'activities', 'eventos'],
      },
      {
        label: 'Auditoría',
        href: '/admin/audit',
        icon: FileText,
        requiredPermission: 'AUDIT_LOGS_VIEW',
        keywords: ['auditoria', 'audit', 'registros'],
      },
      {
        label: 'Configuración',
        href: '/admin/profile',
        icon: Settings,
        keywords: ['configuracion', 'perfil', 'cuenta', 'settings'],
      },
    ],
  },
];

/** Flat list used by the header search. */
export const ADMIN_SEARCH_ROUTES = ADMIN_NAV_SECTIONS.flatMap((section) =>
  section.items
    .filter((item) => item.keywords && item.keywords.length > 0)
    .map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
      keywords: item.keywords ?? [],
      permission: item.requiredPermission,
    })),
);

export function isNavItemActive(
  item: AdminNavItem,
  pathname: string,
): boolean {
  if (item.showActive === false) return false;
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
