'use client';

import { useMemo } from 'react';

export interface HistoryItem {
  id: number | string;
  title?: string;
  subject?: string;
  message: string;
  createdAt: string;
  recipientCount?: number;
  targetUserCount?: number;
  sendEmail?: boolean;
  sendInApp?: boolean;
  sendPush?: boolean;
  alertType?: string;
  status?: string;
}

export interface UseFilteredHistoryReturn {
  filteredNotifications: HistoryItem[];
  filteredAlerts: HistoryItem[];
}

export function useFilteredHistory(
  notificationHistory: { content: HistoryItem[] } | undefined,
  adminAlerts: { content: HistoryItem[] } | undefined,
  historyFilters: { typeFilter: string; searchQuery: string }
): UseFilteredHistoryReturn {
  const filteredNotifications = useMemo(() => {
    if (!notificationHistory?.content) return [];
    if (!historyFilters.searchQuery && !historyFilters.typeFilter) return notificationHistory.content;
    
    const q = historyFilters.searchQuery.toLowerCase();
    return notificationHistory.content.filter((n: any) => {
      const matchesSearch = !q || 
        (n.title?.toLowerCase().includes(q)) ||
        (n.message?.toLowerCase().includes(q)) ||
        (n.recipientCount?.toString().includes(q));
      
      const matchesType = !historyFilters.typeFilter || historyFilters.typeFilter === 'NOTIFICATION';
      
      return matchesSearch && matchesType;
    });
  }, [notificationHistory, historyFilters.searchQuery, historyFilters.typeFilter]);

  const filteredAlerts = useMemo(() => {
    if (!adminAlerts?.content) return [];
    if (!historyFilters.searchQuery && !historyFilters.typeFilter) return adminAlerts.content;
    
    const q = historyFilters.searchQuery.toLowerCase();
    return adminAlerts.content.filter((a: any) => {
      const matchesSearch = !q || 
        (a.subject?.toLowerCase().includes(q)) ||
        (a.message?.toLowerCase().includes(q)) ||
        (a.targetUserCount?.toString().includes(q));
      
      const matchesType = !historyFilters.typeFilter || historyFilters.typeFilter === 'ALERT';
      
      return matchesSearch && matchesType;
    });
  }, [adminAlerts, historyFilters.searchQuery, historyFilters.typeFilter]);

  return { filteredNotifications, filteredAlerts };
}