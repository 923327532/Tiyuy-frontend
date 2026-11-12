'use client';

import Link from 'next/link';
import { Building2, FolderKanban, Megaphone, ShieldCheck, TicketPercent } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  hidden?: boolean;
}

interface DashboardQuickActionsProps {
  pendingProperties?: number;
  canViewMarketing: boolean;
}

export function DashboardQuickActions({
  pendingProperties,
  canViewMarketing,
}: DashboardQuickActionsProps) {
  // Ajusta las rutas a tu router (p. ej. /admin/properties/new si existe).
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
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-[#0f2e3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30"
          >
            <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />
            {label}
            {badge ? (
              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-rose-700">
                {badge}
              </span>
            ) : null}
          </Link>
        ))}
    </nav>
  );
}