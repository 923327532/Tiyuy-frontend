'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Controla el estado del menú de perfil, el cierre por clic
 * fuera y el cierre con Escape devolviendo el foco al trigger.
 */
export function useProfileMenu() {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setOpen((previous) => !previous);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  return {
    open,
    closeMenu,
    toggleMenu,
    containerRef,
    triggerRef,
  };
}
