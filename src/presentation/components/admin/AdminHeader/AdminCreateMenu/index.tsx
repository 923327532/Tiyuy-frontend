'use client';

import { useId, useMemo } from 'react';

import { usePermissions } from '@/presentation/hooks/usePermissions';

import { CreateMenuPanel } from './components/CreateMenuPanel';
import { CreateMenuTrigger } from './components/CreateMenuTrigger';
import { ACTION_GROUPS } from './createActions';
import { useCreateMenu } from './hooks/useCreateMenu';
import { getVisibleActionGroups } from './utils';

export function AdminCreateMenu() {
  const menuId = useId();
  const { hasPermission, isSuperAdmin } = usePermissions();

  const {
    open,
    toggle,
    goTo,
    containerRef,
    triggerRef,
    menuRef,
  } = useCreateMenu();

  const visibleGroups = useMemo(
    () =>
      getVisibleActionGroups(ACTION_GROUPS, {
        hasPermission,
        isSuperAdmin,
      }),
    [hasPermission, isSuperAdmin],
  );

  if (visibleGroups.length === 0) return null;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <CreateMenuTrigger
        open={open}
        menuId={menuId}
        triggerRef={triggerRef}
        onToggle={toggle}
      />

      {open && (
        <CreateMenuPanel
          id={menuId}
          panelRef={menuRef}
          groups={visibleGroups}
          onAction={goTo}
        />
      )}
    </div>
  );
}
