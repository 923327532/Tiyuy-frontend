'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { showToast } from '@/presentation/components/ui/Toast/Toast';

export interface NotificationFormData {
  subject: string;
  message: string;
  userIds: number[];
  roles: string[];
  agencyIds: string[];
  sendToAll: boolean;
  sendEmail: boolean;
  sendInApp: boolean;
}

export interface AlertFormData {
  subject: string;
  message: string;
  alertType: 'EMERGENCY' | 'SYSTEM' | 'ANNOUNCEMENT' | 'MARKETING' | 'SECURITY';
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED';
  userIds: number[];
  roles: string[];
  sendToAll: boolean;
  sendEmail: boolean;
  sendInApp: boolean;
  sendPush: boolean;
  scheduledFor?: string;
}

export interface HistoryFilters {
  page: number;
  size: number;
  typeFilter: string;
  searchQuery: string;
}

export interface UseNotificationsReturn {
  // Form state
  newNotification: NotificationFormData;
  setNewNotification: React.Dispatch<React.SetStateAction<NotificationFormData>>;
  newAlert: AlertFormData;
  setNewAlert: React.Dispatch<React.SetStateAction<AlertFormData>>;

  // History filters
  historyFilters: HistoryFilters;
  setHistoryFilters: React.Dispatch<React.SetStateAction<HistoryFilters>>;

  // UI state
  activeTab: 'send' | 'alerts' | 'history';
  setActiveTab: React.Dispatch<React.SetStateAction<'send' | 'alerts' | 'history'>>;
  openActionMenu: number | null;
  setOpenActionMenu: React.Dispatch<React.SetStateAction<number | null>>;
  showHistoryFilter: boolean;
  setShowHistoryFilter: React.Dispatch<React.SetStateAction<boolean>>;
  detailItem: { type: 'notification' | 'alert'; data: any } | null;
  setDetailItem: React.Dispatch<React.SetStateAction<{ type: 'notification' | 'alert'; data: any } | null>>;

  // Handlers
  handleSendNotification: (sendNotification: any, queryClient: ReturnType<typeof useQueryClient>) => void;
  toggleUserSelection: (userId: number) => void;
  toggleRoleSelection: (role: string) => void;
  toggleAgencySelection: (agencyRuc: string) => void;
  getNotificationIcon: (type: string) => React.ReactNode;
  getAlertTypeIcon: (type: string) => React.ReactNode;
  getAlertTypeLabel: (type: string) => string;
  getDeliveryStatus: (item: any) => { label: string; color: string; dot: string };
  getChannels: (item: any) => { label: string; active: boolean }[];
}

export function useNotifications(): UseNotificationsReturn {
  const queryClient = useQueryClient();

  // Form state
  const [newNotification, setNewNotification] = useState<NotificationFormData>({
    subject: '',
    message: '',
    userIds: [],
    roles: [],
    agencyIds: [],
    sendToAll: false,
    sendEmail: true,
    sendInApp: true,
  });

  const [newAlert, setNewAlert] = useState<AlertFormData>({
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

  // History filters
  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>({
    page: 0,
    size: 10,
    typeFilter: '',
    searchQuery: '',
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'send' | 'alerts' | 'history'>('send');
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  const [showHistoryFilter, setShowHistoryFilter] = useState(false);
  const [detailItem, setDetailItem] = useState<{ type: 'notification' | 'alert'; data: any } | null>(null);

  // Handlers
  const handleSendNotification = useCallback((sendNotification: any) => {
    if (!newNotification.subject || !newNotification.message) {
      return;
    }

    const hasTargets = newNotification.sendToAll ||
      newNotification.userIds.length > 0 ||
      newNotification.roles.length > 0 ||
      newNotification.agencyIds.length > 0;

    if (!hasTargets) {
      alert('Selecciona al menos un destinatario: todos los usuarios, roles específicos, usuarios específicos, inmobiliarias o agentes');
      return;
    }

    sendNotification.mutate(newNotification, {
      onSuccess: () => {
        showToast('success', 'Notificación enviada exitosamente', 'La notificación se ha enviado a los destinatarios seleccionados');
        setNewNotification({
          subject: '',
          message: '',
          userIds: [],
          roles: [],
          agencyIds: [],
          sendToAll: false,
          sendEmail: true,
          sendInApp: true,
        });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
      onError: (error: any) => {
        showToast('error', 'Error al enviar notificación', error?.message || 'Ocurrió un error al enviar la notificación');
      },
    });
  }, [newNotification, queryClient]);

  const toggleUserSelection = useCallback((userId: number) => {
    setNewNotification(prev => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId]
    }));
  }, []);

  const toggleRoleSelection = useCallback((role: string) => {
    setNewNotification(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  }, []);

  const toggleAgencySelection = useCallback((agencyRuc: string) => {
    setNewNotification(prev => ({
      ...prev,
      agencyIds: prev.agencyIds.includes(agencyRuc)
        ? prev.agencyIds.filter(r => r !== agencyRuc)
        : [...prev.agencyIds, agencyRuc]
    }));
  }, []);

  const getNotificationIcon = useCallback((type: string) => {
    // Icons will be imported in the component
    switch (type) {
      case 'alert': return 'alert';
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  }, []);

  const getAlertTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'emergency';
      case 'SYSTEM': return 'system';
      case 'ANNOUNCEMENT': return 'announcement';
      case 'MARKETING': return 'marketing';
      case 'SECURITY': return 'security';
      default: return 'default';
    }
  }, []);

  const getAlertTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'Emergencia';
      case 'SYSTEM': return 'Sistema';
      case 'ANNOUNCEMENT': return 'Anuncio';
      case 'MARKETING': return 'Marketing';
      case 'SECURITY': return 'Seguridad';
      default: return type;
    }
  }, []);

  const getDeliveryStatus = useCallback((item: any) => {
    if (item.status === 'SENT' || item.status === 'completed') return { label: 'Entregado', color: 'text-green-600 bg-green-50 border-green-200', dot: 'bg-green-500' };
    if (item.status === 'FAILED' || item.status === 'error') return { label: 'Error', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' };
    if (item.status === 'PARTIAL') return { label: 'Parcial', color: 'text-orange-600 bg-orange-50 border-orange-200', dot: 'bg-orange-500' };
    if (item.status === 'SCHEDULED') return { label: 'Programado', color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500' };
    if (item.status === 'DRAFT') return { label: 'Borrador', color: 'text-gray-600 bg-gray-50 border-gray-200', dot: 'bg-gray-500' };
    return { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' };
  }, []);

  const getChannels = useCallback((item: any) => {
    const channels: { label: string; active: boolean }[] = [];
    if (item.sendEmail) channels.push({ label: 'Email', active: true });
    if (item.sendInApp) channels.push({ label: 'Web', active: true });
    if (item.sendPush) channels.push({ label: 'Push', active: true });
    return channels;
  }, []);

  return {
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
    getNotificationIcon,
    getAlertTypeIcon,
    getAlertTypeLabel,
    getDeliveryStatus,
    getChannels,
  };
}