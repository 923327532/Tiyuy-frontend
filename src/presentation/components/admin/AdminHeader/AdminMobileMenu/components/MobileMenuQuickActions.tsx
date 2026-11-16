'use client';

import { usePermissions } from '@/presentation/hooks/usePermissions';

import { QUICK_ACTIONS } from '../constants';

interface MobileMenuQuickActionsProps {
  onNavigate: (href: string) => void;
}

export function MobileMenuQuickActions({
  onNavigate,
}: MobileMenuQuickActionsProps) {
  const { hasPermission } = usePermissions();

  const actions = QUICK_ACTIONS.filter(
    (action) =>
      !action.permission || hasPermission(action.permission),
  );

  if (actions.length === 0) return null;

  return (
    <section aria-labelledby="quick-actions-title">
      <h3
        id="quick-actions-title"
        className="
          mb-3 px-2
          text-[10px] font-bold uppercase
          tracking-[0.16em] text-slate-400
        "
      >
        Acciones rápidas
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.href}
              type="button"
              onClick={() => onNavigate(action.href)}
              className="
                flex min-h-[76px] flex-col
                items-start justify-between
                rounded-xl border border-white/10
                bg-white/[0.04] p-3
                text-left transition
                hover:border-cyan-400/30
                hover:bg-white/[0.08]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-400
              "
            >
              <span
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg bg-cyan-400/10 text-cyan-300
                "
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="text-xs font-medium text-white/90">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
