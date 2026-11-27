'use client';

import { useState } from 'react';
import { Globe2 } from 'lucide-react';
import { useCreateDiscountCode } from '@/presentation/hooks/useAdmin';
import {
  DiscountFormFooter,
  DiscountFormModalShell,
} from '@/presentation/components/admin/discounts/components/modals';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalDiscountModal({ isOpen, onClose }: Props) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [usageLimit, setUsageLimit] = useState(100);
  const [singleUse, setSingleUse] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const createMutation = useCreateDiscountCode();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
    <DiscountFormModalShell
      isOpen={isOpen}
      onClose={onClose}
      tone="emerald"
      icon={<Globe2 className="h-5 w-5" aria-hidden="true" />}
      title="Descuento Global"
      subtitle="Código válido para todos los usuarios"
      footer={
        <DiscountFormFooter
          tone="emerald"
          onClose={onClose}
          onSubmit={() => void handleSubmit()}
          isPending={createMutation.isPending}
          label="Crear Descuento Global"
          pendingLabel="Creando..."
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
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
    </DiscountFormModalShell>
  );
}
