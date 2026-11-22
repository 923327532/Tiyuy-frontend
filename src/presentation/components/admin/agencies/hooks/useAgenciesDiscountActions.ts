/**
 * Acciones de creación y aplicación de descuentos de inmobiliarias.
 */

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type {
  useCreateDeveloperDiscountCode,
  useApplyDirectDiscount,
} from '@/presentation/hooks/admin/useDevelopers';
import type { NewDiscountState, DirectDiscountState } from './useAgencies.types';

export interface AgenciesDiscountActionsInput {
  selectedAgency: InmobiliariaWithStats | null;
  setIsCreateDiscountModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsApplyDirectDiscountModalOpen: Dispatch<SetStateAction<boolean>>;
  newDiscount: NewDiscountState;
  setNewDiscount: Dispatch<SetStateAction<NewDiscountState>>;
  directDiscount: DirectDiscountState;
  setDirectDiscount: Dispatch<SetStateAction<DirectDiscountState>>;
  createDiscountMutation: ReturnType<typeof useCreateDeveloperDiscountCode>;
  applyDirectDiscountMutation: ReturnType<typeof useApplyDirectDiscount>;
}

export function useAgenciesDiscountActions({
  selectedAgency,
  setIsCreateDiscountModalOpen,
  setIsApplyDirectDiscountModalOpen,
  newDiscount,
  setNewDiscount,
  directDiscount,
  setDirectDiscount,
  createDiscountMutation,
  applyDirectDiscountMutation,
}: AgenciesDiscountActionsInput) {
  const handleCreateDiscount = useCallback(() => {
    setIsCreateDiscountModalOpen(true);
  }, [setIsCreateDiscountModalOpen]);

  const handleApplyDirectDiscount = useCallback(() => {
    setIsApplyDirectDiscountModalOpen(true);
  }, [setIsApplyDirectDiscountModalOpen]);

  const handleCreateDiscountSubmit = useCallback(async () => {
    if (!selectedAgency) return;
    try {
      await createDiscountMutation.mutateAsync({
        developerId: selectedAgency.id,
        data: {
          inmobiliariaId: selectedAgency.id,
          code: newDiscount.code,
          discountPercentage: parseInt(newDiscount.discountPercentage),
          validFrom: newDiscount.startDate ? new Date(newDiscount.startDate) : new Date(),
          validUntil: newDiscount.endDate ? new Date(newDiscount.endDate) : undefined,
          maxUses: newDiscount.usageLimit ? parseInt(newDiscount.usageLimit) : undefined,
          applicableToAgents: false,
        },
      });

      setIsCreateDiscountModalOpen(false);
      setNewDiscount({ code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '' });
      alert('¡Descuento creado exitosamente! La inmobiliaria podrá usar este código en sus planes empresariales.');
    } catch (error: any) {
      console.error('Failed to create discount:', error);
      const errorMessage = error?.response?.data?.message || 'Error al crear el descuento. Por favor intenta nuevamente.';
      alert(errorMessage);
    }
  }, [selectedAgency, createDiscountMutation, newDiscount, setIsCreateDiscountModalOpen, setNewDiscount]);

  const handleApplyDirectDiscountSubmit = useCallback(async () => {
    if (!selectedAgency) return;

    try {
      const discountPercent = parseInt(directDiscount.discountPercentage);
      if (!directDiscount.discountPercentage || isNaN(discountPercent) || discountPercent <= 0) {
        alert('Por favor ingrese un porcentaje de descuento válido');
        return;
      }

      if (!directDiscount.reason || directDiscount.reason.trim() === '') {
        alert('Por favor ingrese un motivo para el descuento');
        return;
      }

      const requestData = {
        discountPercentage: discountPercent,
        reason: directDiscount.reason.trim(),
        applyToAllAgents: directDiscount.applyToAllAgents,
        maxAgents: directDiscount.maxAgents && directDiscount.maxAgents.trim() ? parseInt(directDiscount.maxAgents) : undefined,
        expiresAt: directDiscount.expiresAt && directDiscount.expiresAt.trim() ? new Date(directDiscount.expiresAt) : undefined,
      };

      await applyDirectDiscountMutation.mutateAsync({
        developerId: selectedAgency.id,
        data: requestData,
      });

      alert(`Descuento del ${directDiscount.discountPercentage}% aplicado exitosamente.`);
      setIsApplyDirectDiscountModalOpen(false);
      setDirectDiscount({ discountPercentage: '', reason: '', notifyAgency: true, applyToAllAgents: false, maxAgents: '', expiresAt: '' });
    } catch (error: any) {
      console.error('Failed to apply direct discount:', error);
      if (error.response?.data?.message) {
        alert(`Error del backend: ${error.response.data.message}`);
      } else {
        alert('Error al aplicar el descuento. Por favor intenta nuevamente.');
      }
    }
  }, [selectedAgency, applyDirectDiscountMutation, directDiscount, setIsApplyDirectDiscountModalOpen, setDirectDiscount]);

  return {
    handleCreateDiscount,
    handleApplyDirectDiscount,
    handleCreateDiscountSubmit,
    handleApplyDirectDiscountSubmit,
  };
}
