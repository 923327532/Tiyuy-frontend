'use client'

import { useLeaveGroup } from '@/presentation/hooks/useContacts';
import { LogOut, ChevronLeft, MessageSquare, Users } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';
import { GrupoPostsPanel } from './GroupPostsPanel';

export function GrupoDetailPanel({ group, user, onBack }: { group: any; user: any; onBack: () => void }) {
    const leaveGroup = useLeaveGroup();

    const handleLeaveGroup = () => {
        if (confirm(`¿Estás seguro de que quieres salir del grupo "${group.name}"?`)) {
            leaveGroup.mutate(group.id);
            onBack(); 
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            {/* Header del grupo - barra verde delgada solo con nombre */}
            <div className="bg-green-600 px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <EntityIcon name={group.name} className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-white font-bold text-base truncate">{group.name}</h1>
                    </div>
                    <button onClick={handleLeaveGroup} disabled={leaveGroup.isPending}
                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 flex-shrink-0">
                        {leaveGroup.isPending ? (
                            <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Saliendo...</>
                        ) : (
                            <><LogOut className="w-3.5 h-3.5" />Salir</>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats en fondo blanco (no verde) */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-[var(--border-light)]">
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Users className="w-3.5 h-3.5" />
                    <span>{group.memberCount || 0} miembros</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{group.postCount || 0} publicaciones</span>
                </div>
            </div>

            {/* Área de publicaciones dinámica */}
            <div className="flex-1 overflow-hidden">
                <GrupoPostsPanel
                    groupId={group.id ?? group.groupId ?? 0}
                    groupName={group.name}
                    currentUserId={user?.id || 0}
                    currentUser={user}
                    onCreatePost={() => {}}
                />
            </div>
        </div>
    );
};