'use client';

import type { RefObject } from 'react';

import { ArrowUpRight, Plus } from 'lucide-react';

import type { CreateActionGroup } from '../types';

interface CreateMenuPanelProps {
  id: string;
  panelRef: RefObject<HTMLDivElement | null>;
  groups: CreateActionGroup[];
  onAction: (href: string) => void;
}

export function CreateMenuPanel({
  id,
  panelRef,
  groups,
  onAction,
}: CreateMenuPanelProps) {
  return (
    <div
      id={id}
      ref={panelRef}
      role="menu"
      aria-label="Acciones rápidas"
      className="
        absolute right-0 top-full z-50 mt-3
        w-[310px] max-w-[calc(100vw-2rem)]
        overflow-hidden rounded-2xl
        border border-[var(--border-admin-sidebar)]
        bg-[var(--bg-admin-sidebar)] p-2
        shadow-[0_18px_55px_-15px_rgba(0,0,0,0.65)]
        animate-menu-drop-in
      "
    >
      {/* Header */}
      <div className="px-3 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg border border-[var(--color-admin-accent)]
              bg-[var(--bg-admin-sidebar-active)]
            "
          >
            <Plus className="h-4 w-4 text-[var(--color-admin-accent)]" aria-hidden="true" />
          </div>

          <div>
            <p className="text-sm font-bold text-[var(--text-admin-sidebar)]">
              Acciones rápidas
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--text-admin-sidebar-muted)]">
              Operaciones administrativas de TIYUY
            </p>
          </div>
        </div>
      </div>

      {/* Groups */}
      {groups.map((group, groupIndex) => (
        <div
          key={group.label}
          role="group"
          aria-label={group.label}
          className={
            groupIndex > 0
              ? 'mt-2 border-t border-[var(--border-admin-sidebar)] pt-2'
              : ''
          }
        >
          <p
            className="
              px-3 py-2 text-[10px] font-bold
              uppercase tracking-[0.13em]
              text-[var(--text-admin-sidebar-heading)]
            "
          >
            {group.label}
          </p>

          <div className="space-y-1">
            {group.actions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => onAction(action.href)}
                  className="
                    group/item flex w-full items-center gap-3
                    rounded-xl border border-transparent
                    px-3 py-2.5 text-left
                    transition-all duration-150
                    hover:border-[var(--border-admin-sidebar)]
                    hover:bg-[var(--bg-admin-sidebar-hover)]
                    focus-visible:border-[var(--color-admin-accent)]
                    focus-visible:bg-[var(--bg-admin-sidebar-hover)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-[var(--color-admin-accent)]
                  "
                >
                  <span
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-xl border border-[var(--border-admin-sidebar)]
                      bg-[var(--bg-admin-sidebar-hover)] text-[var(--text-admin-sidebar-muted)]
                      transition-all duration-150
                      group-hover/item:border-[var(--color-admin-accent)]
                      group-hover/item:bg-[var(--bg-admin-sidebar-active)]
                      group-hover/item:text-[var(--color-admin-accent)]
                    "
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block text-[13px] font-semibold
                        text-[var(--text-admin-sidebar)]
                        transition-colors
                        group-hover/item:text-[var(--color-admin-accent)]
                      "
                    >
                      {action.label}
                    </span>

                    <span
                      className="
                        mt-0.5 block text-[11px]
                        text-[var(--text-admin-sidebar-muted)]
                        transition-colors
                        group-hover/item:text-[var(--text-admin-sidebar)]
                      "
                    >
                      {action.description}
                    </span>
                  </span>

                  <ArrowUpRight
                    className="
                      h-4 w-4 shrink-0
                      text-[var(--text-admin-sidebar-heading)] opacity-0
                      transition-all duration-150
                      group-hover/item:translate-x-0.5
                      group-hover/item:text-[var(--color-admin-accent)]
                      group-hover/item:opacity-100
                    "
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-2 border-t border-[var(--border-admin-sidebar)] px-3 py-2.5">
        <p className="text-center text-[10px] text-[var(--text-admin-sidebar-heading)]">
          Panel administrativo · TIYUY
        </p>
      </div>
    </div>
  );
}
