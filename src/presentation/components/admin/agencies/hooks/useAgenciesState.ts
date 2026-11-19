/**
 * Estado local del panel de inmobiliarias (filtros, paginación, selección y modales).
 */

import { useState, useCallback } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type { AgenciesFiltersState } from '@/presentation/components/admin/agencies/types/agencies.types';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import type { AgenciesState } from './useAgencies.types';

export function useAgenciesState(): AgenciesState {
  // Estado de filtros
  const [filters, setFiltersState] = useState<AgenciesFiltersState>({
    searchQuery: '',
    statusFilter: '',
    planFilter: '',
    discountFilter: '',
    sortBy: 'name',
  });

  const setFilters = useCallback((updates: Partial<AgenciesFiltersState>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  }, []);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estado de vista
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Estado de selección
  const [selectedAgencies, setSelectedAgencies] = useState<InmobiliariaWithStats[]>([]);

  // Estado de detalle
  const [selectedAgency, setSelectedAgency] = useState<InmobiliariaWithStats | null>(null);
  const [historyPage, setHistoryPage] = useState(0);

  // Estado de modales
  const [isCreateDiscountModalOpen, setIsCreateDiscountModalOpen] = useState(false);
  const [isApplyDirectDiscountModalOpen, setIsApplyDirectDiscountModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyAgency, setNotifyAgency] = useState<InmobiliariaWithStats | null>(null);

  // Datos de modales
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
  });

  const [directDiscount, setDirectDiscount] = useState({
    discountPercentage: '',
    reason: '',
    notifyAgency: true,
    applyToAllAgents: false,
    maxAgents: '',
    expiresAt: '',
  });

  const [notificationData, setNotificationData] = useState({
    subject: '',
    message: '',
    sendEmail: true,
    sendInApp: true,
  });

  return {
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    selectedAgencies,
    setSelectedAgencies,
    selectedAgency,
    setSelectedAgency,
    historyPage,
    setHistoryPage,
    isCreateDiscountModalOpen,
    setIsCreateDiscountModalOpen,
    isApplyDirectDiscountModalOpen,
    setIsApplyDirectDiscountModalOpen,
    isNotifyModalOpen,
    setIsNotifyModalOpen,
    notifyAgency,
    setNotifyAgency,
    newDiscount,
    setNewDiscount,
    directDiscount,
    setDirectDiscount,
    notificationData,
    setNotificationData,
  };
}
