'use client';

import { useState } from 'react';
import { useLeaveGroup, useGetGroups } from '@/presentation/hooks/useContacts';
import { ShareModal } from "@/app/mensajes/page";
import { EntityIcon } from '@/utils/entityIcons';

export function GruposMisGruposView({ user, onGroupSelect }: { user: any; onGroupSelect: (g: any) => void }) {
    const { data: groups, isLoading } = useGetGroups(0, 50);
    const leaveGroup = useLeaveGroup();
    const [shareTarget, setShareTarget] = useState<{ title: string; link: string } | null>(null);
    const misGrupos = groups?.filter((g: any) => g.isMember) ?? [];

    return (
        <div className="flex flex-col bg-[var(--bg-primary)]">
            {/* Header con barra verde como en el chat */}
            <div className="bg-[var(--brand-primary)] px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white font-bold text-base leading-tight">Mis Grupos</h1>
                        <p className="text-white/70 text-xs">Todos los grupos a los que te uniste ({misGrupos.length})</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                {isLoading && (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-4 border-[var(--brand-primary)] border-t-transparent animate-spin" />
                    </div>
                )}

                {!isLoading && misGrupos.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-primary)] font-semibold text-lg">No eres miembro de ningún grupo aún</p>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Ve a "Descubrir" para unirte a grupos</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {misGrupos.map((group: any) => (
                        <div key={group.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer">
                            <div className="h-28 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary)] flex items-center justify-center" onClick={() => onGroupSelect(group)}>
                                <EntityIcon name={group.name} className="w-14 h-14 text-brand" />
                            </div>
                            <div className="p-3" onClick={() => onGroupSelect(group)}>
                                <h3 className="font-bold text-[var(--text-primary)] text-sm line-clamp-2 leading-snug mb-1">{group.name}</h3>
                                <p className="text-xs text-[var(--text-muted)]">{group.memberCount || 0} miembros  {group.postCount || 0} publicaciones</p>
                            </div>
                            <div className="px-3 pb-3 flex items-center gap-2">
                                <button onClick={() => onGroupSelect(group)} className="flex-1 py-1.5 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] text-xs font-semibold rounded-lg hover:bg-[var(--brand-primary)] hover:text-white transition-colors">Ver grupo</button>
                                <button onClick={(e) => { e.stopPropagation(); setShareTarget({ title: group.name, link: `${window.location.origin}/groups/${group.id}` }); }} className="w-8 h-8 flex items-center justify-center bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--border-color)] transition-colors">
                                    <span className="text-[var(--text-muted)] text-xs">···</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {shareTarget && (<ShareModal title={shareTarget.title} link={shareTarget.link} onClose={() => setShareTarget(null)} />)}
            </div>
        </div>
    );
}