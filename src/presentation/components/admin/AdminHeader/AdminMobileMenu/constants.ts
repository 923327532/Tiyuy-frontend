import {
  Bell,
  CreditCard,
  DollarSign,
  Image as ImageIcon,
  Users,
  User,
} from 'lucide-react';

import type { MobileMenuItem } from './types';

export const QUICK_ACTIONS: MobileMenuItem[] = [
  {
    label: 'Nuevo grupo',
    href: '/admin/groups/new',
    icon: Users,
    permission: 'GROUPS_MANAGE',
  },
  {
    label: 'Nuevo banner',
    href: '/admin/campaigns/banners?action=create',
    icon: ImageIcon,
    permission: 'COMMUNICATIONS_MANAGE',
  },
  {
    label: 'Enviar notificación',
    href: '/admin/notifications',
    icon: Bell,
    permission: 'NOTIFICATIONS_SEND',
  },
  {
    label: 'Crear plan',
    href: '/admin/plans?action=create',
    icon: CreditCard,
    permission: 'FINANCE_MANAGE_SUBSCRIPTIONS',
  },
];

export const NAVIGATION_LINKS: MobileMenuItem[] = [
  {
    label: 'Notificaciones',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    label: 'Finanzas',
    href: '/admin/finance',
    icon: DollarSign,
  },
  {
    label: 'Mi perfil',
    href: '/admin/profile',
    icon: User,
  },
];
