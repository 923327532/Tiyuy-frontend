import {
  FileText,
  ShieldCheck,
  UserCircle,
} from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const administrationSection: SidebarNavItem = {
  id: 'admin-management',
  label: 'Administración',
  icon: ShieldCheck,
  children: [
    {
      id: 'admin-users',
      label: 'Usuarios Admin',
      icon: ShieldCheck,
      path: '/admin/admins',
      requiredPermissions: ['ADMINS_VIEW'],
    },
    {
      id: 'audit',
      label: 'Auditoría',
      icon: FileText,
      path: '/admin/audit',
      requiredPermissions: ['AUDIT_LOGS_VIEW'],
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: UserCircle,
      path: '/admin/profile',
    },
  ],
};
