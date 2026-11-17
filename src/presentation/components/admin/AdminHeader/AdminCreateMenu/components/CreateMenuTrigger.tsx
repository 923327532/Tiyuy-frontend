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
        rounded-xl border border-white/10
        bg-white/[0.07] px-3.5 py-2
        text-sm font-semibold text-white
        shadow-sm transition-all duration-200
        hover:border-cyan-400/30
        hover:bg-white/[0.12]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-cyan-400
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0f2e3a]
      "
    >
      <span
        className="
          flex h-6 w-6 items-center justify-center
          rounded-lg border border-cyan-400/20
          bg-cyan-400/10 text-cyan-400
          transition-colors group-hover:bg-cyan-400/20
        "
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </span>

      <span>Crear</span>

      <ChevronDown
        className={`
          h-3.5 w-3.5 text-slate-400
          transition-transform duration-200
          ${open ? 'rotate-180 text-cyan-400' : ''}
        `}
        aria-hidden="true"
      />
    </button>
  );
}
