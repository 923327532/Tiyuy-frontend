'use client';

import { useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import {
  useDeveloperDiscountTargets, useCreateDeveloperDiscountCode, useApplyDirectDiscount,
} from '@/presentation/hooks/admin/useDevelopers';
import type {
  DeveloperDiscountTarget, CreateInmobiliariaDiscountRequest, ApplyDirectDiscountRequest,
} from '@/core/domain/entities/Admin';
import {
  DiscountFormModalShell, ModalDropdownPortal,
} from '@/presentation/components/admin/discounts/components/modals';
import ApplyDirectDiscountModal from '@/app/(dashboard)/admin/agencies/components/ApplyDirectDiscountModal';
import CreateAgencyDiscountModal from '@/app/(dashboard)/admin/agencies/components/CreateAgencyDiscountModal';

interface Props { isOpen: boolean; onClose: () => void }
type Mode = 'select' | 'create' | 'direct';

/** Flujo completo de descuentos para una inmobiliaria. */
export default function AgencyDiscountContent({ isOpen, onClose }: Props) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [agency, setAgency] = useState<DeveloperDiscountTarget | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState<Mode>('select');
  const [newDiscount, setNewDiscount] = useState({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
  const [directDiscount, setDirectDiscount] = useState({
    discountPercentage: '', reason: '', notifyAgency: false,
    applyToAllAgents: false, maxAgents: '', expiresAt: '',
  });

  const { data, isLoading, isError } = useDeveloperDiscountTargets(query);
  const agencies = data?.content || [];
  const createMutation = useCreateDeveloperDiscountCode();
  const applyMutation = useApplyDirectDiscount();

  const resetAndClose = () => {
    setAgency(null); setQuery(''); setMode('select');
    setNewDiscount({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
    setDirectDiscount({ discountPercentage: '', reason: '', notifyAgency: false, applyToAllAgents: false, maxAgents: '', expiresAt: '' });
    onClose();
  };

  const handleCreateDiscount = async () => {
    if (!agency) return;
    try {
      const request: CreateInmobiliariaDiscountRequest = {
        inmobiliariaId: agency.id,
        code: newDiscount.code,
        discountPercentage: Number(newDiscount.discountPercentage),
        validFrom: newDiscount.startDate ? new Date(newDiscount.startDate) : undefined,
        validUntil: newDiscount.endDate ? new Date(newDiscount.endDate) : undefined,
        maxUses: newDiscount.usageLimit ? Number(newDiscount.usageLimit) : undefined,
      };
      await createMutation.mutateAsync({ developerId: agency.id, data: request });
      resetAndClose();
    } catch (error) { console.error('Error creating agency discount:', error); }
  };

  const handleApplyDirectDiscount = async () => {
    if (!agency) return;
    try {
      const request: ApplyDirectDiscountRequest = {
        discountPercentage: Number(directDiscount.discountPercentage),
        reason: directDiscount.reason,
        applyToAllAgents: directDiscount.applyToAllAgents,
        maxAgents: directDiscount.maxAgents ? Number(directDiscount.maxAgents) : undefined,
        expiresAt: directDiscount.expiresAt ? new Date(directDiscount.expiresAt) : undefined,
      };
      await applyMutation.mutateAsync({ developerId: agency.id, data: request });
      resetAndClose();
    } catch (error) { console.error('Error applying direct discount:', error); }
  };

  if (mode !== 'select') {
    return (
      <>
        {mode === 'create' && agency && (
          <CreateAgencyDiscountModal isOpen={isOpen} onClose={() => setMode('select')}
            selectedAgency={agency} newDiscount={newDiscount} setNewDiscount={setNewDiscount}
            onCreate={handleCreateDiscount} isPending={createMutation.isPending} />
        )}
        {mode === 'direct' && agency && (
          <ApplyDirectDiscountModal isOpen={isOpen} onClose={() => setMode('select')}
            selectedAgency={agency} directDiscount={directDiscount} setDirectDiscount={setDirectDiscount}
            onApply={handleApplyDirectDiscount} isPending={applyMutation.isPending} />
        )}
      </>
    );
  }

  return (
    <DiscountFormModalShell
      isOpen={isOpen} onClose={onClose} tone="emerald" size="lg"
      icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
      title="Descuento para Inmobiliaria"
      subtitle="Asigna un descuento a una inmobiliaria"
      footer={<span className="text-xs text-slate-400">Selecciona una inmobiliaria para continuar</span>}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="agency-discount-search" className="block text-sm font-semibold text-gray-700 mb-2">
            Buscar inmobiliaria
          </label>
          <div ref={inputRef} className="relative">
            <input
              id="agency-discount-search"
              placeholder="Nombre, representante, RUC o correo..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setAgency(null); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            />
            {showDropdown && query.trim() && (
              <ModalDropdownPortal anchorRef={inputRef} onClose={() => setShowDropdown(false)}>
                {isLoading && <p className="px-3 py-2.5 text-sm text-slate-500">Buscando inmobiliarias...</p>}
                {!isLoading && isError && <p className="px-3 py-2.5 text-sm text-red-600">No se pudo cargar la búsqueda. Intenta nuevamente.</p>}
                {!isLoading && !isError && agencies.length === 0 && <p className="px-3 py-2.5 text-sm text-slate-500">No se encontraron inmobiliarias con esos datos.</p>}
                {!isLoading && !isError && agencies.map((item) => (
                  <button key={item.id} type="button" role="option"
                    onClick={() => {
                      const target: DeveloperDiscountTarget = {
                        id: item.id,
                        name: item.companyName || item.managerName || item.email,
                        ruc: item.ruc, email: item.email, managerName: item.managerName,
                      };
                      setAgency(target); setShowDropdown(false); setQuery(target.name);
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50">
                    <div className="text-sm font-semibold text-slate-900">{item.companyName || item.email}</div>
                    {item.managerName && <div className="mt-0.5 text-xs text-slate-600">Representante: {item.managerName}</div>}
                    <div className="mt-0.5 text-xs text-slate-500">
                      {[item.ruc && `RUC: ${item.ruc}`, item.email].filter(Boolean).join(' · ')}
                    </div>
                  </button>
                ))}
              </ModalDropdownPortal>
            )}
          </div>
          {!showDropdown && !query.trim() && (
            <p className="mt-2 text-xs text-gray-500">Escribe al menos un dato para buscar.</p>
          )}
        </div>

        {agency && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Inmobiliaria seleccionada</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{agency.name}</p>
            <p className="text-xs text-gray-600 mt-0.5">RUC: {agency.ruc}</p>
          </div>
        )}

        {agency && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button type="button" onClick={() => setMode('create')} className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-600/20 transition-all">
              Crear código
            </button>
            <button type="button" onClick={() => setMode('direct')} className="w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-semibold">
              Aplicar descuento directo
            </button>
          </div>
        )}
      </div>
    </DiscountFormModalShell>
  );
}
