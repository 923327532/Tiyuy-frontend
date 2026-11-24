'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { ActionConfirmModal } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import type { DeleteUserModalProps } from '@/presentation/components/admin/users/types/users.types';

export function DeleteUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteUserModalProps) {
  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

  return (
    <ActionConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      resetKey={user.id}
      variant="danger"
      icon={<Trash2 className="w-5 h-5" aria-hidden="true" />}
      title="¿Eliminar usuario?"
      description={
        <>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{fullName}</strong> ({user.email})?
          Esta acción no se puede deshacer.
        </>
      }
      warning={
        <>
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          <span>Esta acción eliminará permanentemente todos los datos del usuario</span>
        </>
      }
      reasonPlaceholder="Indica el motivo de la eliminación..."
      confirmLabel="Eliminar usuario"
      pendingLabel="Eliminando..."
    />
  );
}
