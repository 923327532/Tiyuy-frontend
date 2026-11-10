'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { publicApiClient } from '@/infrastructure/api/axios-client';
import { PAGE_SIZE, type PageResponse } from '../_components/types';

interface Filters { q: string; city: string; page: number }

export function useAgencies() {
  const [draft, setDraft] = useState('');                 // lo que se escribe
  const [filters, setFilters] = useState<Filters>({ q: '', city: '', page: 0 }); // lo aplicado
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Única fuente de fetch: cualquier cambio de filtros/página dispara UNA petición
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const params: Record<string, string | number> = { page: filters.page, size: PAGE_SIZE };
    if (filters.q) params.q = filters.q;
    if (filters.city) params.city = filters.city;

    publicApiClient
      .get<PageResponse>('/public/agencies', { params, signal: controller.signal })
      .then((res) => setData(res.data))
      .catch((err) => { if (!axios.isCancel(err)) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort(); // evita que una respuesta vieja pise a la nueva
  }, [filters, reloadKey]);

  const submitSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, q: draft.trim(), page: 0 }));
  }, [draft]);

  const setCity = useCallback((city: string) => {
    setFilters((f) => ({ ...f, city, page: 0 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearFilters = useCallback(() => {
    setDraft('');
    setFilters({ q: '', city: '', page: 0 });
  }, []);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return {
    draft, setDraft, filters, data, loading, error,
    hasFilters: Boolean(filters.q || filters.city),
    submitSearch, setCity, setPage, clearFilters, retry,
  };
}