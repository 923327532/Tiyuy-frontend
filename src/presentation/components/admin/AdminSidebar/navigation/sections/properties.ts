import { Building2, Package } from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const propertiesSection: SidebarNavItem = {
  id: 'property-management',
  label: 'Propiedades y Proyectos',
  icon: Building2,
  children: [
    {
      id: 'properties',
      label: 'Propiedades',
      icon: Building2,
      path: '/admin/properties',
      requiredPermissions: ['PROPERTIES_VIEW'],
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: Package,
      path: '/admin/projects',
      requiredPermissions: ['PROJECTS_VIEW'],
    },
  ],
};
