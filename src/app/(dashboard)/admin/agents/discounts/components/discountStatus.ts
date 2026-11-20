export interface DiscountStatusConfig {
  className: string;
  label: string;
}

export const DISCOUNT_STATUS_CONFIG: Record<string, DiscountStatusConfig> = {
  ACTIVE: { className: 'agent-discounts__status-badge--active', label: 'Activo' },
  EXPIRED: { className: 'agent-discounts__status-badge--expired', label: 'Expirado' },
  USED: { className: 'agent-discounts__status-badge--used', label: 'Usado' },
  CANCELLED: { className: 'agent-discounts__status-badge--cancelled', label: 'Cancelado' },
};

export function getDiscountStatusConfig(status: string): DiscountStatusConfig {
  return DISCOUNT_STATUS_CONFIG[status] ?? DISCOUNT_STATUS_CONFIG.CANCELLED;
}
