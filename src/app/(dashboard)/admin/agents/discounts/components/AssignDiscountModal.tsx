'use client';

import { format } from 'date-fns';
import { Ticket } from 'lucide-react';
import type { AgentListItem, DiscountCode } from '@/core/domain/entities/Admin';
import { DiscountFormModalShell } from '@/presentation/components/admin/discounts/components/modals';
import { Button } from '@/presentation/components/ui/Button';

interface AssignDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent: AgentListItem | null;
  availableDiscounts?: DiscountCode[];
  onAssign: (discountId: number) => void;
  isPending: boolean;
}

/** Selector de códigos existentes con el shell premium del panel de descuentos. */
export default function AssignDiscountModal({
  isOpen,
  onClose,
  selectedAgent,
  availableDiscounts,
  onAssign,
  isPending,
}: AssignDiscountModalProps) {
  const agentName = [selectedAgent?.firstName, selectedAgent?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <DiscountFormModalShell
      isOpen={isOpen}
      onClose={onClose}
      tone="emerald"
      icon={<Ticket className="h-5 w-5" aria-hidden="true" />}
      title="Asignar Descuento Existente"
      subtitle={agentName ? `Para: ${agentName}` : undefined}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cerrar
        </button>
      }
    >
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Códigos de Descuento Disponibles
        </label>
        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
          {availableDiscounts && availableDiscounts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {availableDiscounts.map((discount) => (
                <div key={discount.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <span className="inline-block rounded bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700">
                      {discount.code}
                    </span>
                    <p className="mt-1 text-sm font-bold text-teal-700">-{discount.discountPercentage}%</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Válido: {format(discount.startDate, 'dd/MM')} -{' '}
                      {format(discount.endDate, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <Button
                    onClick={() => onAssign(discount.id)}
                    disabled={isPending}
                    size="sm"
                    className="shrink-0 bg-[#0f2e3a] px-3 py-1.5 text-xs hover:bg-[#164e63]"
                  >
                    Asignar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">
              <div className="mb-2 text-3xl" aria-hidden="true">🎫</div>
              No hay códigos de descuento disponibles para asignar.
            </div>
          )}
        </div>
      </div>
    </DiscountFormModalShell>
  );
}
