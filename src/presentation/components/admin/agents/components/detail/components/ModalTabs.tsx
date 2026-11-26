'use client';

import { CreditCard, History, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { AGENT_TABS, type AgentDetailTab } from '../ui/agentDetailParts';

interface ModalTabsProps {
  activeTab: AgentDetailTab;
  onChange: (tab: AgentDetailTab) => void;
  securityBadge: number;
}

const TAB_ICONS: Record<AgentDetailTab, React.ReactNode> = {
  overview: <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />,
  security: <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />,
  plan: <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />,
  history: <History className="h-3.5 w-3.5" aria-hidden="true" />,
};

export function ModalTabs({ activeTab, onChange, securityBadge }: ModalTabsProps) {
  return (
    <nav
      className="shrink-0 border-b border-slate-200 bg-white px-5 py-2.5"
      aria-label="Pestañas de detalle de agente"
    >
      <div className="flex gap-1.5 overflow-x-auto" role="tablist">
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
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#0f2e3a] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2e3a]'
              }`}
            >
              {TAB_ICONS[tab.id]}
              <span>{tab.label}</span>
              {badgeCount > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}