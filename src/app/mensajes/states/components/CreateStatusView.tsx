'use client';

import { useCreateStatusPost } from '@/presentation/hooks/useContacts';
import StatusInput from '@/presentation/components/contacts/StatusInput';
import { toast } from '@/presentation/store/toastStore';
import { ArrowLeft } from 'lucide-react';

export default function CreateStatusView({ user, onBack }: { user: any; onBack: () => void }) {
    const createStatus = useCreateStatusPost();

    const handleSendStatus = async (content: string, textStyle?: string, customColor?: string, location?: string, propertyType?: string, templateKey?: string) => {
        if (!content.trim()) {
            toast.error('El contenido del estado no puede estar vacío');
            return;
        }
        if (content.length > 500) {
            toast.error('El contenido no puede exceder 500 caracteres');
            return;
        }
        try {
            await createStatus.mutateAsync({
                content,
                ...(location ? { location } : {}),
                ...(propertyType ? { propertyType } : {}),
                ...(textStyle && textStyle !== 'NORMAL' ? { textStyle } : {}),
                ...(customColor ? { customColor } : {}),
                ...(templateKey ? { templateKey } : {}),
                isPromoted: false
            });
            toast.success('¡Estado publicado!');
            onBack();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Error al publicar el estado. Verifica el contenido.';
            toast.error(msg);
        }
    };

    return (
        <div className="h-full bg-[var(--bg-primary)] flex flex-col">
            {/* Header */}
            <div className="flex-none flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600">
                <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-white font-bold text-base leading-tight">Crear Nuevo Estado</h1>
                    <p className="text-white/70 text-xs">Comparte lo que estás pensando</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <StatusInput
                    onSendStatus={handleSendStatus}
                    placeholder="¿Qué estás pensando?"
                    disabled={createStatus.isPending}
                    maxLength={500}
                />
            </div>
        </div>
    );
}