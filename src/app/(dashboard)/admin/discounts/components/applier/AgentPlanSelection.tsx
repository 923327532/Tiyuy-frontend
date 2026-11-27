'use client';

import { ChevronRight } from 'lucide-react';
import type { DiscountPlan } from './discountPlans';

interface Props {
  plans: DiscountPlan[];
  agentName: string;
  onBack: () => void;
  onSelect: (plan: DiscountPlan) => void;
}

/** Lista de planes disponibles para descuento por agente. */
export default function AgentPlanSelection({ plans, agentName, onBack, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={onBack} className="text-sm text-teal-600 hover:text-teal-700">
          &larr; Volver
        </button>
        <span className="text-sm text-gray-400">|</span>
        <p className="text-sm text-gray-600">
          Agente: <span className="font-semibold text-teal-600">{agentName}</span>
        </p>
      </div>
      <h4 className="font-semibold text-gray-900 mb-3">Selecciona un plan para aplicar descuento:</h4>
      <div className="grid grid-cols-1 gap-3">
        {plans.map((plan) => (
          <button
            key={plan.code}
            type="button"
            onClick={() => onSelect(plan)}
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
  );
}
