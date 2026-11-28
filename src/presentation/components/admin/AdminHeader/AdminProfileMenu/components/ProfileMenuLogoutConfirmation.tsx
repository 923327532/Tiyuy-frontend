'use client';

import { Modal } from '@/presentation/components/ui/Modal';
import { X } from 'lucide-react';

interface ProfileMenuLogoutConfirmationProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ProfileMenuLogoutConfirmation({
  isOpen,
  onCancel,
  onConfirm,
}: ProfileMenuLogoutConfirmationProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      contentClassName="flex-1"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmar cierre de sesión"
        className="p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Confirmar cierre de sesión
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar modal"
            className="
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg text-slate-500 transition-colors
              hover:bg-slate-100 hover:text-slate-800
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand
              dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white
            "
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          ¿Estás seguro de que quieres cerrar sesión?
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-lg border border-slate-200 px-4 py-2
              text-sm font-medium text-slate-700
              transition hover:bg-slate-50
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand
              dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              rounded-lg bg-rose-600 px-4 py-2
              text-sm font-medium text-white
              transition hover:bg-rose-700
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-rose-500
            "
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </Modal>
  );
}
