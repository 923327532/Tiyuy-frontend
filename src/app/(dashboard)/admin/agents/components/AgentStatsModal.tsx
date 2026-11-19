'use client';

import type { AgentListItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import { ModalHeader } from '@/presentation/components/admin/agents/components/detail/components/ModalHeader';
import { getAccountState, getPlanLabel } from '@/presentation/components/admin/agents/components/detail/model/accountState';
import {
  Panel,
  Row,
  RowList,
  SECONDARY_BUTTON,
  StatusChip,
  formatAgentMoney,
} from '@/presentation/components/admin/agents/components/detail/ui/agentDetailParts';
// Mismo estilo que el modal de detalle de usuarios.
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';

const PRIMARY_BUTTON =
  'inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0f2e3a] px-3 text-xs font-medium text-white transition hover:bg-[#1b4352] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';

interface AgentStatsModalProps {
  agent: AgentListItem;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export default function AgentStatsModal({
  agent,
  isOpen,
  onClose,
  onViewDetails,
}: AgentStatsModalProps) {
  if (!agent) return null;

  const accountState = getAccountState(agent);
  const conversion = Math.min(Math.max(agent.conversionRate ?? 0, 0), 100);

  const revenue = [
    { label: 'Semana', value: agent.weekRevenue ?? 0 },
    { label: 'Mes', value: agent.monthRevenue ?? 0 },
    { label: 'Año', value: agent.yearRevenue ?? 0 },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-detail-modal__surface">
        <ModalHeader agent={agent} accountState={accountState} onClose={onClose} />

        <div className="user-detail-modal__content" role="tabpanel">
          <div className="space-y-4">
            <Panel title="Ingresos generados">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {revenue.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <dt className="text-xs text-slate-500">Ingresos {item.label.toLowerCase()}</dt>
                    <dd className="mt-1 text-lg font-semibold tabular-nums text-[#0f2e3a]">
                      {formatAgentMoney(item.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel title="Tasa de conversión">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">Conversión de lead's a cierre</span>
                <span className="text-lg font-semibold tabular-nums text-[#0f2e3a]">
                  {conversion.toFixed(1)}%
                </span>
              </div>
              <div
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuenow={Math.round(conversion)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-[#0f2e3a] transition-[width] duration-500"
                  style={{ width: `${conversion}%` }}
                />
              </div>
            </Panel>

            <Panel title="Producción del corredor">
              <RowList>
                <Row label="Propiedades publicadas" value={agent.propertiesCount ?? 0} />
                <Row
                  label="Plan actual"
                  value={<StatusChip tone="info">{getPlanLabel(agent)}</StatusChip>}
                />
                <Row label="Último acceso" value={agent.lastLoginAt ? 'Registrado' : 'Sin accesos'} />
              </RowList>
            </Panel>
          </div>
        </div>

        <footer className="user-detail-modal__footer gap-2">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cerrar
          </button>
          <button
            type="button"
            onClick={onViewDetails}
            className={`${PRIMARY_BUTTON} user-detail-modal__close-action`}
          >
            Ver detalle completo
          </button>
        </footer>
      </div>
    </Modal>
  );
}
