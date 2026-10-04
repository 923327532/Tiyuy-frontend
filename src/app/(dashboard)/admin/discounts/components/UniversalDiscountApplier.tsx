/**
 * Universal Discount Applier Component
 * Reutiliza componentes existentes de agentes e inmobiliarias.
 * No duplica logica - hereda de las pantallas originales.
 * Todos los datos vienen del backend real.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import DiscountTypeCard from './DiscountTypeCard';
import {
  useAgentList,
  useCreateDiscountCode,
  useCreateAgentDiscount,
  useAssignDiscountToAgent,
  useDiscountCodes,
  useCreateAgentPlanDiscount,
} from '@/presentation/hooks/useAdmin';
import {
  useDeveloperDiscountTargets,
  useCreateDeveloperDiscountCode,
  useApplyDirectDiscount,
} from '@/presentation/hooks/admin/useDevelopers';
import { AgentListItem, DeveloperDiscountTarget, CreateInmobiliariaDiscountRequest, ApplyDirectDiscountRequest } from '@/core/domain/entities/Admin';
import { CreateAgentDiscountRequest, AssignDiscountToAgentRequest } from '@/core/domain/entities/AgentDiscount';

// Reutilizar componentes existentes de agentes
import AssignDiscountModal from '@/app/(dashboard)/admin/agents/discounts/components/AssignDiscountModal';
import CreateDiscountModal from '@/app/(dashboard)/admin/agents/discounts/components/CreateDiscountModal';
import PlanDiscountModal from '@/app/(dashboard)/admin/agents/discounts/components/PlanDiscountModal';

// Reutilizar componentes existentes de inmobiliarias
import ApplyDirectDiscountModal from '@/app/(dashboard)/admin/agencies/components/ApplyDirectDiscountModal';
import CreateAgencyDiscountModal from '@/app/(dashboard)/admin/agencies/components/CreateAgencyDiscountModal';
import { ChevronRight, X } from 'lucide-react';

// ==================== Types ====================

type DiscountType = 'GLOBAL' | 'USER' | 'AGENT' | 'AGENCY' | 'PLAN' | 'REUSABLE';

interface DiscountOption {
  type: DiscountType;
  label: string;
  description: string;
  gradient: string;
  bullets: string[];
}

const DISCOUNT_OPTIONS: DiscountOption[] = [
  { type: 'GLOBAL', label: 'Global', description: 'Codigo valido para todos los usuarios', gradient: 'from-indigo-500 to-blue-600', bullets: ['Aplica a cualquier usuario', 'Sin restriccion de agente', 'Activacion inmediata'] },
  { type: 'USER', label: 'Usuario', description: 'Descuento asignado a un usuario especifico', gradient: 'from-blue-500 to-cyan-600', bullets: ['Asignado a un usuario', 'Un solo uso', 'Control individual'] },
  { type: 'AGENT', label: 'Agente', description: 'Descuento asignado a un agente inmobiliario', gradient: 'from-teal-500 to-emerald-600', bullets: ['Asignado a un agente', 'Suscripcion personalizada', 'Gestion directa'] },
  { type: 'AGENCY', label: 'Inmobiliaria', description: 'Descuento para toda una inmobiliaria', gradient: 'from-violet-500 to-purple-600', bullets: ['Aplica a toda la agencia', 'Descuento masivo', 'Configuracion flexible'] },
  { type: 'PLAN', label: 'Plan', description: 'Descuento en un plan especifico para un agente', gradient: 'from-orange-500 to-amber-600', bullets: ['Descuento por plan', 'Precio personalizado', 'Suscripcion con descuento'] },
  { type: 'REUSABLE', label: 'Reutilizable', description: 'Codigo con multiples usos permitidos', gradient: 'from-rose-500 to-pink-600', bullets: ['Multiples usos', 'Alta capacidad', 'Codigo compartible'] },
];

// ==================== Global Discount Modal ====================

interface GlobalDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GlobalDiscountModal({ isOpen, onClose }: GlobalDiscountModalProps) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [usageLimit, setUsageLimit] = useState(100);
  const [singleUse, setSingleUse] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const createMutation = useCreateDiscountCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        code,
        discountPercentage,
        applicability: 'GLOBAL',
        usageLimit,
        singleUse,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date('2099-12-31'),
      });
      setCode('');
      setDiscountPercentage(10);
      setUsageLimit(100);
      setSingleUse(false);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      onClose();
    } catch (error) {
      console.error('Error creating global discount:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header verde */}
        <div className="bg-[#00E676] px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-green-800 font-bold text-lg">G</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Descuento Global</h3>
                <p className="text-xs text-green-700">Código válido para todos los usuarios</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-green-300 rounded-lg transition-colors text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Código de Descuento</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: BIENVENIDO20"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">% Descuento</label>
              <input
                type="number"
                min="1" max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Límite de Usos</label>
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={singleUse}
              onChange={(e) => setSingleUse(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Un solo uso por usuario</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>
        <div className="flex gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/30 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear Descuento Global'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==================== Agent Discount Content (sin Modal propio) ====================

interface AgentDiscountContentProps {
  onClose: () => void;
}

const PLANS = [
  { code: 'ENTERPRISE', name: 'Plan Empresarial', price: 'S/399', color: 'bg-teal-600' },
  { code: 'ENTERPRISE_TRIAL', name: 'Prueba Empresarial', price: 'S/299', color: 'bg-teal-500' },
  { code: 'PRO', name: 'Plan Pro', price: 'S/99', color: 'bg-blue-600' },
  { code: 'BASIC', name: 'Plan Basico', price: 'S/29', color: 'bg-orange-500' },
  { code: 'FREE', name: 'Plan Gratis', price: 'S/0', color: 'bg-gray-500' }
];

function AgentDiscountContent({ onClose }: AgentDiscountContentProps) {
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentListItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState<'select' | 'create' | 'assign' | 'plan' | 'plan-select'>('select');
  const [newDiscount, setNewDiscount] = useState({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
  const [planDiscount, setPlanDiscount] = useState({ discountPercentage: '', customPrice: '', startDate: '', endDate: '' });
  const [selectedPlan, setSelectedPlan] = useState<{ code: string; name: string; price: string; color: string } | null>(null);

  const { data: agentsData } = useAgentList({ page: 0, size: 100 });
  const allAgents = agentsData?.content || [];
  const { data: discountsData } = useDiscountCodes({ page: 0, size: 100 });
  const availableDiscounts = discountsData?.content || [];

  const createDiscountMutation = useCreateAgentDiscount();
  const assignDiscountMutation = useAssignDiscountToAgent();
  const createPlanDiscountMutation = useCreateAgentPlanDiscount();

  const filteredAgents = useMemo(() => {
    if (!agentSearchQuery.trim()) return [];
    const q = agentSearchQuery.toLowerCase();
    return allAgents.filter((a: AgentListItem) =>
      (a.firstName?.toLowerCase() || '').includes(q) ||
      (a.lastName?.toLowerCase() || '').includes(q) ||
      (a.email || '').toLowerCase().includes(q)
    ).slice(0, 5);
  }, [allAgents, agentSearchQuery]);

  const handleCreateDiscount = async () => {
    if (!selectedAgent) return;
    try {
      const request: CreateAgentDiscountRequest = {
        agentId: selectedAgent.id,
        discountCode: {
          code: newDiscount.code,
          discountPercentage: Number(newDiscount.discountPercentage),
          applicability: 'USER_SPECIFIC',
          status: 'ACTIVE',
          singleUse: true,
          startDate: new Date(newDiscount.startDate).toISOString(),
          endDate: new Date(newDiscount.endDate).toISOString(),
          applicableUserId: selectedAgent.id,
          usageLimit: newDiscount.usageLimit ? Number(newDiscount.usageLimit) : undefined,
        },
      };
      await createDiscountMutation.mutateAsync(request);
      resetAndClose();
    } catch (error) {
      console.error('Error creating agent discount:', error);
    }
  };

  const handleAssignDiscount = async (discountId: number) => {
    if (!selectedAgent) return;
    try {
      const request: AssignDiscountToAgentRequest = {
        userId: selectedAgent.id,
        discountCodeId: discountId,
      };
      await assignDiscountMutation.mutateAsync(request);
      resetAndClose();
    } catch (error) {
      console.error('Error assigning discount:', error);
    }
  };

  const handleCreatePlanDiscount = async () => {
    if (!selectedAgent || !selectedPlan) return;
    try {
      await createPlanDiscountMutation.mutateAsync({
        agentId: selectedAgent.id,
        data: {
          planCode: selectedPlan.code,
          discountPercentage: Number(planDiscount.discountPercentage),
          customPrice: planDiscount.customPrice ? Number(planDiscount.customPrice) : undefined,
          startDate: new Date(planDiscount.startDate).toISOString(),
          endDate: new Date(planDiscount.endDate).toISOString(),
        },
      });
      resetAndClose();
    } catch (error) {
      console.error('Error creating plan discount:', error);
    }
  };

  const resetAndClose = () => {
    setSelectedAgent(null);
    setAgentSearchQuery('');
    setMode('select');
    setNewDiscount({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
    setPlanDiscount({ discountPercentage: '', customPrice: '', startDate: '', endDate: '' });
    setSelectedPlan(null);
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
      {/* Header verde */}
      <div className="bg-[#00E676] px-5 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-green-800 font-bold text-lg">A</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Descuento para Agente</h3>
              <p className="text-xs text-green-700">Asigna un descuento a un agente específico</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-green-300 rounded-lg transition-colors text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {mode === 'select' && (
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Buscar agente por nombre o email..."
              value={agentSearchQuery}
              onChange={(e) => { setAgentSearchQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && filteredAgents.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredAgents.map((agent: AgentListItem) => (
                  <button
                    key={agent.id}
                    onClick={() => { setSelectedAgent(agent); setShowDropdown(false); setAgentSearchQuery(`${agent.firstName || ''} ${agent.lastName || ''}`); }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-gray-900">{agent.firstName} {agent.lastName}</div>
                    <div className="text-sm text-gray-500">{agent.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedAgent && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <p className="text-sm font-medium text-teal-800">Agente seleccionado:</p>
              <p className="text-sm text-teal-700">{selectedAgent.firstName} {selectedAgent.lastName} ({selectedAgent.email})</p>
            </div>
          )}

          {selectedAgent && (
            <div className="flex flex-col gap-2">
              <Button onClick={() => setMode('create')} className="w-full">Crear Nuevo Descuento</Button>
              <Button onClick={() => setMode('assign')} variant="outline" className="w-full">Asignar Codigo Existente</Button>
              <Button onClick={() => setMode('plan')} variant="outline" className="w-full">Descuento por Plan</Button>
            </div>
          )}
        </div>
      )}

      {mode === 'create' && selectedAgent && (
        <CreateDiscountModal
          isOpen={true}
          onClose={() => setMode('select')}
          selectedAgent={selectedAgent}
          newDiscount={newDiscount}
          setNewDiscount={setNewDiscount}
          onCreate={handleCreateDiscount}
          isPending={createDiscountMutation.isPending}
        />
      )}

      {mode === 'assign' && selectedAgent && (
        <AssignDiscountModal
          isOpen={true}
          onClose={() => setMode('select')}
          selectedAgent={selectedAgent}
          availableDiscounts={availableDiscounts}
          onAssign={handleAssignDiscount}
          isPending={assignDiscountMutation.isPending}
        />
      )}

      {mode === 'plan' && selectedAgent && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setMode('select')} className="text-sm text-teal-600 hover:text-teal-700">
              &larr; Volver
            </button>
            <span className="text-sm text-gray-400">|</span>
            <p className="text-sm text-gray-600">
              Agente: <span className="font-semibold text-teal-600">{selectedAgent.firstName} {selectedAgent.lastName}</span>
            </p>
          </div>
          <h4 className="font-semibold text-gray-900 mb-3">Selecciona un plan para aplicar descuento:</h4>
          <div className="grid grid-cols-1 gap-3">
            {PLANS.map((plan) => (
              <button
                key={plan.code}
                onClick={() => { setSelectedPlan(plan); setMode('plan-select'); }}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-teal-300 transition-all text-left"
              >
                <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {plan.code[0]}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                  <p className="text-lg font-bold text-gray-900">{plan.price}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'plan-select' && selectedAgent && selectedPlan && (
        <PlanDiscountModal
          isOpen={true}
          onClose={() => setMode('plan')}
          selectedAgent={selectedAgent}
          selectedPlan={selectedPlan}
          planDiscount={planDiscount}
          setPlanDiscount={setPlanDiscount}
          onCreate={handleCreatePlanDiscount}
          isPending={createPlanDiscountMutation.isPending}
        />
      )}
      </div>
    </div>
  );
}

// ==================== Agency Discount Content (sin Modal propio) ====================

interface AgencyDiscountContentProps {
  isOpen: boolean;
  onClose: () => void;
}

function AgencyDiscountContent({ isOpen, onClose }: AgencyDiscountContentProps) {
  const [agencySearchQuery, setAgencySearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<DeveloperDiscountTarget | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState<'select' | 'create' | 'direct'>('select');
  const [newDiscount, setNewDiscount] = useState({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
  const [directDiscount, setDirectDiscount] = useState({
    discountPercentage: '',
    reason: '',
    notifyAgency: false,
    applyToAllAgents: false,
    maxAgents: '',
    expiresAt: '',
  });

  const {
    data: agenciesData,
    isLoading: isSearchingAgencies,
    isError: hasAgencySearchError,
  } = useDeveloperDiscountTargets(agencySearchQuery);
  const agencies = agenciesData?.content || [];

  const createDiscountMutation = useCreateDeveloperDiscountCode();
  const applyDirectMutation = useApplyDirectDiscount();

  const handleCreateDiscount = async () => {
    if (!selectedAgency) return;
    try {
      const data: CreateInmobiliariaDiscountRequest = {
        inmobiliariaId: selectedAgency.id,
        code: newDiscount.code,
        discountPercentage: Number(newDiscount.discountPercentage),
        validFrom: newDiscount.startDate ? new Date(newDiscount.startDate) : undefined,
        validUntil: newDiscount.endDate ? new Date(newDiscount.endDate) : undefined,
        maxUses: newDiscount.usageLimit ? Number(newDiscount.usageLimit) : undefined,
      };
      await createDiscountMutation.mutateAsync({ developerId: selectedAgency.id, data });
      resetAndClose();
    } catch (error) {
      console.error('Error creating agency discount:', error);
    }
  };

  const handleApplyDirectDiscount = async () => {
    if (!selectedAgency) return;
    try {
      const data: ApplyDirectDiscountRequest = {
        discountPercentage: Number(directDiscount.discountPercentage),
        reason: directDiscount.reason,
        applyToAllAgents: directDiscount.applyToAllAgents,
        maxAgents: directDiscount.maxAgents ? Number(directDiscount.maxAgents) : undefined,
        expiresAt: directDiscount.expiresAt ? new Date(directDiscount.expiresAt) : undefined,
      };
      await applyDirectMutation.mutateAsync({ developerId: selectedAgency.id, data });
      resetAndClose();
    } catch (error) {
      console.error('Error applying direct discount:', error);
    }
  };

  const resetAndClose = () => {
    setSelectedAgency(null);
    setAgencySearchQuery('');
    setMode('select');
    setNewDiscount({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
    setDirectDiscount({ discountPercentage: '', reason: '', notifyAgency: false, applyToAllAgents: false, maxAgents: '', expiresAt: '' });
    onClose();
  };

  return mode === 'select' ? (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 ring-1 ring-white/25 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Descuento para Inmobiliaria</h3>
                <p className="text-sm text-white/80">Asigna un descuento a una inmobiliaria</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="agency-discount-search" className="block text-sm font-semibold text-gray-700 mb-2">
              Buscar inmobiliaria
            </label>
            <div className="relative">
              <input
                id="agency-discount-search"
                placeholder="Nombre, representante, RUC o correo..."
                value={agencySearchQuery}
                onChange={(e) => {
                  setAgencySearchQuery(e.target.value);
                  setSelectedAgency(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
              />
              {showDropdown && agencySearchQuery.trim() && (
                <div className="mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                  {isSearchingAgencies && (
                    <p className="px-4 py-3 text-sm text-gray-500">Buscando inmobiliarias...</p>
                  )}
                  {!isSearchingAgencies && hasAgencySearchError && (
                    <p className="px-4 py-3 text-sm text-red-600">No se pudo cargar la búsqueda. Intenta nuevamente.</p>
                  )}
                  {!isSearchingAgencies && !hasAgencySearchError && agencies.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-500">No se encontraron inmobiliarias con esos datos.</p>
                  )}
                  {!isSearchingAgencies && !hasAgencySearchError && agencies.map((agency) => (
                    <button
                      key={agency.id}
                      type="button"
                      onClick={() => {
                        const target: DeveloperDiscountTarget = {
                          id: agency.id,
                          name: agency.companyName || agency.managerName || agency.email,
                          ruc: agency.ruc,
                          email: agency.email,
                          managerName: agency.managerName,
                        };
                        setSelectedAgency(target);
                        setShowDropdown(false);
                        setAgencySearchQuery(target.name);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-violet-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <div className="font-semibold text-gray-900 text-sm">{agency.companyName || agency.email}</div>
                      {agency.managerName && <div className="text-xs text-gray-600 mt-0.5">Representante: {agency.managerName}</div>}
                      <div className="text-xs text-gray-500 mt-0.5">
                        {[agency.ruc && `RUC: ${agency.ruc}`, agency.email].filter(Boolean).join(' · ')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!showDropdown && !agencySearchQuery.trim() && (
              <p className="mt-2 text-xs text-gray-500">Escribe al menos un dato para buscar.</p>
            )}
          </div>

          {selectedAgency && (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Inmobiliaria seleccionada</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{selectedAgency.name}</p>
              <p className="text-xs text-gray-600 mt-0.5">RUC: {selectedAgency.ruc}</p>
            </div>
          )}

          {selectedAgency && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button onClick={() => setMode('create')} className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-600/20 transition-all">
                Crear código
              </button>
              <button onClick={() => setMode('direct')} className="w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-semibold">
                Aplicar descuento directo
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  ) : (
    <>
      {mode === 'create' && selectedAgency && (
        <CreateAgencyDiscountModal
          isOpen={isOpen}
          onClose={() => setMode('select')}
          selectedAgency={selectedAgency}
          newDiscount={newDiscount}
          setNewDiscount={setNewDiscount}
          onCreate={handleCreateDiscount}
          isPending={createDiscountMutation.isPending}
        />
      )}

      {mode === 'direct' && selectedAgency && (
        <ApplyDirectDiscountModal
          isOpen={isOpen}
          onClose={() => setMode('select')}
          selectedAgency={selectedAgency}
          directDiscount={directDiscount}
          setDirectDiscount={setDirectDiscount}
          onApply={handleApplyDirectDiscount}
          isPending={applyDirectMutation.isPending}
        />
      )}
    </>
  );
}

// ==================== Reusable Discount Modal ====================

interface ReusableDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ReusableDiscountModal({ isOpen, onClose }: ReusableDiscountModalProps) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [usageLimit, setUsageLimit] = useState(1000);
  const [singleUse, setSingleUse] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const createMutation = useCreateDiscountCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        code,
        discountPercentage,
        applicability: 'GLOBAL',
        usageLimit,
        singleUse,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date('2099-12-31'),
      });
      setCode('');
      setDiscountPercentage(10);
      setUsageLimit(1000);
      setSingleUse(false);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      onClose();
    } catch (error) {
      console.error('Error creating reusable discount:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header verde */}
        <div className="bg-[#00E676] px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-green-800 font-bold text-lg">R</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Código Reutilizable</h3>
                <p className="text-xs text-green-700">Código con múltiples usos permitidos</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-green-300 rounded-lg transition-colors text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Código de Descuento</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: REUTILIZABLE20"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">% Descuento</label>
              <input
                type="number" min="1" max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Límite de Usos</label>
              <input
                type="number" min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Inicio</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </form>
        <div className="flex gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
          <button type="submit" onClick={handleSubmit} disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/30 disabled:opacity-50">
            {createMutation.isPending ? 'Creando...' : 'Crear Código Reutilizable'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==================== User Discount Modal ====================

interface UserDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserDiscountModal({ isOpen, onClose }: UserDiscountModalProps) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [usageLimit, setUsageLimit] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const createMutation = useCreateDiscountCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        code,
        discountPercentage,
        applicability: 'USER_SPECIFIC',
        usageLimit,
        singleUse: true,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date('2099-12-31'),
      });
      setCode('');
      setDiscountPercentage(10);
      setUsageLimit(1);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      onClose();
    } catch (error) {
      console.error('Error creating user discount:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header verde */}
        <div className="bg-[#00E676] px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-green-800 font-bold text-lg">U</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Descuento para Usuario</h3>
                <p className="text-xs text-green-700">Código para un usuario específico</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-green-300 rounded-lg transition-colors text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Código de Descuento</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: USUARIO20"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">% Descuento</label>
              <input type="number" min="1" max="100" value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Límite de Usos</label>
              <input type="number" min="1" value={usageLimit} onChange={(e) => setUsageLimit(Number(e.target.value))} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Inicio</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </form>
        <div className="flex gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
          <button type="submit" onClick={handleSubmit} disabled={createMutation.isPending} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/30 disabled:opacity-50">
            {createMutation.isPending ? 'Creando...' : 'Crear Descuento para Usuario'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==================== Main Component ====================

interface UniversalDiscountApplierProps {
  onDiscountApplied?: () => void;
}

export default function UniversalDiscountApplier({ onDiscountApplied }: UniversalDiscountApplierProps) {
  const [activeModal, setActiveModal] = useState<DiscountType | null>(null);

  const handleClose = useCallback(() => {
    setActiveModal(null);
    if (onDiscountApplied) onDiscountApplied();
  }, [onDiscountApplied]);

  const isAgentModalOpen = activeModal === 'AGENT' || activeModal === 'PLAN';
  const isAgencyModalOpen = activeModal === 'AGENCY';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Aplicador Universal de Descuentos</h3>
        <p className="text-sm text-gray-500">Selecciona el tipo de descuento que deseas aplicar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISCOUNT_OPTIONS.map((option) => (
          <DiscountTypeCard
            key={option.type}
            option={option}
            onClick={() => setActiveModal(option.type)}
          />
        ))}
      </div>

      <GlobalDiscountModal
        isOpen={activeModal === 'GLOBAL'}
        onClose={handleClose}
      />

      <UserDiscountModal
        isOpen={activeModal === 'USER'}
        onClose={handleClose}
      />

      <Modal isOpen={isAgentModalOpen} onClose={handleClose}>
        <AgentDiscountContent onClose={handleClose} />
      </Modal>

      {isAgencyModalOpen && (
        <AgencyDiscountContent isOpen={isAgencyModalOpen} onClose={handleClose} />
      )}

      <ReusableDiscountModal
        isOpen={activeModal === 'REUSABLE'}
        onClose={handleClose}
      />
    </div>
  );
}
