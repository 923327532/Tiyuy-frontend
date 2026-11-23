'use client';

import { UserCheck, UserX } from 'lucide-react';
import { ActionConfirmModal } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import type { ToggleStatusModalProps } from '@/presentation/components/admin/users/types/users.types';

export function ToggleStatusModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ToggleStatusModalProps) {
  if (!user) return null;

  const isSuspendAction = user.enabled;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

  return (
    <ActionConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      resetKey={user.id}
      variant={isSuspendAction ? 'warning' : 'success'}
      icon={
        isSuspendAction ? (
          <UserX className="w-5 h-5" aria-hidden="true" />
        ) : (
          <UserCheck className="w-5 h-5" aria-hidden="true" />
        )
      }
      title={isSuspendAction ? '¿Suspender usuario?' : '¿Reactivar usuario?'}
      description={
        isSuspendAction
          ? `¿Estás seguro de que deseas deshabilitar temporalmente al usuario ${fullName} (${user.email})?`
          : `¿Estás seguro de que deseas habilitar nuevamente al usuario ${fullName} (${user.email})?`
      }
      reasonPlaceholder="Indica el motivo del cambio de estado..."
      confirmLabel={isSuspendAction ? 'Suspender usuario' : 'Reactivar usuario'}
      pendingLabel="Procesando..."
    />
  );
}
