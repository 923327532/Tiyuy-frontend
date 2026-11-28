'use client';

import type { RefObject } from 'react';

import { ChevronDown, Plus } from 'lucide-react';

interface CreateMenuTriggerProps {
  open: boolean;
  menuId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
}

export function CreateMenuTrigger({
  open,
  menuId,
  triggerRef,
  onToggle,
}: CreateMenuTriggerProps) {
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-haspopup="menu"
      aria-controls={menuId}
      className="
        group inline-flex items-center gap-2
        rounded-xl border border-[var(--border-admin-sidebar)]
        bg-[var(--bg-admin-sidebar-hover)] px-3.5 py-2
        text-sm font-semibold text-[var(--text-admin-sidebar)]
        shadow-sm transition-all duration-200
        hover:border-[var(--color-admin-accent)]
        hover:bg-[var(--bg-admin-sidebar-active)]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[var(--color-admin-accent)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--bg-admin-sidebar)]
      "
    >
      <span
        className="
          flex h-6 w-6 items-center justify-center
          rounded-lg border border-[var(--color-admin-accent)]
          bg-[var(--bg-admin-sidebar-active)] text-[var(--color-admin-accent)]
          transition-colors group-hover:bg-[var(--bg-admin-sidebar-hover)]
        "
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </span>

      <span>Crear</span>

      <ChevronDown
        className={`
          h-3.5 w-3.5 text-[var(--text-admin-sidebar-muted)]
          transition-transform duration-200
          ${open ? 'rotate-180 text-[var(--color-admin-accent)]' : ''}
        `}
        aria-hidden="true"
      />
    </button>
  );
}
