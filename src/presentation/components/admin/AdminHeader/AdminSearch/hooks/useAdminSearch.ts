'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { useRouter } from 'next/navigation';

import { usePermissions } from '@/presentation/hooks/usePermissions';
import { ADMIN_SEARCH_ROUTES } from '@/presentation/components/admin/AdminShell/adminNavigation';
import type { AdminSearchRoute } from '../types';

/**
 * Estado, filtrado, atajos de teclado y navegación del buscador
 * del header administrativo.
 */
export function useAdminSearch() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isSuperAdmin, hasPermission } = usePermissions();

  // --------------------------------------------------
  // FILTRADO DE RUTAS Y PERMISOS
  // --------------------------------------------------

  const filteredRoutes = useMemo<AdminSearchRoute[]>(() => {
    const term = query.trim().toLowerCase();

    if (!term) return [];

    return ADMIN_SEARCH_ROUTES.filter((route) => {
      if (
        route.permission &&
        !isSuperAdmin &&
        !hasPermission(route.permission)
      ) {
        return false;
      }

      return (
        route.label.toLowerCase().includes(term) ||
        route.keywords.some((keyword) =>
          keyword.toLowerCase().includes(term),
        ) ||
        route.href.toLowerCase().includes(term)
      );
    });
  }, [query, isSuperAdmin, hasPermission]);

  const hasResults = filteredRoutes.length > 0;
  const shouldShowResults =
    showResults && query.trim().length > 0;

  // --------------------------------------------------
  // NAVEGACIÓN
  // --------------------------------------------------

  const selectRoute = useCallback(
    (href: string) => {
      setQuery('');
      setShowResults(false);
      setActiveIndex(0);

      router.push(href);
    },
    [router],
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setShowResults(false);
    setActiveIndex(0);

    inputRef.current?.focus();
  }, []);

  // --------------------------------------------------
  // ATAJOS DE TECLADO GLOBALES
  // --------------------------------------------------

  useEffect(() => {
    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key?.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // --------------------------------------------------
  // CERRAR AL HACER CLIC FUERA
  // --------------------------------------------------

  useEffect(() => {
    if (!showResults) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        !containerRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );
    };
  }, [showResults]);

  // --------------------------------------------------
  // TECLADO DEL BUSCADOR
  // --------------------------------------------------

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (!shouldShowResults) {
          setShowResults(true);
          return;
        }

        if (hasResults) {
          setActiveIndex((previous) =>
            Math.min(previous + 1, filteredRoutes.length - 1),
          );
        }

        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (hasResults) {
          setActiveIndex((previous) => Math.max(previous - 1, 0));
        }

        return;
      }

      if (event.key === 'Enter') {
        if (!shouldShowResults) return;

        event.preventDefault();

        const route = filteredRoutes[activeIndex];

        if (route) {
          selectRoute(route.href);
        }

        return;
      }

      if (event.key === 'Escape') {
        if (showResults) {
          event.preventDefault();
          setShowResults(false);
        } else {
          setQuery('');
        }
      }
    },
    [
      activeIndex,
      filteredRoutes,
      hasResults,
      selectRoute,
      shouldShowResults,
      showResults,
    ],
  );

  // --------------------------------------------------
  // CAMBIOS DE BÚSQUEDA
  // --------------------------------------------------

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    setShowResults(value.trim().length > 0);
    setActiveIndex(0);
  }, []);

  const handleFocus = useCallback(() => {
    if (query.trim()) setShowResults(true);
  }, [query]);

  return {
    query,
    shouldShowResults,
    filteredRoutes,
    hasResults,
    activeIndex,
    inputRef,
    containerRef,
    handleChange,
    handleKeyDown,
    handleFocus,
    clearSearch,
    selectRoute,
    setActiveIndex,
  };
}
