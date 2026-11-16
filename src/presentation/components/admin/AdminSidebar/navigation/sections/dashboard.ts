import { Home } from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const dashboardSection: SidebarNavItem = {
  id: 'dashboard',
  label: 'Panel de Control',
  icon: Home,
  path: '/admin',
};
