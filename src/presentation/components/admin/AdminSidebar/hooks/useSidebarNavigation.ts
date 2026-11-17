'use client';

import { useCallback, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { usePermissions } from '@/presentation/hooks/usePermissions';

import { INITIAL_EXPANDED_SECTIONS } from '../constants';
import { SIDEBAR_NAVIGATION } from '../navigation';
import {
  filterNavigation,
  getActiveSectionIds,
} from '../utils';

/**
 * Filtrado por permisos, secciones expandidas y estado activo
 * del sidebar administrativo.
 */
export function useSidebarNavigation() {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  const [expandedSections, setExpandedSections] =
    useState<string[]>(INITIAL_EXPANDED_SECTIONS);

  const filteredNavigation = useMemo(
    () => filterNavigation(SIDEBAR_NAVIGATION, hasPermission),
    [hasPermission],
  );

  const activeSectionIds = useMemo(
    () => getActiveSectionIds(filteredNavigation, pathname),
    [filteredNavigation, pathname],
  );

  // Mantiene abierta la sección que contiene la página actual.
  // Se sincroniza durante el render (no en un efecto) para evitar
  // renders en cascada.
  const activeSignature = activeSectionIds.join('|');
  const [syncedSignature, setSyncedSignature] =
    useState(activeSignature);

  if (syncedSignature !== activeSignature) {
    setSyncedSignature(activeSignature);

    if (activeSectionIds.length > 0) {
      setExpandedSections((previous) =>
        Array.from(
          new Set([...previous, ...activeSectionIds]),
        ),
      );
    }
  }

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((previous) =>
      previous.includes(sectionId)
        ? previous.filter((id) => id !== sectionId)
        : [...previous, sectionId],
    );
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections((previous) =>
      previous.includes(sectionId)
        ? previous
        : [...previous, sectionId],
    );
  }, []);

  return {
    pathname,
    filteredNavigation,
    expandedSections,
    toggleSection,
    expandSection,
  };
}
