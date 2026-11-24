/**
 * useAgencies - Hook personalizado para la gestión de inmobiliarias
 * Encapsula toda la lógica de datos, filtros, paginación y mutaciones
 * Arquitectura idéntica a useUsers
 */
'use client';

import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useAgenciesState } from './useAgenciesState';
import { useAgenciesData } from './useAgenciesData';
import { useAgenciesStatusActions } from './useAgenciesStatusActions';
import { useAgenciesDiscountActions } from './useAgenciesDiscountActions';
import { useAgenciesNotifyActions } from './useAgenciesNotifyActions';
import { useAgenciesListActions } from './useAgenciesListActions';
import type { UseAgenciesReturn } from './useAgencies.types';

export function useAgencies(): UseAgenciesReturn {
  const { hasPermission, isSuperAdmin } = usePermissions();
  const state = useAgenciesState();
  const data = useAgenciesData({
    filters: state.filters,
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    selectedAgency: state.selectedAgency,
    historyPage: state.historyPage,
  });

  const statusActions = useAgenciesStatusActions({
    selectedAgency: state.selectedAgency,
    setSelectedAgency: state.setSelectedAgency,
    setHistoryPage: state.setHistoryPage,
    changeStatusMutation: data.changeStatusMutation,
    clearHistoryMutation: data.clearHistoryMutation,
    deleteHistoryEntryMutation: data.deleteHistoryEntryMutation,
  });

  const discountActions = useAgenciesDiscountActions({
    selectedAgency: state.selectedAgency,
    setIsCreateDiscountModalOpen: state.setIsCreateDiscountModalOpen,
    setIsApplyDirectDiscountModalOpen: state.setIsApplyDirectDiscountModalOpen,
    newDiscount: state.newDiscount,
    setNewDiscount: state.setNewDiscount,
    directDiscount: state.directDiscount,
    setDirectDiscount: state.setDirectDiscount,
    createDiscountMutation: data.createDiscountMutation,
    applyDirectDiscountMutation: data.applyDirectDiscountMutation,
  });

  const notifyActions = useAgenciesNotifyActions({
    selectedAgency: state.selectedAgency,
    notifyAgency: state.notifyAgency,
    setSelectedAgency: state.setSelectedAgency,
    setHistoryPage: state.setHistoryPage,
    setIsNotifyModalOpen: state.setIsNotifyModalOpen,
    setNotifyAgency: state.setNotifyAgency,
    notificationData: state.notificationData,
    setNotificationData: state.setNotificationData,
    notifyDeveloperMutation: data.notifyDeveloperMutation,
  });

  const listActions = useAgenciesListActions({
    agencies: data.agencies,
    filters: state.filters,
    setFilters: state.setFilters,
    setCurrentPage: state.setCurrentPage,
  });

  const canManageAgencies = hasPermission('USERS_UPDATE') || isSuperAdmin;

  return {
    agencies: data.agencies,
    totalElements: data.totalElements,
    isLoading: data.isLoading,
    error: data.error,
    filters: state.filters,
    setFilters: state.setFilters,
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    pageSize: state.pageSize,
    setPageSize: state.setPageSize,
    viewMode: state.viewMode,
    setViewMode: state.setViewMode,
    selectedAgencies: state.selectedAgencies,
    setSelectedAgencies: state.setSelectedAgencies,
    selectedAgency: state.selectedAgency,
    setSelectedAgency: state.setSelectedAgency,
    agencyAgents: data.agencyAgents,
    agencyDiscounts: data.agencyDiscounts,
    agencyStats: data.agencyStats,
    statusHistory: data.statusHistory,
    historyPage: state.historyPage,
    setHistoryPage: state.setHistoryPage,
    totalHistoryPages: data.totalHistoryPages,
    totalHistoryElements: data.totalHistoryElements,
    isCreateDiscountModalOpen: state.isCreateDiscountModalOpen,
    setIsCreateDiscountModalOpen: state.setIsCreateDiscountModalOpen,
    isApplyDirectDiscountModalOpen: state.isApplyDirectDiscountModalOpen,
    setIsApplyDirectDiscountModalOpen: state.setIsApplyDirectDiscountModalOpen,
    isNotifyModalOpen: state.isNotifyModalOpen,
    setIsNotifyModalOpen: state.setIsNotifyModalOpen,
    notifyAgency: state.notifyAgency,
    setNotifyAgency: state.setNotifyAgency,
    newDiscount: state.newDiscount,
    setNewDiscount: state.setNewDiscount,
    directDiscount: state.directDiscount,
    setDirectDiscount: state.setDirectDiscount,
    notificationData: state.notificationData,
    setNotificationData: state.setNotificationData,
    changeStatusMutation: data.changeStatusMutation,
    createDiscountMutation: data.createDiscountMutation,
    applyDirectDiscountMutation: data.applyDirectDiscountMutation,
    removeAgentMutation: data.removeAgentMutation,
    toggleDiscountMutation: data.toggleDiscountMutation,
    deleteDiscountMutation: data.deleteDiscountMutation,
    notifyDeveloperMutation: data.notifyDeveloperMutation,
    clearHistoryMutation: data.clearHistoryMutation,
    deleteHistoryEntryMutation: data.deleteHistoryEntryMutation,
    canManageAgencies,
    handleSelectAgency: statusActions.handleSelectAgency,
    handleBackToList: statusActions.handleBackToList,
    handleChangeStatus: statusActions.handleChangeStatus,
    handleCreateDiscount: discountActions.handleCreateDiscount,
    handleApplyDirectDiscount: discountActions.handleApplyDirectDiscount,
    handleClearHistory: statusActions.handleClearHistory,
    handleDeleteHistoryEntry: statusActions.handleDeleteHistoryEntry,
    handleCreateDiscountSubmit: discountActions.handleCreateDiscountSubmit,
    handleApplyDirectDiscountSubmit: discountActions.handleApplyDirectDiscountSubmit,
    handleNotify: notifyActions.handleNotify,
    handleNotifyAgency: notifyActions.handleNotifyAgency,
    handleNotifySubmit: notifyActions.handleNotifySubmit,
    handleExport: listActions.handleExport,
    handleClearFilters: listActions.handleClearFilters,
    refetch: data.refetch,
  };
}
