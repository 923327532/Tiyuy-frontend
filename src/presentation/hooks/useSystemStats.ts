'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/infrastructure/api/axios-client';

interface ContactsDayStat {
  date: string;
  count: number;
}

/** Raw payload returned by GET /admin/dashboard/stats/contacts. */
interface ContactsStatsResponse {
  groups?: {
    total?: number;
    newThisWeek?: number;
  };
  channels?: {
    total?: number;
    newThisWeek?: number;
  };
  statusPosts?: {
    total?: number;
    newThisWeek?: number;
  };
  events?: {
    total?: number;
    newToday?: number;
    last7Days?: ContactsDayStat[];
  };
}

export interface SystemStats {
  groups: {
    total: number;
    recentGrowth: number;
  };
  channels: {
    total: number;
    recentGrowth: number;
  };
  states: {
    total: number;
    recentGrowth: number;
  };
  events: {
    total: number;
    recentCreated: number;
    data: Array<{
      date: string;
      count: number;
      label: string;
    }>;
  };
}

async function apiCall<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await axiosClient.get<T>(url);
  return response.data;
}

async function fetchSystemStats(): Promise<SystemStats> {
  // Endpoint administrativo real: grupos, canales, publicaciones y eventos.
  const adminStats = await apiCall<ContactsStatsResponse>(
    '/admin/dashboard/stats/contacts',
  );

  const eventsData =
    adminStats.events?.last7Days?.map((day) => ({
      date: day.date,
      count: day.count,
      label: new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' }),
    })) ?? [];

  return {
    groups: {
      total: adminStats.groups?.total ?? 0,
      recentGrowth: adminStats.groups?.newThisWeek ?? 0,
    },
    channels: {
      total: adminStats.channels?.total ?? 0,
      recentGrowth: adminStats.channels?.newThisWeek ?? 0,
    },
    states: {
      total: adminStats.statusPosts?.total ?? 0,
      recentGrowth: adminStats.statusPosts?.newThisWeek ?? 0,
    },
    events: {
      total: adminStats.events?.total ?? 0,
      recentCreated: adminStats.events?.newToday ?? 0,
      data: eventsData,
    },
  };
}

export function useSystemStats() {
  return useQuery({
    queryKey: ['system-stats'],
    queryFn: fetchSystemStats,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}
