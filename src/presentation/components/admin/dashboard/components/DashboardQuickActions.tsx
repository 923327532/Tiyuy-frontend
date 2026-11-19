'use client';

import Link from 'next/link';
import { ShieldCheck, FolderKanban, Building2, Megaphone, TicketPercent } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DashboardQuickActionsProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { Badge } from '@/presentation/components/ui/Badge';

interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  hidden?: boolean;
}

export function DashboardQuickActions({
  pendingProperties,
  canViewMarketing,
}: DashboardQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'moderate',
      label: 'Moderar propiedades',
      href: '/admin/properties',
      icon: ShieldCheck,
      badge: pendingProperties,
    },
    { id: 'projects', label: 'Proyectos', href: '/admin/projects', icon: FolderKanban },
    { id: 'listings', label: 'Propiedades', href: '/admin/properties', icon: Building2 },
    {
      id: 'campaigns',
      label: 'Campañas',
      href: '/admin/campaigns',
      icon: Megaphone,
      hidden: !canViewMarketing,
    },
    { id: 'discounts', label: 'Descuentos', href: '/admin/discounts', icon: TicketPercent },
  ];

  return (
    <nav aria-label="Accesos rápidos" className="flex flex-wrap gap-2">
      {actions
        .filter((action) => !action.hidden)
        .map(({ id, label, href, icon: Icon, badge }) => (
          <Link
            key={id}
            href={href}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-brand-300 hover:text-brand-700 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
          >
            <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />
            {label}
            {badge !== undefined && badge > 0 && (
              <Badge variant="danger" size="xs">
                {badge}
              </Badge>
            )}
          </Link>
        ))}
    </nav>
  );
}