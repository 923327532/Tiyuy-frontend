import {
  Bell,
  CreditCard,
  Image as ImageIcon,
  ShieldCheck,
  Users,
} from 'lucide-react';

import type { CreateActionGroup } from './types';

/**
 * Solo flujos de creación que existen realmente en el panel.
 *
 * - Grupo: formulario en /admin/groups/new
 * - Banner: modal en /admin/campaigns/banners
 * - Notificación: formulario en /admin/notifications
 * - Plan: modal en /admin/plans
 * - Administrador: selector de rol en /admin/admins
 */
export const ACTION_GROUPS: CreateActionGroup[] = [
  {
    label: 'Operaciones',
    actions: [
      {
        id: 'group',
        label: 'Nuevo grupo',
        description: 'Crear un grupo de usuarios',
        href: '/admin/groups/new',
        icon: Users,
        permission: 'GROUPS_MANAGE',
      },
      {
        id: 'banner',
        label: 'Nuevo banner',
        description: 'Publicar un banner promocional',
        href: '/admin/campaigns/banners?action=create',
        icon: ImageIcon,
        permission: 'COMMUNICATIONS_MANAGE',
      },
      {
        id: 'notification',
        label: 'Enviar notificación',
        description: 'Comunicar a usuarios y agentes',
        href: '/admin/notifications',
        icon: Bell,
        permission: 'NOTIFICATIONS_SEND',
      },
    ],
  },
  {
    label: 'Suscripciones y accesos',
    actions: [
      {
        id: 'plan',
        label: 'Crear plan',
        description: 'Definir un plan de suscripción',
        href: '/admin/plans?action=create',
        icon: CreditCard,
        permission: 'FINANCE_MANAGE_SUBSCRIPTIONS',
      },
      {
        id: 'admin',
        label: 'Nuevo administrador',
        description: 'Crear una cuenta administrativa',
        href: '/admin/admins?action=create',
        icon: ShieldCheck,
        superAdminOnly: true,
      },
    ],
  },
];
