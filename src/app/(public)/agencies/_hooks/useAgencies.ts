'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { publicApiClient } from '@/infrastructure/api/axios-client';
import { PAGE_SIZE, type PageResponse } from '../_components/types';

interface Filters { q: string; city: string; page: number }

function normalizeFilter(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function useAgencies() {
  const [draft, setDraft] = useState('');
  const [cityDraft, setCityDraft] = useState('');
  const [filters, setFilters] = useState<Filters>({ q: '', city: '', page: 0 });
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Única fuente de fetch: cualquier cambio de filtros/página dispara UNA petición
  useEffect(() => {
    const controller = new AbortController();

    const params: Record<string, string | number> = { page: filters.page, size: PAGE_SIZE };
    if (filters.q) params.q = filters.q;
    if (filters.city) params.city = filters.city;

    publicApiClient
      .get<PageResponse>('/public/agencies', { params, signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        setData(res.data);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err) && !controller.signal.aborted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => controller.abort(); // evita que una respuesta vieja pise a la nueva
  }, [filters, reloadKey]);

  const submitSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const nextFilters = {
      q: normalizeFilter(draft),
      city: normalizeFilter(cityDraft),
      page: 0,
    };
    setDraft(nextFilters.q);
    setCityDraft(nextFilters.city);
    if (
      filters.q === nextFilters.q &&
      filters.city === nextFilters.city &&
      filters.page === nextFilters.page
    ) {
      setLoading(true);
      setError(false);
      setReloadKey((key) => key + 1);
      return;
    }
    setLoading(true);
    setError(false);
    setFilters(nextFilters);
  }, [cityDraft, draft, filters]);

  const setPage = useCallback((page: number) => {
    setLoading(true);
    setError(false);
    setFilters((f) => ({ ...f, page }));
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  const clearFilters = useCallback(() => {
    setDraft('');
    setCityDraft('');
    setLoading(true);
    setError(false);
    const emptyFilters = { q: '', city: '', page: 0 };
    if (filters.q === '' && filters.city === '' && filters.page === 0) {
      setReloadKey((key) => key + 1);
      return;
    }
    setFilters(emptyFilters);
  }, [filters]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    setReloadKey((k) => k + 1);
  }, []);

  return {
    draft, setDraft, cityDraft, setCityDraft, filters, data, loading, error,
    hasFilters: Boolean(draft.trim() || cityDraft.trim() || filters.q || filters.city),
    submitSearch, setPage, clearFilters, retry,
  };
}