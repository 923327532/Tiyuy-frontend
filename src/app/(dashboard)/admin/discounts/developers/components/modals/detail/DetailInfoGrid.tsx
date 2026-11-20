/**
 * Information grid for Developer Subscription Discount Detail Modal
 */

import { Building2, Percent, DollarSign, Calendar, AlertTriangle, RefreshCcw, CreditCard, User, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { DeveloperSubscriptionDiscount } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { getDiscountDisplay } from './detailHelpers';

export default function DetailInfoGrid({ discount }: { discount: DeveloperSubscriptionDiscount }) {
  const isExpired = discount.validUntil && new Date(discount.validUntil) < new Date();
  const usagePercentage = discount.usageLimit ? Math.round((discount.currentUsage / discount.usageLimit) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {/* Inmobiliaria */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Building2 className="h-3 w-3" /> Inmobiliaria
        </h4>
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{discount.developerName}</div>
          {discount.developerRuc && (
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <span className="font-mono">{discount.developerRuc}</span>
            </div>
          )}
          <div className="text-[10px] text-gray-500">ID: {discount.developerId}</div>
        </div>
      </div>

      {/* Descuento */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          {discount.type === 'PERCENTAGE' ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />} Valor del Descuento
        </h4>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-teal-700">{getDiscountDisplay(discount)}</div>
          {(discount.maxDiscountPen || discount.maxDiscountUsd) && (
            <div className="text-sm text-gray-600">
              Tope máximo: {discount.maxDiscountPen ? `S/${discount.maxDiscountPen.toLocaleString()}` : ''} {discount.maxDiscountUsd ? `$${discount.maxDiscountUsd.toLocaleString()}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Vigencia */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Vigencia
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Desde: <strong>{format(new Date(discount.validFrom), 'dd/MM/yyyy')}</strong></span>
          </div>
          {discount.validUntil ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Hasta: <strong>{format(new Date(discount.validUntil), 'dd/MM/yyyy')}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Sin fecha de expiración</span>
            </div>
          )}
          {isExpired && discount.status === 'ACTIVE' && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>¡Descuento expirado!</span>
            </div>
          )}
        </div>
      </div>

      {/* Usos */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <RefreshCcw className="h-3 w-3" /> Uso del Descuento
        </h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Usos actuales</span>
            <span className="font-semibold text-gray-900">{discount.currentUsage}</span>
          </div>
          {discount.usageLimit ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Límite total</span>
                <span className="font-semibold text-gray-900">{discount.usageLimit}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${usagePercentage >= 80 ? 'bg-red-500' : usagePercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-gray-500 text-right">{usagePercentage}% usado</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Restantes</span>
                <span className="font-semibold text-gray-900">{discount.usageLimit - discount.currentUsage}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">Sin límite de usos (ilimitado)</div>
          )}
        </div>
      </div>

      {/* Planes aplicables */}
      <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <CreditCard className="h-3 w-3" /> Planes aplicables
        </h4>
        {discount.applicablePlanCodes && discount.applicablePlanCodes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {discount.applicablePlanCodes.map(plan => (
              <span key={plan} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-700">
                {plan}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Todos los planes</span>
        )}
      </div>

      {/* Motivo administrativo */}
      <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <User className="h-3 w-3" /> Motivo administrativo
        </h4>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{discount.adminReason}</p>
      </div>

      {/* Auditoría */}
      <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <RotateCcw className="h-3 w-3" /> Auditoría
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-gray-400">Creado por</div>
            <div className="text-sm font-medium text-gray-900">{discount.createdByName} (ID: {discount.createdBy})</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">Fecha de creación</div>
            <div className="text-sm font-medium text-gray-900">{format(new Date(discount.createdAt), 'dd/MM/yyyy HH:mm')}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">Última actualización</div>
            <div className="text-sm font-medium text-gray-900">{format(new Date(discount.updatedAt), 'dd/MM/yyyy HH:mm')}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">Estado de validez</div>
            <div className="text-sm font-medium text-gray-900">{discount.isValid ? 'Válido' : 'Inválido'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
