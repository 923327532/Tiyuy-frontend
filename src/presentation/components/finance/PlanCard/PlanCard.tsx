'use client';

import { Icon } from '@iconify/react';
import { SubscriptionPlan, BillingCycle } from '@/core/domain/entities/Wallet';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isSelected?: boolean;
  isExhausted?: boolean;
  isActive?: boolean;
  discountPercentage?: number;
  hasDiscount?: boolean;
  canRenew?: boolean;
  isExpired?: boolean;
  isExhaustedByLimit?: boolean;
  selectedBillingCycle?: BillingCycle;
  onBillingCycleChange?: (cycle: BillingCycle) => void;
  /**
   * Precio personalizado con descuento de agencia (desde `AgencyPlanDiscount` del admin).
   * Cuando se proporciona, anula `plan.price` y muestra el descuento automáticamente.
   */
  agencyDiscountPrice?: number;
  /** Precio original del plan (para mostrar el tachado cuando hay descuento) */
  agencyOriginalPrice?: number;
}

export function PlanCard({ plan, onSelectPlan, isSelected, isExhausted, isActive, discountPercentage, hasDiscount, canRenew, isExpired, isExhaustedByLimit, selectedBillingCycle, onBillingCycleChange, agencyDiscountPrice, agencyOriginalPrice }: PlanCardProps) {
  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? 'US$' : 'S/';
    return `${symbol} ${price.toLocaleString()}`;
  };

  // Calcular el precio base: usar agencyDiscountPrice si existe, sino plan.price
  const basePrice = agencyDiscountPrice ?? plan.price;
  const hasAgencyDiscountApplied = agencyDiscountPrice != null && agencyOriginalPrice != null && agencyDiscountPrice < agencyOriginalPrice;

  const getPriceForCycle = (cycle: BillingCycle): number => {
    const priceToUse = agencyDiscountPrice ?? plan.price;
    switch (cycle) {
      case 'QUARTERLY':
        return plan.priceQuarterly || (priceToUse * 3 * 0.9);
      case 'YEARLY':
        return plan.priceYearly || (priceToUse * 12 * 0.8);
      default:
        return priceToUse;
    }
  };

  const currentCycle = selectedBillingCycle || 'MONTHLY';
  const currentPrice = getPriceForCycle(currentCycle);
  const calcDiscountPct = hasAgencyDiscountApplied && agencyOriginalPrice && agencyDiscountPrice
    ? Math.round((1 - agencyDiscountPrice / agencyOriginalPrice) * 100)
    : discountPercentage || 0;
  const hasPriceDiscount = (hasAgencyDiscountApplied || (hasDiscount && discountPercentage != null && discountPercentage > 0));
  const finalPrice = hasPriceDiscount && !hasAgencyDiscountApplied
    ? currentPrice * (1 - (discountPercentage || 0) / 100)
    : currentPrice;

  const isPopular = plan.isFeatured && !isExhausted && !isActive && !isExpired;

  return (
    <div className={`relative rounded-2xl p-4 transition-all duration-300 h-full flex flex-col overflow-hidden ${
      isActive && !isExhausted && !isExpired
        ? 'bg-yellow-50 border-2 border-yellow-400 shadow-lg pt-6'
        : isExhausted || isExpired
        ? 'bg-gray-100 border-2 border-orange-300 shadow-md pt-6'
        : isPopular 
          ? 'bg-white border-2 border-orange-400 shadow-xl pt-6' 
          : 'bg-white border-2 border-[var(--brand-primary)] shadow-md hover:shadow-lg pt-6'
    }`}>
      
      {/* Barra superior de color: naranja para popular, verde para normal */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        isPopular ? 'bg-orange-400' : 'bg-[var(--brand-primary)]'
      }`} />

      <div className="mb-2">
        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
        <p className="text-gray-500 text-xs mt-1 leading-tight">{plan.description}</p>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(finalPrice, plan.currency)}
          </span>
        </div>
        <p className="text-gray-400 text-xs mt-0.5">/mes</p>
        
        {hasPriceDiscount && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 line-through text-xs">
              {formatPrice(agencyOriginalPrice ?? currentPrice, plan.currency)}
            </span>
            <span className="bg-[var(--brand-primary-light)] text-[var(--brand-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {calcDiscountPct > 0 ? calcDiscountPct : discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>

      {!isActive && !isExhausted && !isExpired && plan.id !== 'FREE' && (
        <div className="mb-3">
          <div className="flex gap-1.5 mb-2">
            <button
              onClick={() => onBillingCycleChange?.('MONTHLY')}
              className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors ${
                currentCycle === 'MONTHLY'
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mensual
            </button>
            {(plan.priceQuarterly ?? 0) !== 0 && (
              <button
                onClick={() => onBillingCycleChange?.('QUARTERLY')}
                className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors ${
                  currentCycle === 'QUARTERLY'
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Trimestral
              </button>
            )}
            {(plan.priceYearly ?? 0) !== 0 && (
              <button
                onClick={() => onBillingCycleChange?.('YEARLY')}
                className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors ${
                  currentCycle === 'YEARLY'
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Anual
              </button>
            )}
          </div>
          
          {currentCycle !== 'MONTHLY' && (
            <div className="flex justify-center gap-2">
              {currentCycle === 'QUARTERLY' && (
                <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  10% OFF
                </span>
              )}
              {currentCycle === 'YEARLY' && (
                <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  20% OFF
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {plan.id !== 'FREE' && (
        <p className="text-gray-400 text-xs mb-3">
          {currentCycle === 'MONTHLY' && '30 días'}
          {currentCycle === 'QUARTERLY' && '90 días (3 meses)'}
          {currentCycle === 'YEARLY' && '365 días (1 año)'}
        </p>
      )}

      <div className="space-y-1.5 mb-3 flex-1">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Icon 
              icon="material-symbols:check-circle-rounded" 
              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                isExhausted && !isActive ? 'text-gray-300' : 'text-[var(--brand-primary)]'
              }`}
            />
            <span className={`text-xs ${
              isExhausted && !isActive ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-100">
        <p className="text-gray-500 text-xs mb-2 text-center">
          {plan.maxPublications} publicaciones
        </p>

        <button
          onClick={() => {
            if (!isExhausted && !isActive && !isExpired) {
              onSelectPlan(plan);
            } else if (canRenew && isActive) {
              onSelectPlan(plan);
            }
          }}
          disabled={
            (isActive && !isExhausted && !isExpired) || 
            (isExhausted && plan.id === 'FREE') || 
            (isExhaustedByLimit && !canRenew) ||
            (isExpired && !canRenew)
          }
          className={`w-full py-3.5 rounded-xl cursor-pointer font-semibold text-base transition-all ${
            canRenew && isActive
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg animate-pulse'
              : isExhaustedByLimit && !canRenew
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isExpired && !canRenew
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isExhausted && !isActive
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isActive
              ? 'bg-gray-100 text-gray-400 cursor-default'
              : isSelected && !isExhausted && !isActive && !isExpired
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
              : plan.name.includes('PREMIUM') || plan.name.includes('ENTERPRISE')
              ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light-hover)]'
              : 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]'
          } ${isSelected && !isExhausted && !isActive && !isExpired ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
        >
          {canRenew && isActive ? 'Renovar Plan' : 
           isExhaustedByLimit && !canRenew ? 'Plan Agotado' : 
           isExpired && !canRenew ? 'Plan Vencido' :
           isExhausted && !isActive ? 'Plan Agotado' : 
           isExhausted && isActive && plan.id === 'FREE' ? 'Plan Consumido' :
           isActive ? 'Plan Activo' : 
           `Elegir ${plan.name}`}
        </button>
      </div>

      {isActive && !isExhausted && !isExpired && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Plan Activo</span>
          <Icon icon="material-symbols:check-circle" className="w-6 h-6 text-yellow-500" />
        </div>
      )}
    </div>
  );
}
