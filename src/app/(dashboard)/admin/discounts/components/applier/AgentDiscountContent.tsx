'use client';

import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { UserCheck } from 'lucide-react';
import { buildAgentPlanDiscountPayload, getApiErrorMessage } from '@/utils/agentPlanDiscount';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import {
  useAgentList, useCreateAgentDiscount, useAssignDiscountToAgent,
  useDiscountCodes, useCreateAgentPlanDiscount,
} from '@/presentation/hooks/useAdmin';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import type { CreateAgentDiscountRequest, AssignDiscountToAgentRequest } from '@/core/domain/entities/AgentDiscount';
import {
  DiscountFormModalShell, ModalDropdownPortal,
} from '@/presentation/components/admin/discounts/components/modals';
import AssignDiscountModal from '@/app/(dashboard)/admin/agents/discounts/components/AssignDiscountModal';
import CreateDiscountModal from '@/app/(dashboard)/admin/agents/discounts/components/CreateDiscountModal';
import PlanDiscountModal from '@/app/(dashboard)/admin/agents/discounts/components/PlanDiscountModal';
import AgentPlanSelection from './AgentPlanSelection';
import { PLANS, type DiscountPlan } from './discountPlans';

interface Props { onClose: () => void }

type Mode = 'select' | 'create' | 'assign' | 'plan' | 'plan-select';

/** Flujo completo de descuentos para un agente. */
export default function AgentDiscountContent({ onClose }: Props) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [agent, setAgent] = useState<AgentListItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState<Mode>('select');
  const [newDiscount, setNewDiscount] = useState({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
  const [planDiscount, setPlanDiscount] = useState({ discountPercentage: '', customPrice: '', startDate: '', endDate: '' });
  const [plan, setPlan] = useState<DiscountPlan | null>(null);

  const { data: agentsData } = useAgentList({ page: 0, size: 100 });
  const { data: discountsData } = useDiscountCodes({ page: 0, size: 100 });
  const createMutation = useCreateAgentDiscount();
  const assignMutation = useAssignDiscountToAgent();
  const planMutation = useCreateAgentPlanDiscount();

  const filteredAgents = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return (agentsData?.content || []).filter((a: AgentListItem) =>
      (a.firstName?.toLowerCase() || '').includes(q) ||
      (a.lastName?.toLowerCase() || '').includes(q) ||
      (a.email || '').toLowerCase().includes(q)
    ).slice(0, 5);
  }, [agentsData, query]);

  const resetAndClose = () => {
    setAgent(null); setQuery(''); setMode('select');
    setNewDiscount({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
    setPlanDiscount({ discountPercentage: '', customPrice: '', startDate: '', endDate: '' });
    setPlan(null); onClose();
  };

  const handleCreateDiscount = async () => {
    if (!agent) return;
    try {
      const request: CreateAgentDiscountRequest = {
        agentId: agent.id,
        discountCode: {
          code: newDiscount.code,
          discountPercentage: Number(newDiscount.discountPercentage),
          applicability: 'USER_SPECIFIC', status: 'ACTIVE', singleUse: true,
          startDate: new Date(newDiscount.startDate).toISOString(),
          endDate: new Date(newDiscount.endDate).toISOString(),
          applicableUserId: agent.id,
          usageLimit: newDiscount.usageLimit ? Number(newDiscount.usageLimit) : undefined,
        },
      };
      await createMutation.mutateAsync(request);
      resetAndClose();
    } catch (error) { console.error('Error creating agent discount:', error); }
  };

  const handleAssignDiscount = async (discountId: number) => {
    if (!agent) return;
    try {
      const request: AssignDiscountToAgentRequest = { userId: agent.id, discountCodeId: discountId };
      await assignMutation.mutateAsync(request);
      resetAndClose();
    } catch (error) { console.error('Error assigning discount:', error); }
  };

  const handleCreatePlanDiscount = async () => {
    if (!agent || !plan) return;
    const built = buildAgentPlanDiscountPayload(plan.code, planDiscount);
    if (!built.ok) { toast.error(built.error); return; }
    try {
      await planMutation.mutateAsync({ agentId: agent.id, data: built.payload });
      toast.success(`Descuento aplicado al plan ${plan.name}`);
      resetAndClose();
    } catch (error) {
      console.error('Error creating plan discount:', error);
      toast.error(getApiErrorMessage(error, 'No se pudo aplicar el descuento'));
    }
  };

  const agentName = [agent?.firstName, agent?.lastName].filter(Boolean).join(' ');

  return (
    <DiscountFormModalShell
      isOpen onClose={onClose} tone="emerald"
      icon={<UserCheck className="h-5 w-5" aria-hidden="true" />}
      title="Descuento para Agente"
      subtitle="Asigna un descuento a un agente específico"
      footer={<span className="text-xs text-slate-400">Selecciona una opción para continuar</span>}
    >
      <div className="space-y-3">
        {mode === 'select' && (
          <div className="space-y-4">
            <div ref={inputRef} className="relative">
              <Input
                placeholder="Buscar agente por nombre o email..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && filteredAgents.length > 0 && (
                <ModalDropdownPortal anchorRef={inputRef} onClose={() => setShowDropdown(false)}>
                  {filteredAgents.map((item: AgentListItem) => (
                    <button key={item.id} type="button" role="option"
                      onClick={() => { setAgent(item); setShowDropdown(false); setQuery(`${item.firstName || ''} ${item.lastName || ''}`); }}
                      className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50">
                      <div className="text-sm font-medium text-slate-900">{item.firstName} {item.lastName}</div>
                      <div className="truncate text-xs text-slate-500">{item.email}</div>
                    </button>
                  ))}
                </ModalDropdownPortal>
              )}
            </div>
            {agent && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                <p className="text-sm font-medium text-teal-800">Agente seleccionado:</p>
                <p className="text-sm text-teal-700">{agent.firstName} {agent.lastName} ({agent.email})</p>
              </div>
            )}
            {agent && (
              <div className="flex flex-col gap-2">
                <Button onClick={() => setMode('create')} className="w-full">Crear Nuevo Descuento</Button>
                <Button onClick={() => setMode('assign')} variant="outline" className="w-full">Asignar Codigo Existente</Button>
                <Button onClick={() => setMode('plan')} variant="outline" className="w-full">Descuento por Plan</Button>
              </div>
            )}
          </div>
        )}

        {mode === 'create' && agent && (
          <CreateDiscountModal isOpen onClose={() => setMode('select')} selectedAgent={agent}
            newDiscount={newDiscount} setNewDiscount={setNewDiscount}
            onCreate={handleCreateDiscount} isPending={createMutation.isPending} />
        )}

        {mode === 'assign' && agent && (
          <AssignDiscountModal isOpen onClose={() => setMode('select')} selectedAgent={agent}
            availableDiscounts={discountsData?.content || []}
            onAssign={handleAssignDiscount} isPending={assignMutation.isPending} />
        )}

        {mode === 'plan' && agent && (
          <AgentPlanSelection plans={PLANS} agentName={agentName}
            onBack={() => setMode('select')}
            onSelect={(selected) => { setPlan(selected); setMode('plan-select'); }} />
        )}

        {mode === 'plan-select' && agent && plan && (
          <PlanDiscountModal isOpen onClose={() => setMode('plan')} selectedAgent={agent}
            selectedPlan={plan} planDiscount={planDiscount} setPlanDiscount={setPlanDiscount}
            onCreate={handleCreatePlanDiscount} isPending={planMutation.isPending} />
        )}
      </div>
    </DiscountFormModalShell>
  );
}
