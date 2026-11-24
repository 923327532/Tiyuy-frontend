'use client';

import { useState } from 'react';
import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import type { CampaignModerationAction } from '../hooks/useCampaignsActions';
import {
  UsersEmptyState,
  UsersErrorState,
  UsersLoadingState,
} from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { CampaignsTable } from './table/CampaignsTable';
import { CampaignCardView } from './cards/CampaignCardView';

interface Props {
  campaigns: PromotionCampaign[];
  isLoading: boolean;
  error?: string;
  hasFilter: boolean;
  canModerate: boolean;
  selectedCampaigns: PromotionCampaign[];
  onSelectionChange: (campaigns: PromotionCampaign[]) => void;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewCampaign: (campaign: PromotionCampaign) => void;
  onAction: (campaign: PromotionCampaign, action: CampaignModerationAction) => void;
  onClearFilters: () => void;
  onRetry?: () => void;
}

export function CampaignsListPanel({
  campaigns,
  isLoading,
  error,
  hasFilter,
  canModerate,
  selectedCampaigns,
  onSelectionChange,
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  onViewCampaign,
  onAction,
  onClearFilters,
  onRetry,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const hasCampaigns = campaigns.length > 0;

  const pagination = (
    <UsersPagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalElements={totalElements}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      itemLabel="campañas"
    />
  );

  return (
    <div className="campaigns-list-panel bg-white rounded-xl shadow-lg border border-slate-100">
      {!isLoading && hasCampaigns && <UsersViewToggle value={viewMode} onChange={setViewMode} />}

      {isLoading && <UsersLoadingState message="Cargando campañas..." />}

      {Boolean(error) && <UsersErrorState error={error} onRetry={onRetry ?? onClearFilters} />}

      {!isLoading && !error && !hasCampaigns && (
        <UsersEmptyState
          onClear={onClearFilters}
          title="No se encontraron campañas"
          description={
            hasFilter
              ? 'Intenta ajustar tu búsqueda o los filtros aplicados.'
              : 'Aún no hay campañas registradas.'
          }
        />
      )}

      {!isLoading && !error && hasCampaigns && (
        <>
          {viewMode === 'table' ? (
            <CampaignsTable
              campaigns={campaigns}
              isLoading={isLoading}
              selectedCampaigns={selectedCampaigns}
              onSelectionChange={onSelectionChange}
              onViewCampaign={onViewCampaign}
              onAction={onAction}
              canModerate={canModerate}
            />
          ) : (
            <CampaignCardView
              campaigns={campaigns}
              canModerate={canModerate}
              onViewCampaign={onViewCampaign}
              onAction={onAction}
            />
          )}
          {pagination}
        </>
      )}
    </div>
  );
}
