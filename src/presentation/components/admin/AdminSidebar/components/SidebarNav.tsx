'use client';

import type { SidebarNavItem as SidebarNavItemModel } from '../types';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarNavProps {
  items: SidebarNavItemModel[];
  collapsed: boolean;
  expandedSections: string[];
  pathname: string;
  onSectionClick: (sectionId: string) => void;
  onNavigate?: () => void;
}

export function SidebarNav({
  items,
  collapsed,
  expandedSections,
  pathname,
  onSectionClick,
  onNavigate,
}: SidebarNavProps) {
  return (
    <nav
      aria-label="Navegación administrativa"
      className="
        min-h-0 flex-1 overflow-y-auto
        overflow-x-hidden px-2 py-4
      "
    >
      {!collapsed && (
        <p
          className="
            mb-3 px-3 text-[10px] font-bold uppercase
            tracking-[0.15em] text-slate-500
          "
        >
          Navegación principal
        </p>
      )}

      <div className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            expandedSections={expandedSections}
            pathname={pathname}
            onSectionClick={onSectionClick}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}
