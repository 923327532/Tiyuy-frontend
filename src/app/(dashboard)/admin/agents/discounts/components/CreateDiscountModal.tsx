'use client';

import type { AgentListItem } from '@/core/domain/entities/Admin';
import {
  DiscountFormFooter,
  DiscountFormModalShell,
} from '@/presentation/components/admin/discounts/components/modals';

interface NewDiscount {
  code: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

interface CreateDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent: AgentListItem | null;
  newDiscount: NewDiscount;
  setNewDiscount: (discount: NewDiscount) => void;
  onCreate: () => void;
  isPending: boolean;
}

const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700';
const inputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 transition-all placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15';
const helpClass = 'mt-1 text-[11px] text-slate-400';

/** Creación de código personalizado con acabado SaaS esmeralda. */
export default function CreateDiscountModal({
  isOpen, onClose, selectedAgent, newDiscount, setNewDiscount, onCreate, isPending,
}: CreateDiscountModalProps) {
  const agentName = [selectedAgent?.firstName, selectedAgent?.lastName]
    .filter(Boolean).join(' ').trim();

  return (
    <DiscountFormModalShell
      isOpen={isOpen}
      onClose={onClose}
      tone="emerald"
      icon={<span className="text-sm font-semibold">D</span>}
      title="Crear Descuento Personalizado"
      subtitle={`Para: ${agentName || 'Agente'} (ID: ${selectedAgent?.id ?? '-'})`}
      footer={
        <DiscountFormFooter
          tone="emerald"
          onClose={onClose}
          onSubmit={onCreate}
          isPending={isPending}
          label="Crear Descuento"
          pendingLabel="Creando..."
        />
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Código de Descuento</label>
          <input
            type="text"
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
            placeholder="Ej: AGENTE20OFF"
            className={`${inputClass} font-mono`}
          />
          <p className={helpClass}>Este código será único para este agente</p>
        </div>

        <div>
          <label className={labelClass}>Porcentaje de Descuento (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              value={newDiscount.discountPercentage}
              onChange={(e) => setNewDiscount({ ...newDiscount, discountPercentage: e.target.value })}
              placeholder="Ej: 20"
              className={`${inputClass} pr-10 font-semibold tabular-nums`}
            />
            <span className="absolute right-3.5 top-2.5 text-sm font-bold text-slate-400">%</span>
          </div>
          <p className={helpClass}>Si el plan cuesta S/100, con 20% descuento costará S/80</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Fecha Inicio</label>
            <input
              type="date"
              value={newDiscount.startDate}
              onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
              className={inputClass}
              style={{ colorScheme: 'light' }}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha Fin</label>
            <input
              type="date"
              value={newDiscount.endDate}
              onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
              className={inputClass}
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Límite de Usos (opcional)</label>
          <input
            type="number"
            min="1"
            value={newDiscount.usageLimit}
            onChange={(e) => setNewDiscount({ ...newDiscount, usageLimit: e.target.value })}
            placeholder="Dejar vacío para ilimitado"
            className={`${inputClass} tabular-nums`}
          />
          <p className={helpClass}>Cuántas veces puede usar este código el agente</p>
        </div>
      </div>
    </DiscountFormModalShell>
  );
}
