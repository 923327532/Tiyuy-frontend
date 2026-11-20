'use client';

import { BarChart3, X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import { SECONDARY_BUTTON } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import '@/presentation/components/ui/GenericUserTable/GenericUserTable.css';

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planDistribution?: {
    labels: string[];
    values: number[];
    total: number;
  };
}

const PLAN_NAMES: Record<string, string> = {
  ENTERPRISE: 'Empresarial',
  PREMIUM: 'Pro',
  BASIC: 'Básico',
  FREE: 'Gratis',
};

const PLAN_TONES = [
  'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'bg-amber-50 text-amber-700 ring-amber-600/20',
  'bg-slate-100 text-slate-700 ring-slate-500/10',
  'bg-sky-50 text-sky-700 ring-sky-600/20',
];

export default function PlanDetailsModal({ isOpen, onClose, planDistribution }: PlanDetailsModalProps) {
  const labels = planDistribution?.labels ?? [];
  const values = planDistribution?.values ?? [];
  const total = planDistribution?.total ?? 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title="Detalles de Monetización por Plan">
              Detalles de Monetización por Plan
            </h3>
            <p className="user-detail-modal__email">Distribución de agentes según su plan activo</p>
            <div className="user-detail-modal__badges">
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--agent">
                Resumen
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="user-detail-modal__close-btn"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="user-detail-modal__content">
          {labels.length === 0 ? (
            <div className="generic-table__empty">
              <BarChart3 className="generic-table__empty-icon" aria-hidden="true" />
              <p className="generic-table__empty-message">Sin información de planes</p>
              <p className="generic-table__empty-hint">Aún no hay agentes registrados por plan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {labels.map((label, index) => {
                const count = values[index] ?? 0;
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

                return (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,46,58,0.04)]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ring-1 ring-inset ${PLAN_TONES[index % PLAN_TONES.length]}`}
                      >
                        {count}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {PLAN_NAMES[label] ?? label}
                        </p>
                        <p className="text-xs text-slate-500">{count} agentes</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-900">{percentage}%</p>
                      <p className="text-xs text-slate-500">del total</p>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,46,58,0.04)]">
                <span className="text-sm font-medium text-slate-500">Total de agentes</span>
                <span className="text-xl font-bold text-slate-900">{total}</span>
              </div>
            </div>
          )}
        </div>

        <footer className="user-detail-modal__footer">
          <button
            type="button"
            onClick={onClose}
            className={`${SECONDARY_BUTTON} user-detail-modal__close-action`}
          >
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}
