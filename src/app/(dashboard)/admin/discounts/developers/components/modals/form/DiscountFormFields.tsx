/**
 * Discount value/scope/limits fields for Developer Subscription Discount Form Modal
 */

import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import { Percent, DollarSign } from 'lucide-react';
import { DiscountType, DiscountApplicabilityScope } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { FormData, FormErrors, SCOPE_OPTIONS } from './formConfig';

interface DiscountFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
}

export default function DiscountFormFields({ formData, setFormData, errors }: DiscountFormFieldsProps) {
  return (
    <>
      {/* Tipo de descuento */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-gray-700">Tipo de Descuento *</label>
        <div className="flex gap-3 sm:gap-4">
          <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer transition-colors bg-white hover:bg-teal-50 border-teal-200">
            <input
              type="radio"
              name="discountType"
              value="PERCENTAGE"
              checked={formData.type === 'PERCENTAGE'}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DiscountType }))}
              className="text-teal-600 focus:ring-teal-500"
            />
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-900">Porcentaje</span>
            </div>
          </label>
          <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer transition-colors bg-white hover:bg-teal-50 border-teal-200">
            <input
              type="radio"
              name="discountType"
              value="FIXED_AMOUNT"
              checked={formData.type === 'FIXED_AMOUNT'}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DiscountType }))}
              className="text-teal-600 focus:ring-teal-500"
            />
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-900">Importe Fijo</span>
            </div>
          </label>
        </div>
      </div>

      {/* Valor del descuento - Porcentaje */}
      {formData.type === 'PERCENTAGE' && (
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-gray-700">Porcentaje de Descuento (%) *</label>
          <div className="relative">
            <Input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              value={formData.percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
              placeholder="Ej: 20"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 font-bold text-sm">%</span>
          </div>
          {errors.percentage && <p className="text-[10px] text-red-600">{errors.percentage}</p>}
          <p className="text-[10px] text-gray-500">Entre 0.01% y 100%. Ej: plan S/100 con 20% = S/80</p>
        </div>
      )}

      {/* Valor del descuento - Importe fijo */}
      {formData.type === 'FIXED_AMOUNT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">Importe PEN (S/)</label>
            <div className="relative">
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.amountPen}
                onChange={(e) => setFormData(prev => ({ ...prev, amountPen: e.target.value }))}
                placeholder="Ej: 50"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">S/</span>
            </div>
            {errors.amountPen && <p className="text-[10px] text-red-600">{errors.amountPen}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">Importe USD ($)</label>
            <div className="relative">
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.amountUsd}
                onChange={(e) => setFormData(prev => ({ ...prev, amountUsd: e.target.value }))}
                placeholder="Ej: 15"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">$</span>
            </div>
            {errors.amountUsd && <p className="text-[10px] text-red-600">{errors.amountUsd}</p>}
          </div>
          <p className="text-[10px] text-gray-500 sm:col-span-2">Al menos un importe es obligatorio. Se aplicará según la moneda del plan.</p>
        </div>
      )}

      {/* Alcance de aplicabilidad */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-gray-700">Aplicable a *</label>
        <Select
          value={formData.applicabilityScope}
          onChange={(v: string) => setFormData(prev => ({ ...prev, applicabilityScope: v as DiscountApplicabilityScope }))}
          options={SCOPE_OPTIONS}
          placeholder="Seleccionar alcance"
        />
        <p className="text-[10px] text-gray-500">Define en qué operaciones se aplica el descuento</p>
      </div>

      {/* Planes aplicables */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-gray-700">Planes aplicables (opcional)</label>
        <Input
          type="text"
          value={formData.applicablePlanCodes}
          onChange={(e) => setFormData(prev => ({ ...prev, applicablePlanCodes: e.target.value }))}
          placeholder="Ej: ENTERPRISE, PRO, BASIC (dejar vacío para todos)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
        />
        <p className="text-[10px] text-gray-500">Códigos de plan separados por comas. Vacío = todos los planes.</p>
      </div>

      {/* Límites máximos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-gray-700">Descuento máximo PEN (S/)</label>
          <div className="relative">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.maxDiscountPen}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountPen: e.target.value }))}
              placeholder="Opcional"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">S/</span>
          </div>
          {errors.maxDiscountPen && <p className="text-[10px] text-red-600">{errors.maxDiscountPen}</p>}
          <p className="text-[10px] text-gray-500">Tope máximo de descuento en soles</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-gray-700">Descuento máximo USD ($)</label>
          <div className="relative">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.maxDiscountUsd}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountUsd: e.target.value }))}
              placeholder="Opcional"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">$</span>
          </div>
          {errors.maxDiscountUsd && <p className="text-[10px] text-red-600">{errors.maxDiscountUsd}</p>}
          <p className="text-[10px] text-gray-500">Tope máximo de descuento en dólares</p>
        </div>
      </div>

      {/* Límite de usos */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-gray-700">Límite total de usos (opcional)</label>
        <Input
          type="number"
          min="1"
          value={formData.usageLimit}
          onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
          placeholder="Dejar vacío para ilimitado"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {errors.usageLimit && <p className="text-[10px] text-red-600">{errors.usageLimit}</p>}
        <p className="text-[10px] text-gray-500">Cuántas veces se puede usar este descuento en total</p>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-gray-700">Fecha de inicio *</label>
          <Input
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.validFrom && <p className="text-[10px] text-red-600">{errors.validFrom}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-gray-700">Fecha de fin (opcional)</label>
          <Input
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.validUntil && <p className="text-[10px] text-red-600">{errors.validUntil}</p>}
          <p className="text-[10px] text-gray-500">Vacío = sin expiración</p>
        </div>
      </div>

      {/* Motivo administrativo */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-gray-700">Motivo administrativo *</label>
        <textarea
          value={formData.adminReason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, adminReason: e.target.value }))}
          placeholder="Ej: Descuento por fidelidad, campaña comercial, acuerdo estratégico..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[80px]"
          rows={3}
        />
        {errors.adminReason && <p className="text-[10px] text-red-600">{errors.adminReason}</p>}
        <p className="text-[10px] text-gray-500">Justificación interna para auditoría</p>
      </div>
    </>
  );
}
