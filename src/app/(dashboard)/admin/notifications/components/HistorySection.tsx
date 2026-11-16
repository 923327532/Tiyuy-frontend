'use client';

import { Card } from '@/presentation/components/ui/Card';
import { HistoryFilters } from './HistoryFilters';
import { HistoryList } from './HistoryList';

interface HistorySectionProps {
  filteredNotifications: any[];
  filteredAlerts: any[];
  isLoadingHistory: boolean;
  isLoadingAdminAlerts: boolean;
  notificationHistory: { content: any[]; totalPages: number; totalElements: number } | null;
  adminAlerts: { content: any[] } | null;
  historyFilters: { page: number; size: number; typeFilter: string; searchQuery: string };
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (filter: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onShowFilterChange: (show: boolean) => void;
  showFilter: boolean;
  getDeliveryStatus: (item: any) => { label: string; color: string; dot: string };
  getChannels: (item: any) => { label: string; active: boolean }[];
  getAlertTypeIcon: (type: string) => React.ReactNode;
  getAlertTypeLabel: (type: string) => string;
  onViewDetail: (type: 'notification' | 'alert', data: any) => void;
  onDelete: (type: 'notification' | 'alert', id: number | string) => void;
  openActionMenu: number | string | null;
  setOpenActionMenu: (id: number | string | null) => void;
}

export function HistorySection({
  filteredNotifications,
  filteredAlerts,
  isLoadingHistory,
  isLoadingAdminAlerts,
  notificationHistory,
  adminAlerts,
  historyFilters,
  onSearchChange,
  onTypeFilterChange,
  onPageChange,
  onPageSizeChange,
  onShowFilterChange,
  showFilter,
  getDeliveryStatus,
  getChannels,
  getAlertTypeIcon,
  getAlertTypeLabel,
  onViewDetail,
  onDelete,
  openActionMenu,
  setOpenActionMenu,
}: HistorySectionProps) {
  return (
    <div className="space-y-6">
      {/* History Header */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Historial de Envíos</h2>
              <p className="text-sm text-gray-500 mt-1">Notificaciones y alertas enviadas</p>
            </div>
            <HistoryFilters
              searchQuery={historyFilters.searchQuery}
              onSearchChange={onSearchChange}
              typeFilter={historyFilters.typeFilter}
              onTypeFilterChange={onTypeFilterChange}
              showFilter={showFilter}
              onShowFilterChange={onShowFilterChange}
            />
          </div>
        </div>

        <HistoryList
          filteredNotifications={filteredNotifications}
          filteredAlerts={filteredAlerts}
          isLoadingHistory={isLoadingHistory}
          isLoadingAdminAlerts={isLoadingAdminAlerts}
          notificationHistory={notificationHistory}
          adminAlerts={adminAlerts}
          historyFilters={historyFilters}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          getDeliveryStatus={getDeliveryStatus}
          getChannels={getChannels}
          getAlertTypeIcon={getAlertTypeIcon}
          getAlertTypeLabel={getAlertTypeLabel}
          onViewDetail={onViewDetail}
          onDelete={onDelete}
          openActionMenu={openActionMenu}
          setOpenActionMenu={setOpenActionMenu}
        />
      </Card>
    </div>
  );
}