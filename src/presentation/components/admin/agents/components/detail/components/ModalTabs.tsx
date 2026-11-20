'use client';

import { AGENT_TABS, type AgentDetailTab } from '../ui/agentDetailParts';

interface ModalTabsProps {
  activeTab: AgentDetailTab;
  onChange: (tab: AgentDetailTab) => void;
  securityBadge: number;
}

export function ModalTabs({ activeTab, onChange, securityBadge }: ModalTabsProps) {
  return (
    <nav className="user-detail-modal__tabs-nav" aria-label="Pestañas de detalle de agente">
      <div className="user-detail-modal__tabs-list" role="tablist">
        {AGENT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badgeCount = tab.id === 'security' ? securityBadge : 0;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`user-detail-modal__tab ${isActive ? 'user-detail-modal__tab--active' : ''}`}
            >
              <span className="user-detail-modal__tab-label">{tab.label}</span>
              {badgeCount > 0 && <span className="user-detail-modal__tab-count">{badgeCount}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
