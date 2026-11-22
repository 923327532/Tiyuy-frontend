/**
 * Acciones de notificación a inmobiliarias.
 */

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type { useNotifyDeveloper } from '@/presentation/hooks/admin/useDevelopers';
import type { NotificationDataState } from './useAgencies.types';

export interface AgenciesNotifyActionsInput {
  selectedAgency: InmobiliariaWithStats | null;
  notifyAgency: InmobiliariaWithStats | null;
  setSelectedAgency: Dispatch<SetStateAction<InmobiliariaWithStats | null>>;
  setHistoryPage: Dispatch<SetStateAction<number>>;
  setIsNotifyModalOpen: Dispatch<SetStateAction<boolean>>;
  setNotifyAgency: Dispatch<SetStateAction<InmobiliariaWithStats | null>>;
  notificationData: NotificationDataState;
  setNotificationData: Dispatch<SetStateAction<NotificationDataState>>;
  notifyDeveloperMutation: ReturnType<typeof useNotifyDeveloper>;
}

export function useAgenciesNotifyActions({
  selectedAgency,
  notifyAgency,
  setSelectedAgency,
  setHistoryPage,
  setIsNotifyModalOpen,
  setNotifyAgency,
  notificationData,
  setNotificationData,
  notifyDeveloperMutation,
}: AgenciesNotifyActionsInput) {
  const handleNotify = useCallback(() => {
    if (!selectedAgency) return;
    setNotifyAgency(selectedAgency);
    // Cerramos el detalle para que el modal de notificación no se abra encima de él.
    setSelectedAgency(null);
    setHistoryPage(0);
    setIsNotifyModalOpen(true);
  }, [selectedAgency, setNotifyAgency, setSelectedAgency, setHistoryPage, setIsNotifyModalOpen]);

  const handleNotifyAgency = useCallback((agency: InmobiliariaWithStats) => {
    // No tocamos `selectedAgency`: eso abriría el modal de detalle además del de notificación.
    setNotifyAgency(agency);
    setIsNotifyModalOpen(true);
  }, [setNotifyAgency, setIsNotifyModalOpen]);

  const handleNotifySubmit = useCallback(async () => {
    if (!notifyAgency) return;
    try {
      await notifyDeveloperMutation.mutateAsync({
        developerId: notifyAgency.id,
        data: {
          subject: notificationData.subject,
          message: notificationData.message,
          sendEmail: notificationData.sendEmail,
          sendInApp: notificationData.sendInApp,
        },
      });
      setIsNotifyModalOpen(false);
      setNotifyAgency(null);
      setNotificationData({ subject: '', message: '', sendEmail: true, sendInApp: true });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [notifyAgency, notifyDeveloperMutation, notificationData, setIsNotifyModalOpen, setNotifyAgency, setNotificationData]);

  return { handleNotify, handleNotifyAgency, handleNotifySubmit };
}
