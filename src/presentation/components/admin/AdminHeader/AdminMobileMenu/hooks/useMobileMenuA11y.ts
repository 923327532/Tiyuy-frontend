'use client';

import {
  useCallback,
  useEffect,
  type KeyboardEvent,
  type RefObject,
} from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), [tabindex="0"]';

interface UseMobileMenuA11yOptions {
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
}

/**
 * Maneja el foco, el bloqueo de scroll y el cierre con Escape
 * del menú móvil. Mantiene el foco atrapado dentro del panel
 * mientras está abierto.
 */
export function useMobileMenuA11y({
  open,
  onClose,
  panelRef,
}: UseMobileMenuA11yOptions) {
  useEffect(() => {
    if (!open) return;

    const previousActiveElement =
      document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    panelRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [open, onClose, panelRef]);

  const handlePanelKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Tab') return;

      const focusableElements =
        panelRef.current?.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        );

      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    },
    [panelRef],
  );

  return { handlePanelKeyDown };
}
