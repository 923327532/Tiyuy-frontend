'use client';

import { CheckCircle2, Globe2, LockOpen, ShieldCheck, X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import { DOC_TYPE_LABELS } from '../../../config/international.constants';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';

interface Props {
  user: InternationalUserListItem | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function getInitials(firstName?: string | null, lastName?: string | null, email?: string): string {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';
  return (first + last).toUpperCase() || email?.charAt(0).toUpperCase() || 'U';
}

export function InternationalApproveModal({
  user,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
    : '';

  const initials = getInitials(user?.firstName, user?.lastName, user?.email);
  const docLabel = user?.internationalDocumentType
    ? DOC_TYPE_LABELS[user.internationalDocumentType] || user.internationalDocumentType
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.28)]">
        {/* Franja superior decorativa */}
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#0F3D50] via-teal-600 to-emerald-500"
        />

        {/* Botón cerrar discreto */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Cabecera */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/20">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>

            <div className="pr-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Verificación KYC
              </span>
              <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                Aprobar identidad
              </h3>
            </div>
          </div>

          <p className="mt-3.5 text-[13px] leading-relaxed text-slate-600">
            ¿Confirmas que deseas aprobar la verificación de identidad de este usuario?
          </p>

          {/* Tarjeta de identidad del usuario */}
          {user && (
            <div className="mt-4 rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-slate-100/50 p-3.5 shadow-inner shadow-slate-200/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F3D50] text-xs font-bold tracking-wide text-white shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900" title={fullName}>
                    {fullName}
                  </p>
                  <p
                    className="mt-0.5 truncate font-mono text-[11px] text-slate-500"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              {(user.issuingCountry || docLabel || user.internationalDocumentNumber) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-2.5 text-[11px] text-slate-600">
                  {user.issuingCountry && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-slate-200/80">
                      <Globe2 className="h-3 w-3 text-teal-600" aria-hidden="true" />
                      {user.issuingCountry}
                    </span>
                  )}
                  {docLabel && (
                    <span className="rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-slate-200/80">
                      {docLabel}
                    </span>
                  )}
                  {user.internationalDocumentNumber && (
                    <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-800 ring-1 ring-slate-200/80">
                      {user.internationalDocumentNumber}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Aviso de efecto inmediato */}
          <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/60 px-3.5 py-2.5">
            <LockOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-emerald-900">
              El usuario obtendrá <span className="font-semibold">acceso inmediato</span> a las áreas privadas y funcionalidades verificadas de la plataforma.
            </p>
          </div>
        </div>

        {/* Footer de acciones */}
        <footer className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                Aprobando...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Aprobar identidad
              </>
            )}
          </button>
        </footer>
      </div>
    </Modal>
  );
}