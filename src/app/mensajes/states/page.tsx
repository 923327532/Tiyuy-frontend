'use client'

import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from '@iconify/react';
import { Avatar } from '@/app/mensajes/chats/components/ChatsPanel';
import { useShareStatusPost } from "@/presentation/hooks/useContacts";
import { expiresPercent, timeLeft } from "@/app/mensajes/page";
import { ShareModal } from "@/app/mensajes/page";
import { useGetActiveStatusPosts } from "@/presentation/hooks/useContacts";
import { IC } from "@/app/mensajes/page";

const ROLE_BADGE: Record<string, string> = {
    USER: 'bg-brand/10 text-brand',
    AGENT: 'bg-brand/10 text-brand',
    DEVELOPER: 'bg-purple-100 text-purple-700',
    ADMIN: 'bg-slate-100 text-slate-700',
};

const ROLE_LABEL: Record<string, string> = {
    USER: 'Propietario',
    AGENT: 'Agente',
    DEVELOPER: 'Desarrollador',
    ADMIN: 'Admin',
};

export default function EstadosPanel({ user, onNewStatus, onStatusSelect, onStatusGroupSelect, selectedStatusId }: {
    user: any;
    onNewStatus: () => void;
    onStatusSelect?: (id: number) => void;
    onStatusGroupSelect?: (statuses: any[]) => void;
    selectedStatusId?: number | null;
}) {
    const [shareTarget, setShareTarget] = useState<{ title: string; link: string } | null>(null);
    const [locationFilter, setLocationFilter] = useState('');
    const [debouncedLocation, setDebouncedLocation] = useState('');
    const shareStatus = useShareStatusPost();

    // Debounce para el filtro de ubicación
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLocation(locationFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [locationFilter]);

    const { data: statusData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetActiveStatusPosts({
        location: debouncedLocation || undefined,
    });

    const allPosts = statusData?.pages?.flatMap((p: any) => p.content) ?? [];
    const sentinelRef = useRef<HTMLDivElement>(null);

    // ═══ AGRUPAR POR USUARIO (estilo WhatsApp) ═══
    // Si un usuario publicó varios estados, se muestran agrupados en una sola fila.
    const groupedPosts = useCallback(() => {
        const groups = new Map<string, any[]>();
        allPosts.forEach((post: any) => {
            const key = String(post.userId ?? post.user?.id ?? post.userEmail ?? post.userName);
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(post);
        });
        // Ordenar por el estado más reciente de cada grupo
        return Array.from(groups.values())
            .map(userStatuses => ({
                statuses: userStatuses,
                newest: userStatuses.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b),
            }))
            .sort((a, b) => new Date(b.newest.createdAt).getTime() - new Date(a.newest.createdAt).getTime());
    }, [allPosts]);

    const groups = groupedPosts();

    // IntersectionObserver para scroll infinito
    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );
        const sentinel = sentinelRef.current;
        if (sentinel) observer.observe(sentinel);
        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleShare = async (postId: number, postTitle: string) => {
        // Mostrar feedback inmediato al usuario
        setShareTarget({ title: postTitle, link: window.location.origin });

        // Intentar registrar el share en el backend de forma asíncrona (sin bloquear)
        shareStatus.mutate(postId, {
            onError: (error: any) => {
                console.warn('No se pudo registrar el share en el backend:', error);
                // No mostrar error al usuario ya que el compartido ya funcionó
            },
            onSuccess: () => {
                console.log('Share registrado exitosamente en el backend');
            }
        });
    };

    const handleStatusClick = (statuses: any[]) => {
        if (statuses.length === 0) return;
        // Si hay un grupo (varios estados del mismo usuario), abrir secuencialmente
        if (statuses.length > 1 && onStatusGroupSelect) {
            onStatusGroupSelect(statuses);
        } else if (onStatusSelect) {
            onStatusSelect(statuses[0].id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)]">
                <h2 className="font-semibold text-[var(--text-primary)]">Estados · 48h</h2>
                <button onClick={onNewStatus}
                    className="text-xs bg-brand text-white px-4 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity shadow-sm">
                    + Publicar
                </button>
            </div>

            {/* Filtro ubicación */}
            <div className="px-4 py-2 border-b border-[var(--border-light)]">
                <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-full px-3 py-1.5">
                    <IC.Search />
                    <input
                        value={locationFilter}
                        onChange={e => setLocationFilter(e.target.value)}
                        placeholder="Filtrar por zona o distrito..."
                        className="bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] flex-1 focus:outline-none"
                    />
                </div>
            </div>

            {/* Mi estado */}
            <div onClick={onNewStatus}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] cursor-pointer border-b border-[var(--border-light)] transition-colors">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-brand">
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
                            <Avatar name={user?.firstName ?? 'U'} role={user?.role} size="md" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs font-bold leading-none">+</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Mi estado</p>
                    <p className="text-xs text-[var(--text-muted)]">Toca para publicar · dura 48 horas</p>
                </div>
            </div>

            {/* Sección recientes */}
            {!isLoading && groups.length > 0 && (
                <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                        Recientes
                    </p>
                </div>
            )}

            {/* Lista agrupada por usuario */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <p className="text-[var(--text-muted)] text-sm font-medium">No hay estados activos</p>
                        <p className="text-[var(--text-muted)] text-xs mt-1">Sé el primero en publicar una búsqueda</p>
                    </div>
                ) : (
                    <>
                        {groups.map((group: any, groupIndex: number) => {
                            const statuses: any[] = group.statuses;
                            const newest = group.newest;
                            const count = statuses.length;
                            const first = statuses[0];
                            const percent = expiresPercent(new Date(newest.createdAt), new Date(newest.expiresAt));
                            const isUrgent = percent >= 75;
                            const badge = ROLE_BADGE[newest.userRole] ?? 'bg-gray-100 text-gray-600';
                            const roleLabel = ROLE_LABEL[newest.userRole] ?? 'Usuario';
                            // El grupo completo: todos los estados de ese usuario
                            const userStatuses = statuses.length > 0 ? statuses : [newest];

                            return (
                                <div key={groupIndex}
                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] border-b border-[var(--border-light)] transition-colors cursor-pointer ${selectedStatusId === first.id ? 'bg-brand/10' : ''}`}
                                    onClick={() => handleStatusClick(userStatuses)}>
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-full ring-2 ring-offset-1 ${isUrgent ? 'ring-red-400' : 'ring-green-400'} overflow-hidden`}>
                                            <Avatar name={newest.userName ?? 'U'} role={newest.userRole} size="lg" src={newest.userAvatar} />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-sm font-semibold text-[var(--text-primary)]">{newest.userName}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge}`}>{roleLabel}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                                <span className={`text-[10px] font-medium ${isUrgent ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
                                                    {isUrgent ? '️ ' : ''}{timeLeft(new Date(newest.expiresAt))}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{newest.content}</p>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            {count > 1 && (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                                                    {count} estados
                                                </span>
                                            )}
                                            {newest.location && (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                                                    {newest.location}
                                                </span>
                                            )}
                                            {newest.propertyType && (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                                                    {newest.propertyType}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-[var(--text-muted)] ml-auto">{newest.viewCount} vistas</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {hasNextPage && (
                            <div ref={sentinelRef} className="flex justify-center py-4">
                                {isFetchingNextPage ? (
                                    <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                                ) : (
                                    <span className="text-xs text-[var(--text-muted)]">Desplaza para más estados...</span>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {shareTarget && (
                <ShareModal title={shareTarget.title} link={shareTarget.link} onClose={() => setShareTarget(null)} />
            )}
        </div>
    );
}