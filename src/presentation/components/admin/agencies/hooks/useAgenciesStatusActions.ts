/**
 * Acciones de selección, cambio de estado e historial de inmobiliarias.
 */

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type {
  useChangeDeveloperStatus,
  useClearDeveloperStatusHistory,
  useDeleteStatusHistoryEntry,
} from '@/presentation/hooks/admin/useDevelopers';

export interface AgenciesStatusActionsInput {
  selectedAgency: InmobiliariaWithStats | null;
  setSelectedAgency: Dispatch<SetStateAction<InmobiliariaWithStats | null>>;
  setHistoryPage: Dispatch<SetStateAction<number>>;
  changeStatusMutation: ReturnType<typeof useChangeDeveloperStatus>;
  clearHistoryMutation: ReturnType<typeof useClearDeveloperStatusHistory>;
  deleteHistoryEntryMutation: ReturnType<typeof useDeleteStatusHistoryEntry>;
}

export function useAgenciesStatusActions({
  selectedAgency,
  setSelectedAgency,
  setHistoryPage,
  changeStatusMutation,
  clearHistoryMutation,
  deleteHistoryEntryMutation,
}: AgenciesStatusActionsInput) {
  const handleSelectAgency = useCallback((agency: InmobiliariaWithStats) => {
    setSelectedAgency(agency);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSelectedAgency]);

  const handleBackToList = useCallback(() => {
    setSelectedAgency(null);
    setHistoryPage(0);
  }, [setSelectedAgency, setHistoryPage]);

  const handleChangeStatus = useCallback(async (status: string, reason?: string) => {
    if (!selectedAgency) {
      alert('Por favor selecciona una inmobiliaria primero');
      return;
    }
    try {
      await changeStatusMutation.mutateAsync({
        id: selectedAgency.id,
        data: { status, reason, notifyDeveloper: true },
      });

      setSelectedAgency(prev => prev ? {
        ...prev,
        status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        enabled: status === 'ACTIVE'
      } : null);

      setHistoryPage(0);
      alert(`Inmobiliaria ${status === 'ACTIVE' ? 'activada' : status === 'SUSPENDED' ? 'suspendida' : 'bloqueada'} exitosamente`);
    } catch (error: any) {
      console.error('[DEBUG] Error al cambiar estado:', error);
      const errorMessage = error?.response?.data?.message || 'Error al cambiar el estado de la inmobiliaria. Por favor intenta nuevamente.';
      alert(errorMessage);
    }
  }, [selectedAgency, changeStatusMutation, setSelectedAgency, setHistoryPage]);

  const handleClearHistory = useCallback(async () => {
    if (!selectedAgency) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar TODO el historial de "${selectedAgency.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await clearHistoryMutation.mutateAsync(selectedAgency.id);
      setHistoryPage(0);
      alert(`Historial de "${selectedAgency.name}" eliminado exitosamente`);
    } catch (error: any) {
      console.error('Error al eliminar historial:', error);
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el historial. Por favor intenta nuevamente.';
      alert(errorMessage);
    }
  }, [selectedAgency, clearHistoryMutation, setHistoryPage]);

  const handleDeleteHistoryEntry = useCallback(async (entryId: number) => {
    if (!selectedAgency) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar este registro del historial? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteHistoryEntryMutation.mutateAsync({
        developerId: selectedAgency.id,
        entryId
      });
      alert('Registro eliminado exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar registro:', error);
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el registro. Por favor intenta nuevamente.';
      alert(errorMessage);
    }
  }, [selectedAgency, deleteHistoryEntryMutation]);

  return {
    handleSelectAgency,
    handleBackToList,
    handleChangeStatus,
    handleClearHistory,
    handleDeleteHistoryEntry,
  };
}
