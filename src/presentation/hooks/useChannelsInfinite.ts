'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from '@/infrastructure/api/axios-client';

// Hook con scroll infinito para eventos del canal (carga 9 por bloque = 3 filas de 3)
export function useChannelEventsInfinite(
  channelId: number,
  filters: {
    eventType?: string;
    city?: string;
    featured?: boolean;
    dateFilter?: string;
    location?: string;
  } = {}
) {
  return useInfiniteQuery({
    queryKey: ['channel-events-infinite', channelId, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.append('page', String(pageParam));
      params.append('size', '9');
      params.append('sort', 'startDateTime,desc');
      
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.city) params.append('city', filters.city);
      if (filters.featured !== undefined) params.append('featured', String(filters.featured));
      if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
      if (filters.location) params.append('location', filters.location);
      
      const response = await axiosClient.get(
        `/contacts/extended/channels/${channelId}/events?${params.toString()}`
      );
      
      const data = response.data;
      return {
        events: data?.content || [],
        totalPages: data?.totalPages || 1,
        currentPage: data?.number || pageParam,
        hasMore: data && !data.last,
        totalElements: data?.totalElements || 0,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 0,
    enabled: !!channelId,
    staleTime: 1000 * 30,
  });
}