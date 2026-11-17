'use client';

import { useState } from 'react';

import {
  LogoutDialog,
  SidebarFooter,
  SidebarNav,
} from './components';
import { useLogout } from './hooks/useLogout';
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

  const handleLogout = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    if (collapsed) {
      onRequestExpand?.();
      expandSection(sectionId);
      return;
    }

    toggleSection(sectionId);
  };

  return (
    <>
      <SidebarNav
        items={filteredNavigation}
        collapsed={collapsed}
        expandedSections={expandedSections}
        pathname={pathname}
        onSectionClick={handleSectionClick}
        onNavigate={onNavigate}
      />

      <SidebarFooter
        collapsed={collapsed}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {showLogoutModal && (
        <LogoutDialog
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}

export type {
  AdminSidebarProps,
  SidebarNavItem,
} from './types';
