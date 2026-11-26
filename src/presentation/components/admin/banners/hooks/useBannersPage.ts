'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Banner } from '@/core/domain/entities/Admin';
import {
  useBanners,
  useCreateBannerWithUpload,
  useDeleteBanner,
  useMarketingStats,
  useToggleBanner,
  useUpdateBannerWithUpload,
  type BannerUploadPayload,
} from '@/presentation/hooks/useAdmin';
import { useCreateActionParam } from '@/presentation/hooks/useCreateActionParam';
import {
  BANNER_STATUS_FILTERS,
  PLACEMENT_OPTIONS,
  type BannerStatusFilter,
} from '../config/banners.config';
import { exportBannersExcel } from '../utils/bannersExport';
import { getBannerStatus } from '../utils/bannerFormat';

const statusLabel = (status: BannerStatusFilter) =>
  BANNER_STATUS_FILTERS.find((option) => option.value === status)?.label ?? status;

const placementLabel = (placement: string) =>
  placement === 'all'
    ? 'Todas las ubicaciones'
    : (PLACEMENT_OPTIONS.find((option) => option.value === placement)?.label ?? placement);

export function useBannersPage() {
  const [searchQuery, setSearchQueryState] = useState('');
  const [placementFilter, setPlacementFilterState] = useState('all');
  const [statusFilter, setStatusFilterState] = useState<BannerStatusFilter>('all');
  const [currentPage, setCurrentPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useCreateActionParam(() => setIsCreateOpen(true));

  const bannersQuery = useBanners();
  const statsQuery = useMarketingStats();
  const createMutation = useCreateBannerWithUpload();
  const updateMutation = useUpdateBannerWithUpload();
  const toggleMutation = useToggleBanner();
  const deleteMutation = useDeleteBanner();

  const banners = useMemo(
    () => (Array.isArray(bannersQuery.data) ? bannersQuery.data : []),
    [bannersQuery.data]
  );

  const filteredBanners = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return banners.filter((banner) => {
      const matchesKeyword =
        !keyword ||
        banner.title.toLowerCase().includes(keyword) ||
        (banner.description ?? '').toLowerCase().includes(keyword);
      const matchesPlacement = placementFilter === 'all' || banner.placement === placementFilter;
      const matchesStatus = statusFilter === 'all' || getBannerStatus(banner) === statusFilter;
      return matchesKeyword && matchesPlacement && matchesStatus;
    });
  }, [banners, searchQuery, placementFilter, statusFilter]);

  const hasFilter =
    searchQuery.trim().length > 0 || placementFilter !== 'all' || statusFilter !== 'all';

  const totalElements = filteredBanners.length;

  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBanners.slice(start, start + pageSize);
  }, [currentPage, filteredBanners, pageSize]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(totalElements / pageSize));
    if (currentPage > maxPage) setCurrentPageState(maxPage);
  }, [currentPage, pageSize, totalElements]);

  const resetPage = () => setCurrentPageState(1);

  const setSearchQuery = (value: string) => {
    setSearchQueryState(value);
    resetPage();
  };

  const setPlacementFilter = (value: string) => {
    setPlacementFilterState(value);
    resetPage();
  };

  const setStatusFilter = (value: BannerStatusFilter) => {
    setStatusFilterState(value);
    resetPage();
  };

  const setCurrentPage = (page: number) => setCurrentPageState(Math.max(1, page));

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    resetPage();
  };

  const handleClearFilters = () => {
    setSearchQueryState('');
    setPlacementFilterState('all');
    setStatusFilterState('all');
    resetPage();
  };

  const handleExport = () => {
    exportBannersExcel(filteredBanners, {
      Busqueda: searchQuery.trim() || undefined,
      Estado: statusFilter === 'all' ? undefined : statusLabel(statusFilter),
      Ubicacion: placementFilter === 'all' ? undefined : placementLabel(placementFilter),
    });
  };

  const runWithBusy = async (id: number, action: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await action();
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (payload: BannerUploadPayload) => {
    await createMutation.mutateAsync({ ...payload, image: payload.image as File });
    setIsCreateOpen(false);
  };

  const handleUpdate = async (payload: BannerUploadPayload) => {
    if (!editingBanner) return;
    await updateMutation.mutateAsync({ id: editingBanner.id, ...payload });
    setEditingBanner(null);
  };

  const handleToggle = (banner: Banner) =>
    void runWithBusy(banner.id, () => toggleMutation.mutateAsync(banner.id)).catch(() => {
      // El hook ya muestra el toast de error.
    });

  const handleDelete = (banner: Banner) => {
    if (!window.confirm(`¿Eliminar el banner "${banner.title}"? Esta acción no se puede deshacer.`)) return;
    void runWithBusy(banner.id, () => deleteMutation.mutateAsync(banner.id)).catch(() => {
      // El hook ya muestra el toast de error.
    });
  };

  const handleRefresh = () => {
    void bannersQuery.refetch();
    void statsQuery.refetch();
  };

  const isRefreshing = bannersQuery.isFetching || statsQuery.isFetching;

  return {
    banners,
    filteredBanners,
    paginatedBanners,
    stats: statsQuery.data,
    isLoading: bannersQuery.isLoading,
    isError: bannersQuery.isError,
    error: bannersQuery.error,
    refetch: handleRefresh,
    isRefreshing,
    searchQuery,
    setSearchQuery,
    placementFilter,
    setPlacementFilter,
    statusFilter,
    setStatusFilter,
    hasFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalElements,
    handleClearFilters,
    handleExport,
    isCreateOpen,
    setIsCreateOpen,
    editingBanner,
    setEditingBanner,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    busyId,
    handleCreate,
    handleUpdate,
    handleToggle,
    handleDelete,
  };
}
