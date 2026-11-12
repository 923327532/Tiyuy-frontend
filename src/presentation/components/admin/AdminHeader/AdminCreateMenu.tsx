'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ChevronDown,
  Megaphone,
  PlusCircle,
  Settings,
  ShieldCheck,
  Tag,
  User,
} from 'lucide-react';
import { usePermissions } from '@/presentation/hooks/usePermissions';

interface CreateAction {
  id: string;
  label: string;
  href: string;
  icon: typeof User;
  superAdminOnly?: boolean;
  divider?: boolean;
}

const ACTIONS: CreateAction[] = [
  { id: 'user', label: 'Nuevo usuario', href: '/admin/users?action=create', icon: User },
  {
    id: 'property',
    label: 'Nueva propiedad',
    href: '/admin/properties?action=create',
    icon: Building2,
  },
  {
    id: 'campaign',
    label: 'Nueva campaña',
    href: '/admin/campaigns?action=create',
    icon: Megaphone,
  },
  {
    id: 'discount',
    label: 'Nuevo descuento',
    href: '/admin/discounts?action=create',
    icon: Tag,
  },
  {
    id: 'admin',
    label: 'Nuevo administrador',
    href: '/admin/admins?action=create',
    icon: Settings,
    superAdminOnly: true,
    divider: true,
  },
  {
    id: 'roles',
    label: 'Roles del sistema',
    href: '/admin/admins',
    icon: ShieldCheck,
    superAdminOnly: true,
  },
];

export function AdminCreateMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSuperAdmin } = usePermissions();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const visibleActions = ACTIONS.filter(
    (action) => !action.superAdminOnly || isSuperAdmin,
  );

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/20 sm:text-sm"
      >
        <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        <span className="hidden lg:inline">Crear</span>
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-lg border border-[#1e4a57] bg-[#0f2e3a] shadow-xl"
        >
          <div className="py-1">
            {visibleActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    router.push(action.href);
                  }}
                  className={[
                    'flex w-full items-center gap-3 px-4 py-2 text-left text-xs text-white/80 transition hover:bg-white/10 hover:text-white sm:text-sm',
                    action.divider ? 'mt-1 border-t border-[#1e4a57] pt-2.5' : '',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
