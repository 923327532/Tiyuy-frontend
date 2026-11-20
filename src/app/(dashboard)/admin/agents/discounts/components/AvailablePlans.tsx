'use client';

import { AgentPlan } from '../hooks/useAgentDiscountsPage';

const PLANS: AgentPlan[] = [
  { code: 'ENTERPRISE', name: 'Plan Empresarial', price: 'S/399', color: 'bg-slate-600' },
  { code: 'ENTERPRISE_TRIAL', name: 'Prueba Empresarial', price: 'S/299', color: 'bg-slate-500' },
  { code: 'PRO', name: 'Plan Pro', price: 'S/99', color: 'bg-slate-600' },
  { code: 'BASIC', name: 'Plan Basico', price: 'S/29', color: 'bg-stone-500' },
  { code: 'FREE', name: 'Plan Gratis', price: 'S/0', color: 'bg-slate-400' },
];

interface AvailablePlansProps {
  show: boolean;
  onSelectPlan: (plan: AgentPlan) => void;
}

export function AvailablePlans({ show, onSelectPlan }: AvailablePlansProps) {
  if (!show) return null;

  return (
    <section className="agent-discounts__surface" aria-label="Planes disponibles">
      <div className="agent-discounts__card-header">
        <div>
          <h2 className="agent-discounts__section-title">
            <span className="agent-discounts__step">2</span>
            Planes Disponibles - Aplicar Descuento
          </h2>
          <p className="agent-discounts__card-hint">
            Selecciona un plan para crear un descuento personalizado para este agente.
          </p>
        </div>
      </div>
      <div className="agent-discounts__card-body">
        <div className="agent-discounts__plan-grid">
          {PLANS.map((plan) => (
            <div key={plan.code} className="agent-discounts__plan-card">
              <div className="agent-discounts__plan-icon">{plan.code[0]}</div>
              <div className="agent-discounts__plan-name" title={plan.name}>{plan.name}</div>
              <div className="agent-discounts__plan-price">{plan.price}</div>
              <button
                type="button"
                className="agent-discounts__plan-action"
                onClick={() => onSelectPlan(plan)}
              >
                Aplicar Descuento
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
