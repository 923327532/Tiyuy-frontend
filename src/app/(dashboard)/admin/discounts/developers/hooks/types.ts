/**
 * Types for the Developer Subscription Discounts page hook
 */

import {
  DeveloperSubscriptionDiscount,
  DeveloperSubscriptionDiscountFilters,
  DiscountStatus,
  DiscountType,
  DiscountApplicabilityScope,
  DeveloperSubscriptionDiscountSummary,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { FormData, ValidationErrors } from '../utils/validation';

// Extended filters that allow 'ALL' as internal value
export type ExtendedFilters = Omit<DeveloperSubscriptionDiscountFilters, 'status' | 'type' | 'applicabilityScope'> & {
  status: DiscountStatus | 'ALL';
  type: DiscountType | 'ALL';
  applicabilityScope: DiscountApplicabilityScope | 'ALL';
};

export interface UseDeveloperSubscriptionDiscountsReturn {
  // Data
  discounts: DeveloperSubscriptionDiscount[];
  summary: DeveloperSubscriptionDiscountSummary | null;
  developers: { id: number; name: string }[];
  allDevelopers: InmobiliariaWithStats[];
  isLoading: boolean;
  error: Error | null;
  totalElements: number;
  totalPages: number;

  // Filters state
  filters: ExtendedFilters;
  setFilters: React.Dispatch<React.SetStateAction<ExtendedFilters>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: React.Dispatch<React.SetStateAction<boolean>>;
  hasActiveFilters: boolean;

  // Form state
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formErrors: ValidationErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  editingDiscount: DeveloperSubscriptionDiscount | null;
  setEditingDiscount: React.Dispatch<React.SetStateAction<DeveloperSubscriptionDiscount | null>>;
  isFormModalOpen: boolean;
  setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Detail modals
  detailDiscount: DeveloperSubscriptionDiscount | null;
  setDetailDiscount: React.Dispatch<React.SetStateAction<DeveloperSubscriptionDiscount | null>>;
  usageHistoryDiscount: DeveloperSubscriptionDiscount | null;
  setUsageHistoryDiscount: React.Dispatch<React.SetStateAction<DeveloperSubscriptionDiscount | null>>;
  statsDeveloper: InmobiliariaWithStats | null;
  setStatsDeveloper: React.Dispatch<React.SetStateAction<InmobiliariaWithStats | null>>;

  // Notification
  notification: { message: string; type: 'success' | 'error' } | null;
  setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>;

  // Permissions
  canManageDiscounts: boolean;

  // Actions
  handleFilterChange: (key: keyof ExtendedFilters, value: string | number) => void;
  handleClearFilters: () => void;
  handleSubmitForm: () => void;
  handleOpenCreateModal: () => void;
  handleOpenEditModal: (discount: DeveloperSubscriptionDiscount) => void;
  handleViewDetail: (discount: DeveloperSubscriptionDiscount) => void;
  handleViewUsageHistory: (discount: DeveloperSubscriptionDiscount) => void;
  handleViewStats: (developer: InmobiliariaWithStats) => void;
  handleToggleStatus: (discount: DeveloperSubscriptionDiscount, newStatus: DiscountStatus) => void;
  handleRevokeDiscount: (discount: DeveloperSubscriptionDiscount) => void;
  handleDeleteDiscount: (discount: DeveloperSubscriptionDiscount) => void;
  handleExport: () => void;
  refetch: () => void;
}
