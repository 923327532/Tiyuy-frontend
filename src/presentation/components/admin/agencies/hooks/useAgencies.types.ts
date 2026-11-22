/**
 * Tipos compartidos por los hooks de gestión de inmobiliarias.
 */

import type { Dispatch, SetStateAction } from 'react';
import type {
  InmobiliariaWithStats,
  InmobiliariaAgent,
  InmobiliariaDiscount,
  InmobiliariaStatusHistory,
} from '@/core/domain/entities/Admin';
import type { AgenciesFiltersState } from '@/presentation/components/admin/agencies/types/agencies.types';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import type {
  useChangeDeveloperStatus,
  useCreateDeveloperDiscountCode,
  useApplyDirectDiscount,
  useRemoveAgentFromDeveloper,
  useToggleDeveloperDiscountCodeStatus,
  useDeleteDeveloperDiscountCode,
  useNotifyDeveloper,
  useClearDeveloperStatusHistory,
  useDeleteStatusHistoryEntry,
} from '@/presentation/hooks/admin/useDevelopers';

export const HISTORY_PAGE_SIZE = 5;

export interface NewDiscountState {
  code: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

export interface DirectDiscountState {
  discountPercentage: string;
  reason: string;
  notifyAgency: boolean;
  applyToAllAgents: boolean;
  maxAgents: string;
  expiresAt: string;
}

export interface NotificationDataState {
  subject: string;
  message: string;
  sendEmail: boolean;
  sendInApp: boolean;
}

export interface UseAgenciesReturn {
  // Estado de datos
  agencies: InmobiliariaWithStats[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;

  // Estado de UI
  filters: AgenciesFiltersState;
  setFilters: (filters: Partial<AgenciesFiltersState>) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selección
  selectedAgencies: InmobiliariaWithStats[];
  setSelectedAgencies: React.Dispatch<React.SetStateAction<InmobiliariaWithStats[]>>;

  // Detalle
  selectedAgency: InmobiliariaWithStats | null;
  setSelectedAgency: (agency: InmobiliariaWithStats | null) => void;
  agencyAgents: InmobiliariaAgent[];
  agencyDiscounts: InmobiliariaDiscount[];
  agencyStats: any;
  statusHistory: InmobiliariaStatusHistory[];
  historyPage: number;
  setHistoryPage: (page: number) => void;
  totalHistoryPages: number;
  totalHistoryElements: number;

  // Modales
  isCreateDiscountModalOpen: boolean;
  setIsCreateDiscountModalOpen: (open: boolean) => void;
  isApplyDirectDiscountModalOpen: boolean;
  setIsApplyDirectDiscountModalOpen: (open: boolean) => void;
  isNotifyModalOpen: boolean;
  setIsNotifyModalOpen: (open: boolean) => void;
  notifyAgency: InmobiliariaWithStats | null;
  setNotifyAgency: React.Dispatch<React.SetStateAction<InmobiliariaWithStats | null>>;

  // Datos de modales
  newDiscount: {
    code: string;
    discountPercentage: string;
    startDate: string;
    endDate: string;
    usageLimit: string;
  };
  setNewDiscount: React.Dispatch<React.SetStateAction<{
    code: string;
    discountPercentage: string;
    startDate: string;
    endDate: string;
    usageLimit: string;
  }>>;

  directDiscount: {
    discountPercentage: string;
    reason: string;
    notifyAgency: boolean;
    applyToAllAgents: boolean;
    maxAgents: string;
    expiresAt: string;
  };
  setDirectDiscount: React.Dispatch<React.SetStateAction<{
    discountPercentage: string;
    reason: string;
    notifyAgency: boolean;
    applyToAllAgents: boolean;
    maxAgents: string;
    expiresAt: string;
  }>>;

  notificationData: {
    subject: string;
    message: string;
    sendEmail: boolean;
    sendInApp: boolean;
  };
  setNotificationData: React.Dispatch<React.SetStateAction<{
    subject: string;
    message: string;
    sendEmail: boolean;
    sendInApp: boolean;
  }>>;

  // Mutaciones
  changeStatusMutation: ReturnType<typeof useChangeDeveloperStatus>;
  createDiscountMutation: ReturnType<typeof useCreateDeveloperDiscountCode>;
  applyDirectDiscountMutation: ReturnType<typeof useApplyDirectDiscount>;
  removeAgentMutation: ReturnType<typeof useRemoveAgentFromDeveloper>;
  toggleDiscountMutation: ReturnType<typeof useToggleDeveloperDiscountCodeStatus>;
  deleteDiscountMutation: ReturnType<typeof useDeleteDeveloperDiscountCode>;
  notifyDeveloperMutation: ReturnType<typeof useNotifyDeveloper>;
  clearHistoryMutation: ReturnType<typeof useClearDeveloperStatusHistory>;
  deleteHistoryEntryMutation: ReturnType<typeof useDeleteStatusHistoryEntry>;

  // Permisos
  canManageAgencies: boolean;

  // Acciones
  handleSelectAgency: (agency: InmobiliariaWithStats) => void;
  handleBackToList: () => void;
  handleChangeStatus: (status: string, reason?: string) => Promise<void>;
  handleCreateDiscount: () => void;
  handleApplyDirectDiscount: () => void;
  handleClearHistory: () => Promise<void>;
  handleDeleteHistoryEntry: (entryId: number) => Promise<void>;
  handleCreateDiscountSubmit: () => Promise<void>;
  handleApplyDirectDiscountSubmit: () => Promise<void>;
  handleNotify: () => void;
  handleNotifyAgency: (agency: InmobiliariaWithStats) => void;
  handleNotifySubmit: () => Promise<void>;
  handleExport: () => void;
  handleClearFilters: () => void;
  refetch: () => void;
}

export interface AgenciesState {
  filters: AgenciesFiltersState;
  setFilters: (filters: Partial<AgenciesFiltersState>) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  selectedAgencies: InmobiliariaWithStats[];
  setSelectedAgencies: Dispatch<SetStateAction<InmobiliariaWithStats[]>>;
  selectedAgency: InmobiliariaWithStats | null;
  setSelectedAgency: Dispatch<SetStateAction<InmobiliariaWithStats | null>>;
  historyPage: number;
  setHistoryPage: Dispatch<SetStateAction<number>>;
  isCreateDiscountModalOpen: boolean;
  setIsCreateDiscountModalOpen: Dispatch<SetStateAction<boolean>>;
  isApplyDirectDiscountModalOpen: boolean;
  setIsApplyDirectDiscountModalOpen: Dispatch<SetStateAction<boolean>>;
  isNotifyModalOpen: boolean;
  setIsNotifyModalOpen: Dispatch<SetStateAction<boolean>>;
  notifyAgency: InmobiliariaWithStats | null;
  setNotifyAgency: Dispatch<SetStateAction<InmobiliariaWithStats | null>>;
  newDiscount: NewDiscountState;
  setNewDiscount: Dispatch<SetStateAction<NewDiscountState>>;
  directDiscount: DirectDiscountState;
  setDirectDiscount: Dispatch<SetStateAction<DirectDiscountState>>;
  notificationData: NotificationDataState;
  setNotificationData: Dispatch<SetStateAction<NotificationDataState>>;
}
