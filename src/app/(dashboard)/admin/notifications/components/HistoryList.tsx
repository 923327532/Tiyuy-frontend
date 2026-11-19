'use client';

import { Spinner } from '@/presentation/components/ui/Spinner';
import { History } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { AlertItem } from './AlertItem';
import { HistoryPagination } from './HistoryPagination';

interface HistoryListProps {
  filteredNotifications: any[];
  filteredAlerts: any[];
  isLoadingHistory: boolean;
  isLoadingAdminAlerts: boolean;
  notificationHistory: { content: any[]; totalPages: number; totalElements: number } | null;
  adminAlerts: { content: any[] } | null;
  historyFilters: { page: number; size: number };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  getDeliveryStatus: (item: any) => { label: string; color: string; dot: string };
  getChannels: (item: any) => { label: string; active: boolean }[];
  getAlertTypeIcon: (type: string) => React.ReactNode;
  getAlertTypeLabel: (type: string) => string;
  onViewDetail: (type: 'notification' | 'alert', data: any) => void;
  onDelete: (type: 'notification' | 'alert', id: number | string) => void;
  openActionMenu: number | string | null;
  setOpenActionMenu: (id: number | string | null) => void;
}

export function HistoryList({
  filteredNotifications,
  filteredAlerts,
  isLoadingHistory,
  isLoadingAdminAlerts,
  notificationHistory,
  adminAlerts,
  historyFilters,
  onPageChange,
  onPageSizeChange,
  getDeliveryStatus,
  getChannels,
  getAlertTypeIcon,
  getAlertTypeLabel,
  onViewDetail,
  onDelete,
  openActionMenu,
  setOpenActionMenu,
}: HistoryListProps) {
  const hasData = filteredNotifications.length > 0 || filteredAlerts.length > 0;

  if (isLoadingHistory || isLoadingAdminAlerts) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <History className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
        <p className="text-gray-500">No se encontraron notificaciones o alertas en el historial</p>
      </div>
    );
  }

  const handleToggleMenu = (id: number | string) => {
    setOpenActionMenu(openActionMenu === id ? null : id);
  };

  return (
    <div className="divide-y divide-gray-100">
      {/* Notifications */}
      {filteredNotifications.map((notification: any) => {
        const status = getDeliveryStatus(notification);
        const channels = getChannels(notification);
        return (
          <NotificationItem
            key={`notif-${notification.id}`}
            notification={notification}
            status={status}
            channels={channels}
            onActionMenu={handleToggleMenu}
            onViewDetail={onViewDetail}
            onDelete={(id) => onDelete('notification', id)}
            openActionMenu={openActionMenu}
            setOpenActionMenu={setOpenActionMenu}
          />
        );
      })}

      {/* Alerts */}
      {filteredAlerts.map((alert: any) => {
        const status = getDeliveryStatus(alert);
        const channels = getChannels(alert);
        return (
          <AlertItem
            key={`alert-${alert.id}`}
            alert={alert}
            status={status}
            channels={channels}
            getAlertTypeIcon={getAlertTypeIcon}
            getAlertTypeLabel={getAlertTypeLabel}
            onActionMenu={handleToggleMenu}
            onViewDetail={onViewDetail}
            onDelete={(id) => onDelete('alert', id)}
            openActionMenu={openActionMenu}
            setOpenActionMenu={setOpenActionMenu}
          />
        );
      })}

      {/* History Pagination */}
      {notificationHistory && notificationHistory.totalPages > 1 && (
        <HistoryPagination
          totalPages={notificationHistory.totalPages}
          currentPage={historyFilters.page}
          totalElements={notificationHistory.totalElements}
          pageSize={historyFilters.size}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}