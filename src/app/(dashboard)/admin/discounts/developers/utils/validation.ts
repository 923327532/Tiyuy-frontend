/**
 * Validation utilities for Developer Subscription Discounts
 */

import {
  CreateDeveloperSubscriptionDiscountRequest,
  UpdateDeveloperSubscriptionDiscountRequest,
  DiscountType,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';

export interface ValidationErrors {
  developerId?: string;
  type?: string;
  percentage?: string;
  amountPen?: string;
  amountUsd?: string;
  applicabilityScope?: string;
  applicablePlanCodes?: string;
  maxDiscountPen?: string;
  maxDiscountUsd?: string;
  usageLimit?: string;
  validFrom?: string;
  validUntil?: string;
  adminReason?: string;
}

export interface FormData {
  developerId: string;
  type: DiscountType;
  percentage: string;
  amountPen: string;
  amountUsd: string;
  applicabilityScope: string;
  applicablePlanCodes: string;
  maxDiscountPen: string;
  maxDiscountUsd: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  adminReason: string;
}

export const DEFAULT_FORM_DATA: FormData = {
  developerId: '',
  type: 'PERCENTAGE',
  percentage: '',
  amountPen: '',
  amountUsd: '',
  applicabilityScope: 'BOTH',
  applicablePlanCodes: '',
  maxDiscountPen: '',
  maxDiscountUsd: '',
  usageLimit: '',
  validFrom: '',
  validUntil: '',
  adminReason: '',
};

export function validateForm(formData: FormData, editingDiscount?: { id: number } | null): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!formData.developerId && !editingDiscount) {
    errors.developerId = 'Selecciona una inmobiliaria';
  }

  if (formData.type === 'PERCENTAGE') {
    const percentage = parseFloat(formData.percentage);
    if (!formData.percentage) {
      errors.percentage = 'El porcentaje es obligatorio';
    } else if (isNaN(percentage) || percentage < 0.01 || percentage > 100) {
      errors.percentage = 'El porcentaje debe estar entre 0.01 y 100';
    }
  } else {
    const amountPen = parseFloat(formData.amountPen);
    const amountUsd = parseFloat(formData.amountUsd);
    if (!formData.amountPen && !formData.amountUsd) {
      errors.amountPen = 'Debe ingresar al menos un importe (PEN o USD)';
    }
    if (formData.amountPen && (isNaN(amountPen) || amountPen <= 0)) {
      errors.amountPen = 'El importe PEN debe ser positivo';
    }
    if (formData.amountUsd && (isNaN(amountUsd) || amountUsd <= 0)) {
      errors.amountUsd = 'El importe USD debe ser positivo';
    }
  }

  if (!formData.validFrom) {
    errors.validFrom = 'La fecha de inicio es obligatoria';
  }

  if (formData.validUntil && formData.validFrom) {
    if (new Date(formData.validUntil) < new Date(formData.validFrom)) {
      errors.validUntil = 'La fecha de fin debe ser posterior a la de inicio';
    }
  }

  if (!formData.adminReason.trim()) {
    errors.adminReason = 'El motivo administrativo es obligatorio';
  }

  if (formData.usageLimit) {
    const limit = parseInt(formData.usageLimit);
    if (isNaN(limit) || limit < 1) {
      errors.usageLimit = 'El límite de usos debe ser un número positivo';
    }
  }

  if (formData.maxDiscountPen) {
    const max = parseFloat(formData.maxDiscountPen);
    if (isNaN(max) || max <= 0) {
      errors.maxDiscountPen = 'El descuento máximo PEN debe ser positivo';
    }
  }

  if (formData.maxDiscountUsd) {
    const max = parseFloat(formData.maxDiscountUsd);
    if (isNaN(max) || max <= 0) {
      errors.maxDiscountUsd = 'El descuento máximo USD debe ser positivo';
    }
  }

  return errors;
}

export function formDataToRequest(
  formData: FormData,
  editingDiscount?: { id: number } | null
): CreateDeveloperSubscriptionDiscountRequest | UpdateDeveloperSubscriptionDiscountRequest {
  const requestData: CreateDeveloperSubscriptionDiscountRequest | UpdateDeveloperSubscriptionDiscountRequest = {
    type: formData.type,
    applicabilityScope: formData.applicabilityScope as any,
    validFrom: new Date(formData.validFrom).toISOString(),
    adminReason: formData.adminReason,
  };

  if (!editingDiscount) {
    (requestData as CreateDeveloperSubscriptionDiscountRequest).developerId = parseInt(formData.developerId);
  }

  if (formData.type === 'PERCENTAGE') {
    requestData.percentage = parseFloat(formData.percentage);
  } else {
    if (formData.amountPen) requestData.amountPen = parseFloat(formData.amountPen);
    if (formData.amountUsd) requestData.amountUsd = parseFloat(formData.amountUsd);
  }

  if (formData.applicablePlanCodes.trim()) {
    requestData.applicablePlanCodes = formData.applicablePlanCodes
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
  }

  if (formData.maxDiscountPen) requestData.maxDiscountPen = parseFloat(formData.maxDiscountPen);
  if (formData.maxDiscountUsd) requestData.maxDiscountUsd = parseFloat(formData.maxDiscountUsd);
  if (formData.usageLimit) requestData.usageLimit = parseInt(formData.usageLimit);
  if (formData.validUntil) requestData.validUntil = new Date(formData.validUntil).toISOString();

  return requestData;
}

export function discountToFormData(discount: any): FormData {
  return {
    developerId: discount.developerId.toString(),
    type: discount.type,
    percentage: discount.percentage?.toString() || '',
    amountPen: discount.amountPen?.toString() || '',
    amountUsd: discount.amountUsd?.toString() || '',
    applicabilityScope: discount.applicabilityScope,
    applicablePlanCodes: discount.applicablePlanCodes?.join(', ') || '',
    maxDiscountPen: discount.maxDiscountPen?.toString() || '',
    maxDiscountUsd: discount.maxDiscountUsd?.toString() || '',
    usageLimit: discount.usageLimit?.toString() || '',
    validFrom: discount.validFrom ? new Date(discount.validFrom).toISOString().split('T')[0] : '',
    validUntil: discount.validUntil ? new Date(discount.validUntil).toISOString().split('T')[0] : '',
    adminReason: discount.adminReason,
  };
}