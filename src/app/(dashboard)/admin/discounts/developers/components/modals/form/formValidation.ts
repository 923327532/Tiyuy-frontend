/**
 * Validation logic for Developer Subscription Discount Form Modal
 */

import { FormData, FormErrors } from './formConfig';

export function validateForm(formData: FormData): FormErrors {
  const newErrors: FormErrors = {};

  if (!formData.developerId) {
    newErrors.developerId = 'Selecciona una inmobiliaria';
  }

  if (formData.type === 'PERCENTAGE') {
    const percentage = parseFloat(formData.percentage);
    if (!formData.percentage) {
      newErrors.percentage = 'El porcentaje es obligatorio';
    } else if (isNaN(percentage) || percentage < 0.01 || percentage > 100) {
      newErrors.percentage = 'El porcentaje debe estar entre 0.01 y 100';
    }
  } else {
    const amountPen = parseFloat(formData.amountPen);
    const amountUsd = parseFloat(formData.amountUsd);
    if (!formData.amountPen && !formData.amountUsd) {
      newErrors.amountPen = 'Debe ingresar al menos un importe (PEN o USD)';
    }
    if (formData.amountPen && (isNaN(amountPen) || amountPen <= 0)) {
      newErrors.amountPen = 'El importe PEN debe ser positivo';
    }
    if (formData.amountUsd && (isNaN(amountUsd) || amountUsd <= 0)) {
      newErrors.amountUsd = 'El importe USD debe ser positivo';
    }
  }

  if (!formData.validFrom) {
    newErrors.validFrom = 'La fecha de inicio es obligatoria';
  }

  if (formData.validUntil && formData.validFrom) {
    if (new Date(formData.validUntil) < new Date(formData.validFrom)) {
      newErrors.validUntil = 'La fecha de fin debe ser posterior a la de inicio';
    }
  }

  if (!formData.adminReason.trim()) {
    newErrors.adminReason = 'El motivo administrativo es obligatorio';
  }

  if (formData.usageLimit) {
    const limit = parseInt(formData.usageLimit);
    if (isNaN(limit) || limit < 1) {
      newErrors.usageLimit = 'El límite de usos debe ser un número positivo';
    }
  }

  if (formData.maxDiscountPen) {
    const max = parseFloat(formData.maxDiscountPen);
    if (isNaN(max) || max <= 0) {
      newErrors.maxDiscountPen = 'El descuento máximo PEN debe ser positivo';
    }
  }

  if (formData.maxDiscountUsd) {
    const max = parseFloat(formData.maxDiscountUsd);
    if (isNaN(max) || max <= 0) {
      newErrors.maxDiscountUsd = 'El descuento máximo USD debe ser positivo';
    }
  }

  return newErrors;
}
