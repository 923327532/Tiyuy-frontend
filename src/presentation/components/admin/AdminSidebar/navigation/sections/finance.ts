import { CreditCard, DollarSign } from 'lucide-react';

import type { SidebarNavItem } from '../../types';

export const financeSection: SidebarNavItem = {
  id: 'finance',
  label: 'Finanzas',
  icon: DollarSign,
  children: [
    {
      id: 'finance-overview',
      label: 'Finanzas',
      icon: DollarSign,
      path: '/admin/finance',
      requiredPermissions: ['FINANCE_VIEW'],
    },
    {
      id: 'plans',
      label: 'Planes',
      icon: CreditCard,
      path: '/admin/plans',
      requiredPermissions: ['FINANCE_VIEW'],
    },
  ],
};
