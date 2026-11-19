'use client';

import {
  OverviewTab,
  SecurityTab,
  SupportTab,
  HistoryTab,
  type DetailTab,
} from '../tabs';

interface ModalContentProps {
  activeTab: DetailTab;
  isLoading: boolean;
  hasExtras: boolean;
  tabProps: any;
}

export function ModalContent({ activeTab, isLoading, hasExtras, tabProps }: ModalContentProps) {
  return (
    <div className="user-detail-modal__content" role="tabpanel">
      {isLoading && !hasExtras ? (
        <div className="user-detail-modal__loading">
          <div className="user-detail-modal__spinner" aria-hidden="true" />
          <span>Cargando detalles del usuario...</span>
        </div>
      ) : (
        <div className="user-detail-modal__tabs-content">
          {activeTab === 'overview' && <OverviewTab {...tabProps} />}
          {activeTab === 'security' && <SecurityTab {...tabProps} />}
          {activeTab === 'support' && <SupportTab {...tabProps} />}
          {activeTab === 'history' && <HistoryTab {...tabProps} />}
        </div>
      )}
    </div>
  );
}
