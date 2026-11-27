/** Planes disponibles para aplicar descuentos por plan de agente. */
export interface DiscountPlan {
  code: string;
  name: string;
  price: string;
  color: string;
}

export const PLANS: DiscountPlan[] = [
  { code: 'ENTERPRISE', name: 'Plan Empresarial', price: 'S/399', color: 'bg-teal-600' },
  { code: 'ENTERPRISE_TRIAL', name: 'Prueba Empresarial', price: 'S/299', color: 'bg-teal-500' },
  { code: 'PRO', name: 'Plan Pro', price: 'S/99', color: 'bg-blue-600' },
  { code: 'BASIC', name: 'Plan Basico', price: 'S/29', color: 'bg-orange-500' },
  { code: 'FREE', name: 'Plan Gratis', price: 'S/0', color: 'bg-gray-500' },
];
