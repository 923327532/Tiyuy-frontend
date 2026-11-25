'use client';

import { AlertTriangle, Building2, FolderKanban, ShieldAlert, Trash2 } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
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
  const propertiesCount = user.publishedPropertiesCount ?? 0;
  const projectsCount = user.publishedProjectsCount ?? 0;
  const hasActiveAssets = propertiesCount > 0 || projectsCount > 0;

  if (hasActiveAssets) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div
            aria-hidden="true"
            className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
          />

          <div className="px-6 pt-6 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200/80">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  Eliminación bloqueada
                </span>
                <h3 className="mt-1 text-base font-bold text-slate-900">
                  No se puede eliminar este usuario
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              La cuenta de <strong className="text-slate-900">{fullName}</strong> ({user.email}) tiene activos asociados en la plataforma que no pueden quedar huérfanos:
            </p>

            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5">
                <Building2 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{propertiesCount}</p>
                  <p className="text-[11px] text-slate-500">Propiedad(es)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5">
                <FolderKanban className="h-4 w-4 shrink-0 text-indigo-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{projectsCount}</p>
                  <p className="text-[11px] text-slate-500">Proyecto(s)</p>
                </div>
              </div>
            </div>

            <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-amber-950">
                Para dar de baja esta cuenta, primero <strong>suspende el usuario</strong> desde el menú de acciones o reasigna sus propiedades y proyectos a otro agente.
              </p>
            </div>
          </div>

          <footer className="flex items-center justify-end border-t border-slate-100 bg-slate-50/80 px-6 py-3.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800"
            >
              Entendido
            </button>
          </footer>
        </div>
      </Modal>
    );
  }

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
          <span>Esta acción anonimizará los datos personales y deshabilitará el acceso</span>
        </>
      }
      reasonPlaceholder="Indica el motivo de la eliminación..."
      confirmLabel="Eliminar usuario"
      pendingLabel="Eliminando..."
    />
  );
}