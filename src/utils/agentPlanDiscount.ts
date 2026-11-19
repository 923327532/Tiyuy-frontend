export interface PlanDiscountForm {
  discountPercentage: string;
  customPrice: string;
  startDate: string;
  endDate: string;
}

export interface AgentPlanDiscountPayload {
  planCode: string;
  discountPercentage?: number;
  customPricePen?: number;
  validFrom?: string;
  validUntil?: string;
  notes?: string;
}

const toIso = (value: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

/**
 * Valida el formulario y arma el payload. El backend acepta porcentaje O precio fijo,
 * nunca ambos: si hay porcentaje, el precio fijo del formulario es solo una vista previa.
 * Devuelve { error } con un mensaje claro si algo está mal.
 */
export function buildAgentPlanDiscountPayload(
  planCode: string,
  form: PlanDiscountForm,
  notes?: string
): { ok: true; payload: AgentPlanDiscountPayload } | { ok: false; error: string } {
  const percentage = form.discountPercentage.trim() === '' ? NaN : Number(form.discountPercentage);
  const customPrice = form.customPrice.trim() === '' ? NaN : Number(form.customPrice);

  if (!planCode) return { ok: false, error: 'Selecciona un plan.' };
  if (Number.isNaN(percentage) && Number.isNaN(customPrice)) {
    return { ok: false, error: 'Ingresa un porcentaje de descuento (1 a 100).' };
  }
  if (!Number.isNaN(percentage) && (percentage <= 0 || percentage > 100)) {
    return { ok: false, error: 'El porcentaje debe ser mayor que 0 y como máximo 100.' };
  }
  if (Number.isNaN(percentage) && customPrice <= 0) {
    return { ok: false, error: 'El precio fijo debe ser mayor que 0.' };
  }

  const validFrom = toIso(form.startDate);
  const validUntil = toIso(form.endDate);
  if (validFrom && validUntil && new Date(validUntil) <= new Date(validFrom)) {
    return { ok: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio.' };
  }
  if (validUntil && new Date(validUntil) < new Date()) {
    return { ok: false, error: 'La fecha de fin ya pasó.' };
  }

  return {
    ok: true,
    payload: {
      planCode,
      ...(!Number.isNaN(percentage) ? { discountPercentage: percentage } : { customPricePen: customPrice }),
      validFrom,
      validUntil,
      notes,
    },
  };
}

/** Extrae el mensaje legible de un error de la API (message o detalle de validación). */
export function getApiErrorMessage(error: any, fallback: string): string {
  const data = error?.response?.data;
  if (data?.details && typeof data.details === 'object') {
    const first = Object.values(data.details)[0];
    if (typeof first === 'string' && first) return first;
  }
  if (typeof data?.message === 'string' && data.message) return data.message;
  if (error?.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor. Revisa tu conexión.';
  return fallback;
}
