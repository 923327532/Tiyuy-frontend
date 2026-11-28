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
          ? 'bg-[var(--bg-admin-sidebar-active)] text-[var(--text-admin-sidebar)]'
          : 'text-[var(--text-admin-sidebar-muted)] hover:bg-[var(--bg-admin-sidebar-active)] hover:text-[var(--text-admin-sidebar)]'
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
              ? 'bg-[var(--bg-admin-sidebar)] text-[var(--color-admin-accent)]'
              : 'bg-[var(--bg-admin-sidebar)] text-[var(--text-admin-sidebar-muted)] group-hover:text-[var(--color-admin-accent)]'
          }
        `}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {route.label}
        </span>

        <span className="mt-0.5 block truncate text-[11px] text-[var(--text-admin-sidebar-muted)]">
          {route.href}
        </span>
      </span>

      {isActive && (
        <CornerDownLeft className="h-4 w-4 shrink-0 text-[var(--color-admin-accent)]" />
      )}
    </button>
  );
}
