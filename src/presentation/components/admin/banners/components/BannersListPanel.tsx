'use client';

import { useState } from 'react';
import type { Banner } from '@/core/domain/entities/Admin';
import {
  UsersEmptyState,
  UsersErrorState,
  UsersLoadingState,
} from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { BannerCardView } from './BannerCardView';
import { BannersTable } from './BannersTable';

interface Props {
  banners: Banner[];
  isLoading: boolean;
  error?: unknown;
  hasFilter: boolean;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (banner: Banner) => void;
  onToggle: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onClearFilters: () => void;
  onRetry?: () => void;
  busyId?: number | null;
}

export function BannersListPanel({
  banners,
  isLoading,
  error,
  hasFilter,
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onToggle,
  onDelete,
  onClearFilters,
  onRetry,
  busyId,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const hasBanners = banners.length > 0;
  const errorMessage = error instanceof Error ? error.message : undefined;

  const pagination = (
    <UsersPagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalElements={totalElements}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      itemLabel="banners"
    />
  );

  return (
    <div className="campaigns-list-panel bg-white rounded-xl shadow-lg border border-slate-100">
      {!isLoading && hasBanners && !errorMessage && (
        <UsersViewToggle value={viewMode} onChange={setViewMode} />
      )}

      {isLoading && <UsersLoadingState message="Cargando banners..." />}

      {Boolean(errorMessage) && (
        <UsersErrorState error={error} onRetry={onRetry ?? onClearFilters} />
      )}

      {!isLoading && !errorMessage && !hasBanners && (
        <UsersEmptyState
          onClear={onClearFilters}
          title="No se encontraron banners"
          description={
            hasFilter
              ? 'Intenta ajustar tu búsqueda o los filtros aplicados.'
              : 'Aún no hay banners registrados.'
          }
        />
      )}

      {!isLoading && !errorMessage && hasBanners && (
        <>
          {viewMode === 'table' ? (
            <BannersTable
              banners={banners}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
              busyId={busyId}
            />
          ) : (
            <BannerCardView
              banners={banners}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
              busyId={busyId}
            />
          )}
          {pagination}
        </>
      )}
    </div>
  );
}
