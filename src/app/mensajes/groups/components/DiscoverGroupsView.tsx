'use client';

import { useState, useRef, useEffect } from 'react';
import { useGetGroupsInfinite, useJoinGroup } from '@/presentation/hooks/useContacts';
import { formatCompactNumber } from '@/utils/formatters';
import { FileText, Search, Users } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';

export default function DiscoverGroupsView({ user, onGroupSelect }: { user: any; onGroupSelect: (group: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: groupsData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetGroupsInfinite(15);
  const joinGroup = useJoinGroup();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Scroll infinito con IntersectionObserver
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Juntar todos los grupos de todas las páginas
  const allGroups = groupsData?.pages?.flatMap((p: any) => p.groups) ?? [];
  const filteredGroups = allGroups.filter((group: any) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinGroup = (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (joinGroup.mutate) {
      joinGroup.mutate(groupId);
    }
  };


  return (
    <div className="h-full bg-[var(--bg-primary)] overflow-y-auto">
      {/* Header con barra verde como en el chat */}
      <div className="bg-[var(--brand-primary)] px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-base leading-tight">Descubrir Grupos</h1>
            <p className="text-white/70 text-xs">{filteredGroups.length} grupos disponibles</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--text-muted)]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar grupos..."
              className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-sm placeholder-[var(--text-muted)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-[var(--brand-primary)] border-t-transparent animate-spin" />
          </div>
        )}

        {/* No groups available */}
        {!isLoading && filteredGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl"></span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {searchTerm ? 'No se encontraron grupos' : 'No hay grupos disponibles'}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm text-center max-w-md leading-relaxed">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'No hay grupos disponibles para unirte en este momento'
              }
            </p>
          </div>
        )}

        {/* Grid de grupos disponibles - 3 columnas en desktop, 2 en tablet, 1 en móvil */}
        {!isLoading && filteredGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group: any) => (
              <div
                key={group.id}
                className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={(e) => {
                  if (!group.isMember) {
                    handleJoinGroup(group.id, e);
                  }
                  setTimeout(() => onGroupSelect(group), 300);
                }}
              >
                {/* Banner del grupo */}
                <div className="h-24 bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <EntityIcon name={group.name} className="w-12 h-12 text-brand" />
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-bold text-[var(--text-primary)] text-sm mb-2 line-clamp-2">
                    {group.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                    {group.description || 'Sin descripción disponible'}
                  </p>
                  
                  {/* Group stats aligned */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)] mb-3 pb-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                      <span>{formatCompactNumber(group.memberCount)} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                      <span>{group.postCount || 0} posts</span>
                    </div>
                  </div>

                  {/* Indicador de estado */}
                  <div className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold rounded-lg text-center hover:opacity-90 transition-colors">
                    {group.isMember ? 'Entrar al grupo' : joinGroup.isPending ? 'Uniéndose...' : 'Entrar'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sentinel para scroll infinito */}
        {hasNextPage && (
          <div ref={sentinelRef} className="flex justify-center py-6 mt-4">
            {isFetchingNextPage ? (
              <div className="w-8 h-8 rounded-full border-3 border-brand border-t-transparent animate-spin" />
            ) : (
              <span className="text-xs text-[var(--text-muted)]">Desplaza para más grupos...</span>
            )}
          </div>
        )}

        {/* Contador de grupos cargados */}
        {!isLoading && allGroups.length > 0 && (
          <div className="text-center mt-4 pb-4">
            <span className="text-xs text-[var(--text-muted)]">
              Mostrando {allGroups.length} grupos disponibles
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
