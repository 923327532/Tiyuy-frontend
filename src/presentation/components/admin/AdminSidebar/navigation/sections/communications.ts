import {
  Activity,
  Bell,
  Megaphone,
  MessageSquare,
} from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const communicationsSection: SidebarNavItem = {
  id: 'communications',
  label: 'Comunicaciones y Soporte',
  icon: MessageSquare,
  children: [
    {
      id: 'activities',
      label: 'Actividades',
      icon: Activity,
      path: '/admin/activities',
      requiredPermissions: ['AUDIT_LOGS_VIEW'],
    },
    {
      id: 'support',
      label: 'Centro de Soporte',
      icon: MessageSquare,
      path: '/admin/communications',
      requiredPermissions: ['COMMUNICATIONS_VIEW'],
    },
    {
      id: 'claims',
      label: 'Reclamos',
      icon: Megaphone,
      path: '/admin/reclamos',
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: Bell,
      path: '/admin/notifications',
      requiredPermissions: ['NOTIFICATIONS_SEND'],
    },
  ],
};
