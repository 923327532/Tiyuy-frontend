'use client';

import { CornerDownLeft } from 'lucide-react';

import type { AdminSearchRoute } from '../types';

interface SearchResultItemProps {
  route: AdminSearchRoute;
  index: number;
  isActive: boolean;
  onHover: (index: number) => void;
  onSelect: (href: string) => void;
}

export function SearchResultItem({
  route,
  index,
  isActive,
  onHover,
  onSelect,
}: SearchResultItemProps) {
  const Icon = route.icon;

  return (
    <button
      id={`admin-search-option-${index}`}
      type="button"
      role="option"
      aria-selected={isActive}
      onMouseEnter={() => onHover(index)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onSelect(route.href)}
      className={`
        group flex w-full items-center gap-3
        rounded-lg px-3 py-3
        text-left transition
        ${
          isActive
            ? 'bg-cyan-400/10 text-white'
            : 'text-white/75 hover:bg-white/[0.07] hover:text-white'
        }
      `}
    >
      <span
        className={`
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-lg transition
          ${
            isActive
              ? 'bg-cyan-400/15 text-cyan-300'
              : 'bg-white/[0.06] text-slate-400 group-hover:text-cyan-300'
          }
        `}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {route.label}
        </span>

        <span className="mt-0.5 block truncate text-[11px] text-slate-400">
          {route.href}
        </span>
      </span>

      {isActive && (
        <CornerDownLeft className="h-4 w-4 shrink-0 text-cyan-300" />
      )}
    </button>
  );
}
