'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useUserSearch } from '@/presentation/hooks/useUserSearch';
import {
  useSendNotification,
  useNotificationHistory,
  useNotificationTypes,
  useAdminAlertStats,
  useCreateAdminAlert,
  useAdminAlerts,
  useSendAdminAlertNow,
  useDeleteAdminAlert,
  useDeleteNotificationHistory,
} from '@/presentation/hooks/useAnalytics';
import { ToastContainer, showToast } from '@/presentation/components/ui/Toast/Toast';
import { KpiStats } from './components/KpiStats';
import { NotificationTabs } from './components/NotificationTabs';
import { SendNotificationForm } from './components/SendNotificationForm';
import { CreateAlertForm } from './components/CreateAlertForm';
import { HistorySection } from './components/HistorySection';
import { DetailModal } from './components/DetailModal';
import { useNotifications } from './hooks/useNotifications';
import { useFilteredHistory } from './hooks/useFilteredHistory';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Megaphone,
  TrendingUp,
  Shield,
  Bell,
} from 'lucide-react';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const sendNotification = useSendNotification();
  const { isSuperAdmin, isRegularAdmin } = usePermissions();

  // Server-side search hooks for users and agents
  const userSearch = useUserSearch(300);
  const agentSearch = useUserSearch(300);

  // Admin Alerts pagination state
  const [alertsPage, setAlertsPage] = useState(0);
  const [alertsSize, setAlertsSize] = useState(10);

  // Notification hooks
  const { data: notificationHistory, isLoading: isLoadingHistory } = useNotificationHistory(30, '', 0, 1000);
  const { data: notificationHistoryAll } = useNotificationHistory(30, '', 0, 1000);
  useNotificationTypes();
  useAdminAlertStats();

  // Admin Alerts hooks with pagination
  const { data: adminAlerts, isLoading: isLoadingAdminAlerts } = useAdminAlerts({ page: alertsPage, size: alertsSize });
  const createAdminAlert = useCreateAdminAlert();
  useSendAdminAlertNow();
  const deleteAdminAlert = useDeleteAdminAlert();

  // Notification history delete hook
  const deleteNotificationHistory = useDeleteNotificationHistory();

  // Custom hooks
  const {
    newNotification,
    setNewNotification,
    newAlert,
    setNewAlert,
    historyFilters,
    setHistoryFilters,
    activeTab,
    setActiveTab,
    openActionMenu,
    setOpenActionMenu,
    showHistoryFilter,
    setShowHistoryFilter,
    detailItem,
    setDetailItem,
    handleSendNotification,
    toggleUserSelection,
    toggleRoleSelection,
    toggleAgencySelection,
    getAlertTypeLabel,
    getDeliveryStatus,
    getChannels,
  } = useNotifications();

  const { filteredNotifications, filteredAlerts } = useFilteredHistory(
    notificationHistory,
    adminAlerts,
    historyFilters
  );

  // Helper for alert type icon
  const getAlertTypeIconComponent = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return <AlertTriangle className="w-5 h-5" />;
      case 'SYSTEM': return <Settings className="w-5 h-5" />;
      case 'ANNOUNCEMENT': return <Megaphone className="w-5 h-5" />;
      case 'MARKETING': return <TrendingUp className="w-5 h-5" />;
      case 'SECURITY': return <Shield className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  // Handler for sending alert
  const handleSendAlert = () => {
    if (!newAlert.subject || !newAlert.message) {
      alert('Completa el asunto y mensaje');
      return;
    }
    const payload = {
      ...newAlert,
      alertType: (newAlert.alertType === 'SECURITY' ? 'SYSTEM' : newAlert.alertType) as any,
    };
    createAdminAlert.mutate(payload, {
      onSuccess: () => {
        showToast('success', 'Alerta enviada exitosamente', 'La alerta se ha enviado a los destinatarios seleccionados');
        setNewAlert({
          subject: '',
          message: '',
          alertType: 'EMERGENCY',
          status: 'SENDING',
          userIds: [],
          roles: [],
          sendToAll: true,
          sendEmail: true,
          sendInApp: true,
          sendPush: false,
          scheduledFor: undefined,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-alerts'] });
      },
      onError: (error: any) => {
        showToast('error', 'Error al enviar alerta', error?.message || 'Ocurrió un error al enviar la alerta');
      },
    });
  };

  // Handler for viewing detail
  const handleViewDetail = (type: 'notification' | 'alert', data: any) => {
    setDetailItem({ type, data });
  };

  // Handler for delete
  const handleDelete = (type: 'notification' | 'alert', id: number | string) => {
    if (type === 'alert') {
      deleteAdminAlert.mutate(Number(id));
    } else {
      deleteNotificationHistory.mutate(Number(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <ToastContainer />

      {/* KPI Cards - Siempre visibles */}
      <KpiStats
        notificationHistoryAll={notificationHistoryAll ?? null}
        adminAlerts={adminAlerts ?? null}
      />

      {/* Tabs - Responsive */}
      <NotificationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Send Notification Section */}
      {activeTab === 'send' && (
        <SendNotificationForm
          newNotification={newNotification}
          setNewNotification={setNewNotification}
          sendNotification={sendNotification}
          userSearch={userSearch}
          agentSearch={agentSearch}
          onSend={() => handleSendNotification(sendNotification, queryClient)}
          toggleUserSelection={toggleUserSelection}
          toggleRoleSelection={toggleRoleSelection}
          toggleAgencySelection={toggleAgencySelection}
        />
      )}

      {/* Alerts Section */}
      {activeTab === 'alerts' && (
        <CreateAlertForm
          newAlert={newAlert}
          setNewAlert={setNewAlert}
          createAdminAlert={createAdminAlert}
          onSend={handleSendAlert}
        />
      )}

      {/* History Section - Independent */}
      {activeTab === 'history' && (
        <HistorySection
          filteredNotifications={filteredNotifications}
          filteredAlerts={filteredAlerts}
          isLoadingHistory={isLoadingHistory}
          isLoadingAdminAlerts={isLoadingAdminAlerts}
          notificationHistory={notificationHistory ?? null}
          adminAlerts={adminAlerts ?? null}
          historyFilters={historyFilters}
          onSearchChange={(query) => setHistoryFilters(prev => ({ ...prev, searchQuery: query, page: 0 }))}
          onTypeFilterChange={(filter) => setHistoryFilters(prev => ({ ...prev, typeFilter: filter, page: 0 }))}
          onPageChange={(page) => setHistoryFilters(prev => ({ ...prev, page }))}
          onPageSizeChange={(size) => setHistoryFilters(prev => ({ ...prev, size, page: 0 }))}
          onShowFilterChange={setShowHistoryFilter}
          showFilter={showHistoryFilter}
          getDeliveryStatus={getDeliveryStatus}
          getChannels={getChannels}
          getAlertTypeIcon={getAlertTypeIconComponent}
          getAlertTypeLabel={getAlertTypeLabel}
          onViewDetail={handleViewDetail}
          onDelete={handleDelete}
          openActionMenu={openActionMenu}
          setOpenActionMenu={(id) => setOpenActionMenu(id === null ? null : Number(id))}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        detailItem={detailItem}
        onClose={() => setDetailItem(null)}
        onDelete={handleDelete}
        getDeliveryStatus={getDeliveryStatus}
        getChannels={getChannels}
        getAlertTypeLabel={getAlertTypeLabel}
      />
    </div>
  );
}