'use client';

import UniversalDiscountApplier from '@/app/(dashboard)/admin/discounts/components/UniversalDiscountApplier';
import { RecentActivitySection } from './components/activity/RecentActivitySection';
import { DiscountsHeader } from './components/header/DiscountsHeader';
import { DiscountStatusSection } from './components/status/DiscountStatusSection';
import { DiscountsListPanel } from './components/DiscountsListPanel';
import { DiscountsStats } from './components/stats/DiscountsStats';
import type { DiscountTab } from './config/discounts.config';
import { useDiscountsPage } from './hooks/useDiscountsPage';
import './styles/discounts.css';

const scrollToList = () => {
  document.getElementById('discounts-list')?.scrollIntoView({ behavior: 'smooth' });
};

export function DiscountsPageView() {
  const p = useDiscountsPage();

  const handleTabChange = (tab: DiscountTab) => {
    p.setActiveTab(tab);
    if (tab === 'central') window.setTimeout(scrollToList, 0);
  };

  return (
    <div className="discounts-module admin-page space-y-4 sm:space-y-6">
      <DiscountsHeader activeTab={p.activeTab} onTabChange={handleTabChange} />

      <DiscountsStats summary={p.summary} loading={p.summaryLoading} />

      {p.activeTab === 'applier' ? (
        <div className="space-y-4 sm:space-y-6">
          <UniversalDiscountApplier
            onDiscountApplied={() => {
              void p.refetch();
            }}
          />
          <DiscountStatusSection />
          <RecentActivitySection />
        </div>
      ) : (
        <div id="discounts-list">
          <DiscountsListPanel
            discounts={p.discounts}
            totalElements={p.totalElements}
            isLoading={p.isLoading}
            error={p.error}
            filters={p.filters}
            hasFilter={p.hasFilter}
            onSearchChange={p.setSearchQuery}
            onFilterChange={p.setFilter}
            onClearFilters={p.handleClearFilters}
            currentPage={p.currentPage}
            setCurrentPage={p.setCurrentPage}
            pageSize={p.pageSize}
            onPageSizeChange={p.handlePageSizeChange}
            onRetry={() => void p.refetch()}
          />
        </div>
      )}
    </div>
  );
}
