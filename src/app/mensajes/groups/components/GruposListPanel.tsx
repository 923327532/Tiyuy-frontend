'use client';

import { useGetGroups } from '@/presentation/hooks/useContacts';
import { Search, X } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';


export function GruposListPanel({
    user,
    onGroupSelect,
    activeSection,
    onSectionChange,
}: {
    user: any;
    onGroupSelect: (group: any) => void;
    activeSection: 'mis-grupos' | 'descubrir' | 'crear';
    onSectionChange: (s: 'mis-grupos' | 'descubrir' | 'crear') => void;
}) {
    const { data: groups, isLoading } = useGetGroups(0, 50);
    const misGrupos = groups?.filter((g: any) => g.isMember) ?? [];
    const userOwnedGroups = groups?.filter((g: any) => g.isMember && g.isOwner) ?? [];
    const hasGroup = userOwnedGroups.length > 0;

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            {/* Header estilo Facebook */}
            <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">Grupos</h1>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-full px-3 py-2">
                    <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        placeholder="Buscar grupos"
                        className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] flex-1 focus:outline-none"
                    />
                </div>
            </div>

            {/* Nav items */}
            <div className="px-3 py-2 space-y-1">
                <button
                    onClick={() => onSectionChange('descubrir')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === 'descubrir' ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                >
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activeSection === 'descubrir' ? 'bg-[var(--brand-primary)]' : 'bg-[var(--bg-tertiary)]'
                        }`}>
                        <Search className="w-4 h-4 text-white" />
                    </span>
                    Descubrir
                </button>

                <button
                    onClick={() => onSectionChange('mis-grupos')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === 'mis-grupos' ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                >
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activeSection === 'mis-grupos' ? 'bg-[var(--brand-primary)]' : 'bg-[var(--bg-tertiary)]'
                        }`}>
                        <Search className="w-4 h-4 text-white" />
                    </span>
                    Tus grupos
                </button>
            </div>

            {/* Botón crear */}
            <div className="px-3 pb-3">
                <button
                    onClick={() => onSectionChange('crear')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${hasGroup
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                        : 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]'
                        }`}
                >
                    {hasGroup && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${hasGroup ? 'bg-[var(--bg-tertiary)]' : 'bg-[var(--brand-primary)]'
                        }`}>
                        <span className="text-lg font-bold leading-none text-white">
                            {hasGroup ? '' : '+'}
                        </span>
                    </span>
                    {hasGroup ? 'Límite alcanzado' : 'Crear nuevo grupo'}
                </button>
                {hasGroup && (
                    <p className="text-xs text-[var(--text-muted)] text-center mt-1">
                        Ya tienes 1 grupo activo
                    </p>
                )}
            </div>

            <div className="border-t border-[var(--border-color)]" />

            {/* Mini lista de mis grupos al fondo */}
            {misGrupos.length > 0 && (
                <div className="flex-1 overflow-y-auto px-4 pt-3">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                        Grupos a los que te uniste
                    </p>
                    <div className="space-y-1">
                        {misGrupos.slice(0, 8).map((group: any) => (
                            <button
                                key={group.id}
                                onClick={() => {
                                    onGroupSelect(group);
                                    onSectionChange('mis-grupos');
                                }}
                                className="w-full flex items-center gap-3 p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
                                    <EntityIcon name={group.name} className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{group.name}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{group.memberCount} miembros</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}