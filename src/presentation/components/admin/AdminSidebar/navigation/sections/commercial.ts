import {
  Calendar,
  Megaphone,
  Tag,
  Target,
} from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const commercialSection: SidebarNavItem = {
  id: 'commercial',
  label: 'Comercial y Marketing',
  icon: Megaphone,
  children: [
    {
      id: 'campaigns',
      label: 'Campañas',
      icon: Megaphone,
      path: '/admin/campaigns',
      exact: true,
      requiredPermissions: ['COMMUNICATIONS_MANAGE'],
    },
    {
      id: 'campaigns-list',
      label: 'Listado de Campañas',
      icon: Calendar,
      path: '/admin/campaigns/list',
      requiredPermissions: ['COMMUNICATIONS_MANAGE'],
    },
    {
      id: 'campaigns-banners',
      label: 'Banners',
      icon: Target,
      path: '/admin/campaigns/banners',
      requiredPermissions: ['COMMUNICATIONS_MANAGE'],
    },
    {
      id: 'discounts',
      label: 'Descuentos',
      icon: Tag,
      path: '/admin/discounts',
      requiredPermissions: ['DISCOUNTS_CREATE'],
    },
    {
      id: 'agent-discounts',
      label: 'Descuentos de Agentes',
      icon: Target,
      path: '/admin/agents/discounts',
      requiredPermissions: ['DISCOUNTS_MANAGE'],
    },
  ],
};
