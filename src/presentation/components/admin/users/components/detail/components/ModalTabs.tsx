'use client';

import type { DetailTab } from '../ui/detailParts';

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Resumen' },
  { id: 'security', label: 'Seguridad' },
  { id: 'support', label: 'Soporte' },
  { id: 'history', label: 'Historial' },
];

interface ModalTabsProps {
  activeTab: DetailTab;
  onChange: (tab: DetailTab) => void;
  securityBadge: number;
  supportBadge: number;
}

export function ModalTabs({ activeTab, onChange, securityBadge, supportBadge }: ModalTabsProps) {
  return (
    <nav className="user-detail-modal__tabs-nav" aria-label="Pestañas de detalle de usuario">
      <div className="user-detail-modal__tabs-list" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badgeCount = tab.id === 'security' ? securityBadge : tab.id === 'support' ? supportBadge : 0;

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
