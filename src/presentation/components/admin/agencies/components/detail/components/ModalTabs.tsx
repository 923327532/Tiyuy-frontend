'use client';

type DetailTab = 'overview' | 'agents' | 'discounts' | 'history';

interface ModalTabsProps {
  activeTab: DetailTab;
  onChange: (tab: DetailTab) => void;
  agentsCount?: number;
  discountsCount?: number;
  historyCount?: number;
}

export function ModalTabs({
  activeTab,
  onChange,
  agentsCount = 0,
  discountsCount = 0,
  historyCount = 0,
}: ModalTabsProps) {
  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Resumen' },
    { id: 'agents', label: 'Agentes', count: agentsCount },
    { id: 'discounts', label: 'Descuentos', count: discountsCount },
    { id: 'history', label: 'Historial', count: historyCount },
  ];

  return (
    <nav className="user-detail-modal__tabs-nav" aria-label="Pestañas de detalle de inmobiliaria">
      <div className="user-detail-modal__tabs-list" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const badgeCount = tab.count ?? 0;

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
