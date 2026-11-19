import {
  Building2,
  Globe2,
  Users,
} from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const usersSection: SidebarNavItem = {
  id: 'user-management',
  label: 'Gestión de Usuarios',
  icon: Users,
  children: [
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      path: '/admin/users',
      requiredPermissions: ['USERS_VIEW'],
    },
    {
      id: 'international-users',
      label: 'Extranjeros',
      icon: Globe2,
      path: '/admin/international',
      requiredPermissions: ['USERS_VIEW'],
    },
    {
      id: 'agents',
      label: 'Agentes',
      icon: Users,
      path: '/admin/agents',
      exact: true,
      requiredPermissions: ['USERS_VIEW'],
    },
    {
      id: 'agencies',
      label: 'Inmobiliarias',
      icon: Building2,
      path: '/admin/agencies',
      exact: true,
      requiredPermissions: ['AGENCIES_VIEW'],
    },
    {
      id: 'association-requests',
      label: 'Solicitudes de Asociación',
      icon: Building2,
      path: '/admin/agencies/association-requests',
      requiredPermissions: ['AGENCIES_VIEW'],
    },
    {
      id: 'groups',
      label: 'Grupos y Canales',
      icon: Users,
      path: '/admin/groups',
      exact: true,
      requiredPermissions: ['GROUPS_VIEW'],
    },
  ],
};
