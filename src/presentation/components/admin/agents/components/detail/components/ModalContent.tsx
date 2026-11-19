'use client';

import {
  OverviewTab,
  SecurityTab,
  PlanTab,
  HistoryTab,
  type AgentDetailTab,
  type AgentTabProps,
} from '../tabs';

interface ModalContentProps {
  activeTab: AgentDetailTab;
  tabProps: AgentTabProps;
}

export function ModalContent({ activeTab, tabProps }: ModalContentProps) {
  return (
    <div className="user-detail-modal__content" role="tabpanel">
      <div className="user-detail-modal__tabs-content">
        {activeTab === 'overview' && <OverviewTab {...tabProps} />}
        {activeTab === 'security' && <SecurityTab {...tabProps} />}
        {activeTab === 'plan' && <PlanTab {...tabProps} />}
        {activeTab === 'history' && <HistoryTab {...tabProps} />}
      </div>
    </div>
  );
}
