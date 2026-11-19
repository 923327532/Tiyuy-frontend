'use client';

import { useState, useRef, useEffect } from 'react';
import { useChannels } from '@/presentation/hooks/useChannels';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { formatCompactNumber } from '@/utils/formatters';
import { Bell, BellOff, FileText, Search, Users } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function DiscoverChannelsView({ user, onChannelSelect }: { user: any; onChannelSelect: (channel: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: channelsData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['channels-discover', user?.id],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosClient.get(`/contacts/extended/channels?page=${pageParam}&size=15`);
      return { channels: response.data?.content || [], totalPages: response.data?.totalPages || 1, currentPage: response.data?.number || pageParam, hasMore: response.data && !response.data.last };
    },
    getNextPageParam: (lastPage) => { if (!lastPage.hasMore) return undefined; return lastPage.currentPage + 1; },
    initialPageParam: 0, staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) fetchNextPage(); }, { threshold: 0.1 });
    const s = sentinelRef.current;
    if (s) observer.observe(s);
    return () => { if (s) observer.unobserve(s); };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allChannels = channelsData?.pages?.flatMap((p: any) => p.channels) ?? [];
  const filteredChannels = allChannels.filter((channel: any) =>
    !channel.isSubscribed &&
    (channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     channel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     channel.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     channel.city?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const { subscribeToChannel, isSubscribing } = useChannels(user?.id);

  const handleSubscribeChannel = (channelId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    subscribeToChannel(channelId);
  };

  return (
    <div className="flex flex-col bg-[var(--bg-primary)] h-full">
      <div className="bg-[var(--brand-primary)] px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-base leading-tight">Descubrir Canales</h1>
            <p className="text-white/70 text-xs">{filteredChannels.length} canales disponibles</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--text-muted)]" />
              </div>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar canales por nombre, descripción, categoría o ciudad..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-sm placeholder-[var(--text-muted)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-4 border-[var(--brand-primary)] border-t-transparent animate-spin" />
            </div>
          )}

          {!isLoading && filteredChannels.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {searchTerm ? 'No se encontraron canales' : 'No hay canales disponibles'}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">{searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay canales disponibles para suscribirse en este momento'}</p>
            </div>
          )}

          {!isLoading && filteredChannels.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChannels.map((channel: any) => (
                <div key={channel.id} className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={(e) => { if (!channel.isSubscribed) handleSubscribeChannel(channel.id, e); setTimeout(() => onChannelSelect(channel), 300); }}>
                  <div className="h-24 bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <EntityIcon name={channel.name} className="w-14 h-14 text-brand" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--text-primary)] text-sm mb-2 line-clamp-2">{channel.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{channel.description || 'Sin descripción disponible'}</p>
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3 pb-2 border-b border-[var(--border-color)]">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{formatCompactNumber(channel.subscriberCount)} suscriptores</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{channel.postsPerDay || 0} posts/día</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3">
                      <span className={`px-2 py-1 rounded-full ${channel.isPublic ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>{channel.isPublic ? '🔓 Público' : '🔒 Privado'}</span>
                      <span>{channel.city}</span>
                    </div>
                    <div className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold rounded-lg text-center">
                      {channel.isSubscribed ? 'Entrar al canal' : isSubscribing ? 'Suscribiéndose...' : 'Entrar'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <div ref={sentinelRef} className="flex justify-center py-6 mt-4">
              {isFetchingNextPage ? (
                <div className="w-8 h-8 rounded-full border-3 border-brand border-t-transparent animate-spin" />
              ) : (
                <span className="text-xs text-[var(--text-muted)]">Desplaza para más canales...</span>
              )}
            </div>
          )}

          {!isLoading && allChannels.length > 0 && (
            <div className="text-center mt-4 pb-4">
              <span className="text-xs text-[var(--text-muted)]">Mostrando {allChannels.length} canales disponibles</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}