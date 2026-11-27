'use client';

import { BadgePercent } from 'lucide-react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import {
  DiscountFormFooter,
  DiscountFormModalShell,
} from '@/presentation/components/admin/discounts/components/modals';
import { PlanDiscountForm, type PlanDiscountData, type SelectedPlan } from './PlanDiscountForm';

interface PlanDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent: AgentListItem | null;
  selectedPlan: SelectedPlan | null;
  planDiscount: PlanDiscountData;
  setPlanDiscount: (data: PlanDiscountData) => void;
  onCreate: () => Promise<void>;
  isPending: boolean;
}

/** Contenedor del descuento por plan con el shell esmeralda del panel. */
export default function PlanDiscountModal({
  isOpen, onClose, selectedAgent, selectedPlan, planDiscount, setPlanDiscount, onCreate, isPending,
}: PlanDiscountModalProps) {
  if (!selectedPlan) return null;

  const agentName = [selectedAgent?.firstName, selectedAgent?.lastName]
    .filter(Boolean).join(' ').trim();

  return (
    <DiscountFormModalShell
      isOpen={isOpen}
      onClose={onClose}
      tone="emerald"
      icon={<BadgePercent className="h-5 w-5" aria-hidden="true" />}
      title="Descuento por Plan"
      subtitle={agentName ? `Para: ${agentName}` : undefined}
      footer={
        <DiscountFormFooter
          tone="emerald"
          onClose={onClose}
          onSubmit={() => void onCreate()}
          isPending={isPending}
          disabled={!planDiscount.discountPercentage}
          label="Aplicar Descuento"
          pendingLabel="Aplicando..."
        />
      }
    >
      <PlanDiscountForm
        selectedPlan={selectedPlan}
        planDiscount={planDiscount}
        setPlanDiscount={setPlanDiscount}
      />
    </DiscountFormModalShell>
  );
}
