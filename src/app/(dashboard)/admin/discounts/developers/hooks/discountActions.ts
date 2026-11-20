/**
 * Action handlers for the Developer Subscription Discounts page hook
 */

import { useCallback } from 'react';
import {
  DeveloperSubscriptionDiscount,
  CreateDeveloperSubscriptionDiscountRequest,
  UpdateDeveloperSubscriptionDiscountRequest,
  DiscountStatus,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { FormData, ValidationErrors, validateForm, formDataToRequest, DEFAULT_FORM_DATA } from '../utils/validation';
import { ExtendedFilters } from './types';
import { exportDiscountsToCsv } from './exportToCsv';

type MutationLike = { mutateAsync: (args: any) => Promise<any> };
type Notify = (message: string, type: 'success' | 'error') => void;

export interface DiscountActionsParams {
  formData: FormData;
  editingDiscount: DeveloperSubscriptionDiscount | null;
  discounts: DeveloperSubscriptionDiscount[];
  setFilters: React.Dispatch<React.SetStateAction<ExtendedFilters>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setFormErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  setEditingDiscount: React.Dispatch<React.SetStateAction<DeveloperSubscriptionDiscount | null>>;
  setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailDiscount: React.Dispatch<React.SetStateAction<DeveloperSubscriptionDiscount | null>>;
  setUsageHistoryDiscount: React.Dispatch<React.SetStateAction<DeveloperSubscriptionDiscount | null>>;
  setStatsDeveloper: React.Dispatch<React.SetStateAction<InmobiliariaWithStats | null>>;
  createMutation: MutationLike;
  updateMutation: MutationLike;
  deleteMutation: MutationLike;
  revokeMutation: MutationLike;
  toggleStatusMutation: MutationLike;
  showNotification: Notify;
  refetch: () => void;
}

export function useDiscountActions({
  formData,
  editingDiscount,
  discounts,
  setFilters,
  setSortBy,
  setFormData,
  setFormErrors,
  setEditingDiscount,
  setIsFormModalOpen,
  setDetailDiscount,
  setUsageHistoryDiscount,
  setStatsDeveloper,
  createMutation,
  updateMutation,
  deleteMutation,
  revokeMutation,
  toggleStatusMutation,
  showNotification,
  refetch,
}: DiscountActionsParams) {
  const handleFilterChange = useCallback((key: keyof ExtendedFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'ALL',
      type: 'ALL',
      applicabilityScope: 'ALL',
      dateFrom: '',
      dateTo: '',
      page: 0,
      size: 20,
      sort: 'createdAt,desc',
    });
    setSortBy('createdAt,desc');
  }, [setFilters, setSortBy]);

  const handleSubmitForm = useCallback(async () => {
    const errors = validateForm(formData, editingDiscount);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      const requestData = formDataToRequest(formData, editingDiscount);

      if (editingDiscount) {
        await updateMutation.mutateAsync({ id: editingDiscount.id, data: requestData as UpdateDeveloperSubscriptionDiscountRequest });
        showNotification('Descuento actualizado exitosamente', 'success');
      } else {
        await createMutation.mutateAsync(requestData as CreateDeveloperSubscriptionDiscountRequest);
        showNotification('Descuento de suscripción creado exitosamente', 'success');
      }

      setIsFormModalOpen(false);
      setEditingDiscount(null);
      setFormData(DEFAULT_FORM_DATA);
      refetch();
    } catch (err: any) {
      showNotification(err?.response?.data?.message || (editingDiscount ? 'Error al actualizar descuento' : 'Error al crear descuento'), 'error');
    }
  }, [formData, editingDiscount, createMutation, updateMutation, showNotification, refetch, setFormErrors, setIsFormModalOpen, setEditingDiscount, setFormData]);

  const handleOpenCreateModal = useCallback(() => {
    setEditingDiscount(null);
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setIsFormModalOpen(true);
  }, [setEditingDiscount, setFormData, setFormErrors, setIsFormModalOpen]);

  const handleOpenEditModal = useCallback((discount: DeveloperSubscriptionDiscount) => {
    setEditingDiscount(discount);
    setIsFormModalOpen(true);
  }, [setEditingDiscount, setIsFormModalOpen]);

  const handleViewDetail = useCallback((discount: DeveloperSubscriptionDiscount) => {
    setDetailDiscount(discount);
  }, [setDetailDiscount]);

  const handleViewUsageHistory = useCallback((discount: DeveloperSubscriptionDiscount) => {
    setUsageHistoryDiscount(discount);
  }, [setUsageHistoryDiscount]);

  const handleViewStats = useCallback((developer: InmobiliariaWithStats) => {
    setStatsDeveloper(developer);
  }, [setStatsDeveloper]);

  const handleToggleStatus = useCallback(async (discount: DeveloperSubscriptionDiscount, newStatus: DiscountStatus) => {
    try {
      await toggleStatusMutation.mutateAsync({ discountId: discount.id, status: newStatus });
      showNotification('Estado actualizado', 'success');
      refetch();
    } catch (err: any) {
      showNotification(err?.response?.data?.message || 'Error al actualizar estado', 'error');
    }
  }, [toggleStatusMutation, showNotification, refetch]);

  const handleRevokeDiscount = useCallback(async (discount: DeveloperSubscriptionDiscount) => {
    const reason = prompt('Motivo de la revocación (opcional):') || undefined;
    try {
      await revokeMutation.mutateAsync({ discountId: discount.id, reason });
      showNotification('Descuento revocado', 'success');
      refetch();
    } catch (err: any) {
      showNotification(err?.response?.data?.message || 'Error al revocar descuento', 'error');
    }
  }, [revokeMutation, showNotification, refetch]);

  const handleDeleteDiscount = useCallback(async (discount: DeveloperSubscriptionDiscount) => {
    if (!confirm(`¿Eliminar el descuento "${discount.id}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteMutation.mutateAsync(discount.id);
      showNotification('Descuento eliminado', 'success');
      refetch();
    } catch (err: any) {
      showNotification(err?.response?.data?.message || 'Error al eliminar descuento', 'error');
    }
  }, [deleteMutation, showNotification, refetch]);

  const handleExport = useCallback(() => {
    exportDiscountsToCsv(discounts, showNotification);
  }, [discounts, showNotification]);

  return {
    handleFilterChange,
    handleClearFilters,
    handleSubmitForm,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleViewDetail,
    handleViewUsageHistory,
    handleViewStats,
    handleToggleStatus,
    handleRevokeDiscount,
    handleDeleteDiscount,
    handleExport,
  };
}
