'use client';

import { Bell, AlertTriangle, History } from 'lucide-react';

interface NotificationTabsProps {
  activeTab: 'send' | 'alerts' | 'history';
  onTabChange: (tab: 'send' | 'alerts' | 'history') => void;
}

const tabs = [
  { id: 'send' as const, label: 'Notificaciones', icon: Bell },
  { id: 'alerts' as const, label: 'Alertas', icon: AlertTriangle },
  { id: 'history' as const, label: 'Historial', icon: History },
];

export function NotificationTabs({ activeTab, onTabChange }: NotificationTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] sm:min-h-[56px] w-full sm:w-auto ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50 border border-gray-200 sm:scale-[1.02]'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent'
            }`}
          >
            <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}