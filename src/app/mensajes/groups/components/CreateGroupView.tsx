'use client';

import { useState } from 'react';
import { useCreateGroup, useGetGroups } from '@/presentation/hooks/useContacts';
import { InfoDialog } from '@/presentation/components/ui';
import { ArrowLeft, Globe, Lock, Mail, Users, Info, AlertCircle } from 'lucide-react';
import { toast } from '@/presentation/store/toastStore';

export default function CreateGroupView({ user, onBack }: { user: any; onBack: () => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [groupType, setGroupType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
    const [isRestricted, setIsRestricted] = useState(false);
    const [infoDialog, setInfoDialog] = useState<{ isOpen: boolean; title: string; message: string; variant: 'warning' | 'error' }>({ isOpen: false, title: '', message: '', variant: 'warning' });
    const createGroup = useCreateGroup();
    const { data: groups } = useGetGroups(0, 50);

    const userGroups = groups?.filter((g: any) => g.isAdmin || (g.isMember && g.role === 'ADMIN')) ?? [];
    const hasGroup = userGroups.length > 0;

    const handleSubmit = async () => {
        if (!name.trim()) { toast.error('El nombre del grupo es obligatorio'); return; }
        if (name.trim().length > 100) { toast.error('El nombre no puede exceder 100 caracteres'); return; }
        if (description.length > 500) { toast.error('La descripción no puede exceder 500 caracteres'); return; }
        try {
            await createGroup.mutateAsync({ name: name.trim(), description: description.trim(), type: groupType, isRestrictedByEmail: isRestricted });
            toast.success('¡Grupo creado exitosamente!');
            onBack();
        } catch (error: any) {
            const data = error?.response?.data;
            const msg = (data?.message || data?.error || error?.message || '');
            const msgLower = msg.toLowerCase();
            const status = error?.response?.status;
            const code = data?.code || '';

            if (code === 'GROUP_LIMIT_EXCEEDED' || msgLower.includes('solo puedes crear') || msgLower.includes('grupo activo') || msgLower.includes('group_limit')) {
                toast.error('Ya tienes un grupo activo. Solo puedes tener 1 grupo.');
                onBack();
            } else if (code === 'DUPLICATE_NAME' || status === 409 || msgLower.includes('ya existe') || msgLower.includes('duplicado')) {
                toast.error('Ya existe un grupo o canal con ese nombre. Elige otro nombre.');
            } else if (status === 400) {
                toast.error(msg || 'Verifica los datos ingresados.');
            } else {
                toast.error('Error al crear el grupo. Intenta de nuevo.');
            }
        }
    };

    if (hasGroup) {
        return (
            <div className="h-full bg-[var(--bg-primary)] flex flex-col">
                {/* Header */}
                <div className="flex-none flex items-center gap-3 px-4 py-3 bg-green-600">
                    <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-white font-bold text-base leading-tight">Crear Grupo</h1>
                        <p className="text-white/70 text-xs">Límite alcanzado</p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full text-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">No puedes crear más grupos</h3>
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                            <p className="text-red-800 dark:text-red-300 text-sm font-medium">Ya alcanzaste el límite de 1 grupo activo</p>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mb-6">
                            Tu grupo actual: <strong className="text-[var(--text-primary)]">"{userGroups[0]?.name}"</strong>
                        </p>
                        <button onClick={onBack} className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <InfoDialog isOpen={infoDialog.isOpen} onClose={() => setInfoDialog(prev => ({ ...prev, isOpen: false }))} title={infoDialog.title} message={infoDialog.message} variant={infoDialog.variant} />
            <div className="h-full bg-[var(--bg-primary)] flex flex-col">
                {/* Header */}
                <div className="flex-none flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600">
                    <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-white font-bold text-base leading-tight">Crear Nuevo Grupo</h1>
                        <p className="text-white/70 text-xs">Solo puedes crear 1 grupo en Tiyuy</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Nombre del grupo *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => { if (e.target.value.length <= 100) setName(e.target.value); }}
                                maxLength={100}
                                placeholder="Ej: Alquiler Miraflores, Venta Casas Lima Norte..."
                                className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[var(--bg-card)] text-[var(--text-primary)] text-sm"
                            />
                            <p className="text-xs text-[var(--text-muted)] mt-1">{name.length}/100</p>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={description}
                                onChange={e => { if (e.target.value.length <= 500) setDescription(e.target.value); }}
                                maxLength={500}
                                rows={3}
                                placeholder="¿De qué trata este grupo? ¿Qué tipo de miembros buscas?"
                                className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[var(--bg-card)] text-[var(--text-primary)] text-sm resize-none"
                            />
                            <p className="text-xs text-[var(--text-muted)] mt-1">{description.length}/500</p>
                        </div>

                        {/* Tipo de grupo */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                                Tipo de grupo *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setGroupType('PUBLIC')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                        groupType === 'PUBLIC'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500/20'
                                            : 'border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-card)]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className={`w-5 h-5 ${groupType === 'PUBLIC' ? 'text-green-600' : 'text-[var(--text-muted)]'}`} />
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">Público</p>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                        Visible en "Descubrir". Cualquiera puede unirse.
                                    </p>
                                </button>
                                <button
                                    onClick={() => setGroupType('PRIVATE')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                        groupType === 'PRIVATE'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500/20'
                                            : 'border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-card)]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className={`w-5 h-5 ${groupType === 'PRIVATE' ? 'text-green-600' : 'text-[var(--text-muted)]'}`} />
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">Privado</p>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                        No aparece en búsqueda. Solo por invitación.
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Restricción por correo */}
                        <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-[var(--text-muted)] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-secondary)]">Restringir por correo</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Solo emails aprobados pueden unirse</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsRestricted(!isRestricted)}
                                    className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${isRestricted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isRestricted ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <Info className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">Comparte tu grupo</p>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                    Podrás compartir el link del grupo en WhatsApp, Telegram y otras redes para atraer miembros
                                </p>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onBack}
                                className="flex-1 py-3 text-sm border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!name.trim() || createGroup.isPending}
                                className="flex-1 py-3 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                            >
                                {createGroup.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-4 h-4" />
                                        Crear Grupo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}