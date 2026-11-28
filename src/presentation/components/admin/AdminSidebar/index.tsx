'use client';

import { SidebarNav } from './components';
import { useSidebarNavigation } from './hooks/useSidebarNavigation';
import type { AdminSidebarProps } from './types';

export function AdminSidebar({
  collapsed,
  onNavigate,
  onRequestExpand,
}: AdminSidebarProps) {
  const {
    pathname,
    filteredNavigation,
    expandedSections,
    toggleSection,
    expandSection,
  } = useSidebarNavigation();

  const handleSectionClick = (sectionId: string) => {
    if (collapsed) {
      onRequestExpand?.();
      expandSection(sectionId);
      return;
    }

    toggleSection(sectionId);
  };

  return (
    <SidebarNav
      items={filteredNavigation}
      collapsed={collapsed}
      expandedSections={expandedSections}
      pathname={pathname}
      onSectionClick={handleSectionClick}
      onNavigate={onNavigate}
    />
  );
}

export type {
  AdminSidebarProps,
  SidebarNavItem,
} from './types';
