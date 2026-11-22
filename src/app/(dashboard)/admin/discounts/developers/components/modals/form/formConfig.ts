/**
 * Form types and constants for Developer Subscription Discount Form Modal
 */

import {
  DeveloperSubscriptionDiscount,
  CreateDeveloperSubscriptionDiscountRequest,
  UpdateDeveloperSubscriptionDiscountRequest,
  DiscountType,
  DiscountApplicabilityScope,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';

export interface FormData {
  developerId: string;
  type: DiscountType;
  percentage: string;
  amountPen: string;
  amountUsd: string;
  applicabilityScope: DiscountApplicabilityScope;
  applicablePlanCodes: string;
  maxDiscountPen: string;
  maxDiscountUsd: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  adminReason: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;

export interface DeveloperSubscriptionDiscountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDiscount: DeveloperSubscriptionDiscount | null;
  onSubmit: (data: CreateDeveloperSubscriptionDiscountRequest | UpdateDeveloperSubscriptionDiscountRequest) => void;
  isPending: boolean;
}

export interface DeveloperOption {
  id: number;
  name: string;
  ruc?: string;
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

export const SCOPE_OPTIONS = [
  { value: 'NEW_CONTRACT', label: 'Nueva contratación' },
  { value: 'RENEWAL', label: 'Renovación' },
  { value: 'BOTH', label: 'Ambos (contratación y renovación)' },
];
