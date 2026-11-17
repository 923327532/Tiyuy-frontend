'use client';

import { useEffect, useRef } from 'react';

/**
 * Abre un flujo de creación cuando la URL incluye `?action=create`.
 *
 * El parámetro se elimina de la URL después de abrir el flujo para
 * que recargar la página no vuelva a abrir el modal.
 */
export function useCreateActionParam(onCreate: () => void) {
  const onCreateRef = useRef(onCreate);

  useEffect(() => {
    onCreateRef.current = onCreate;
  }, [onCreate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    if (url.searchParams.get('action') !== 'create') return;

    onCreateRef.current();

    url.searchParams.delete('action');
    window.history.replaceState(
      {},
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);
}
