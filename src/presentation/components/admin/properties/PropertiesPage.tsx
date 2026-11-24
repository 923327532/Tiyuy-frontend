'use client';

import { useMemo } from 'react';

import { getPropertyColumns } from './config/properties.columns';
import { PropertiesHeader } from './components/PropertiesHeader';
import { PropertiesListPanel } from './components/PropertiesListPanel';
import { PropertiesModals } from './components/PropertiesModals';
import { PropertiesStats } from './components/PropertiesStats';
import { useProperties } from './hooks/useProperties';

export function PropertiesPage() {
  const p = useProperties();
  const columns = useMemo(() => getPropertyColumns(), []);

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <PropertiesHeader />

      <PropertiesStats kpis={p.kpis} />

      <PropertiesListPanel
        properties={p.properties}
        totalElements={p.totalElements}
        isLoading={p.isLoading}
        error={p.error}
        filters={p.filters}
        setFilters={p.setFilters}
        currentPage={p.currentPage}
        setCurrentPage={p.setCurrentPage}
        pageSize={p.pageSize}
        setPageSize={p.setPageSize}
        viewMode={p.viewMode}
        setViewMode={p.setViewMode}
        selectedProperties={p.selectedProperties}
        setSelectedProperties={p.setSelectedProperties}
        columns={columns}
        canModerate={p.canModerate}
        canFeature={p.canFeature}
        onViewDetail={p.openDetail}
        onModerate={p.openModerate}
        onToggleFeatured={p.toggleFeatured}
        onDisable={p.openDisable}
        onEnable={p.enableProperty}
        onClearFilters={p.clearFilters}
        onRetry={p.refetch}
      />

      <PropertiesModals
        selected={p.selected}
        modal={p.modal}
        moderationAction={p.moderationAction}
        canModerate={p.canModerate}
        isModerating={p.isModerating}
        isDisabling={p.isDisabling}
        isEnabling={p.isEnabling}
        isNotifying={p.isNotifying}
        onClose={p.closeModal}
        onOpenModeration={p.openModerate}
        onOpenDisable={p.openDisable}
        onOpenNotify={p.openNotify}
        onEnable={p.enableProperty}
        onConfirmModeration={p.confirmModeration}
        onConfirmDisable={p.disableProperty}
        onConfirmNotify={p.notifyOwner}
      />
    </div>
  );
}
