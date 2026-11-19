'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

/**
 * Estado, foco y navegación por teclado del menú "Crear".
 */
export function useCreateMenu() {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const toggle = useCallback(() => {
    setOpen((previous) => !previous);
  }, []);

  const goTo = useCallback(
    (href: string) => {
      setOpen(false);

      // Si ya estamos en la página destino, una recarga garantiza que
      // el efecto de `?action=create` vuelva a ejecutarse.
      if (typeof window !== 'undefined') {
        const target = new URL(href, window.location.origin);

        if (target.pathname === window.location.pathname) {
          window.location.assign(href);
          return;
        }
      }

      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    if (!open) return;

    // Enfocar la primera acción al abrir el menú.
    const firstItem =
      menuRef.current?.querySelector<HTMLButtonElement>(
        '[role="menuitem"]',
      );

    firstItem?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        setOpen(false);
        return;
      }

      const isNavigationKey = [
        'ArrowDown',
        'ArrowUp',
        'Home',
        'End',
      ].includes(event.key);

      if (!isNavigationKey) return;

      const items =
        menuRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="menuitem"]',
        );

      if (!items?.length) return;

      event.preventDefault();

      const currentIndex = Array.from(items).indexOf(
        document.activeElement as HTMLButtonElement,
      );

      let nextIndex = currentIndex;

      if (event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % items.length;
      }

      if (event.key === 'ArrowUp') {
        nextIndex =
          (currentIndex - 1 + items.length) % items.length;
      }

      if (event.key === 'Home') {
        nextIndex = 0;
      }

      if (event.key === 'End') {
        nextIndex = items.length - 1;
      }

      items[nextIndex].focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return {
    open,
    toggle,
    goTo,
    containerRef,
    triggerRef,
    menuRef,
  };
}
