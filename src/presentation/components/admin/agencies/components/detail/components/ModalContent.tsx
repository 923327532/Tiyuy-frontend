'use client';

import type { DetailTabProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import { OverviewTab } from '../tabs/OverviewTab';
import { AgentsTab } from '../tabs/AgentsTab';
import { DiscountsTab } from '../tabs/DiscountsTab';
import { HistoryTab } from '../tabs/HistoryTab';

interface ModalContentProps {
  activeTab: 'overview' | 'agents' | 'discounts' | 'history';
  isLoading: boolean;
  hasExtras: boolean;
  tabProps: DetailTabProps;
}

export function ModalContent({ activeTab, isLoading, hasExtras, tabProps }: ModalContentProps) {
  const renderTab = () => {
    switch (activeTab) {
      case 'agents':
        return <AgentsTab {...tabProps} />;
      case 'discounts':
        return <DiscountsTab {...tabProps} />;
      case 'history':
        return <HistoryTab {...tabProps} />;
      case 'overview':
      default:
        return <OverviewTab {...tabProps} />;
    }
  };

  return (
    <div className="user-detail-modal__content" role="tabpanel">
      {isLoading && !hasExtras ? (
        <div className="user-detail-modal__loading">
          <div className="user-detail-modal__spinner" aria-hidden="true" />
          <span>Cargando detalles de la inmobiliaria...</span>
        </div>
      ) : (
        <div className="user-detail-modal__tabs-content">{renderTab()}</div>
      )}
    </div>
  );
}
