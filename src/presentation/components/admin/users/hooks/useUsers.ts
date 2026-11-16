/**
 * useUsers - Hook personalizado para la gestión de usuarios
 * Encapsula toda la lógica de datos, filtros, paginación y mutaciones
 */
'use client';

import { useState, useCallback } from 'react';
import {
  useUsers as useUsersQuery,
  useToggleUserStatus,
  useDeleteUser,
  useChangeUserRole,
  useVerifyUserEmail,
  useVerifyUserPhone,
  useUserById,
  useUserProperties,
  useUserProjects,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import type { UserListItem, ChangeUserRoleRequest } from '@/core/domain/entities/Admin';
import type { UsersFiltersState, ViewMode } from '@/presentation/components/admin/users/types/users.types';

export interface UseUsersReturn {
  // Estado de datos
  users: UserListItem[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;

  // Estado de UI
  filters: UsersFiltersState;
  setFilters: (filters: Partial<UsersFiltersState>) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selección
  selectedUsers: UserListItem[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserListItem[]>>;

  // Modales
  detailUserId: number | null;
  setDetailUserId: (id: number | null) => void;
  isViewModalOpen: boolean;
  setIsViewModalOpen: (open: boolean) => void;
  selectedUser: UserListItem | null;
  setSelectedUser: (user: UserListItem | null) => void;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isToggleModalOpen: boolean;
  setIsToggleModalOpen: (open: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  isPropertiesModalOpen: boolean;
  setIsPropertiesModalOpen: (open: boolean) => void;
  isProjectsModalOpen: boolean;
  setIsProjectsModalOpen: (open: boolean) => void;
  viewingUserId: number | null;
  setViewingUserId: (id: number | null) => void;
  setToggleReason: (reason: string) => void;
  setDeleteReason: (reason: string) => void;

  // Mutaciones
  toggleStatusMutation: ReturnType<typeof useToggleUserStatus>;
  deleteUserMutation: ReturnType<typeof useDeleteUser>;
  changeRoleMutation: ReturnType<typeof useChangeUserRole>;
  verifyEmailMutation: ReturnType<typeof useVerifyUserEmail>;
  verifyPhoneMutation: ReturnType<typeof useVerifyUserPhone>;

  // Datos de detalle
  userDetailData: ReturnType<typeof useUserById>['data'];
  isLoadingDetail: boolean;

  // Datos de propiedades/proyectos
  userPropertiesData: ReturnType<typeof useUserProperties>['data'];
  isLoadingProperties: boolean;
  userProjectsData: ReturnType<typeof useUserProjects>['data'];
  isLoadingProjects: boolean;

  // Permisos
  canManageUsers: boolean;
  canDeleteUsers: boolean;
  canChangeRoles: boolean;
  canVerifyUsers: boolean;

  // Acciones
  handleViewUser: (user: UserListItem) => void;
  handleToggleStatus: (user: UserListItem) => void;
  handleChangeRole: (user: UserListItem) => void;
  handleVerifyEmail: (userId: number) => Promise<void>;
  handleVerifyPhone: (userId: number) => Promise<void>;
  handleViewProperties: (user: UserListItem) => void;
  handleViewProjects: (user: UserListItem) => void;
  confirmRoleChange: (newRole: string, reason: string) => Promise<void>;
  confirmDeleteUser: () => Promise<void>;
  confirmToggleStatus: (reason: string) => Promise<void>;
  handleDeleteUser: (user: UserListItem) => void;
  handleClearFilters: () => void;
  refetch: () => void;
}

export function useUsers(): UseUsersReturn {
  const { hasPermission, isSuperAdmin } = usePermissions();

  // Estado de filtros
  const [filters, setFiltersState] = useState<UsersFiltersState>({
    searchQuery: '',
    statusFilter: 'all',
    roleFilter: '',
    userTypeFilter: 'ALL',
  });

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Estado de vista
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Estado de selección
  const [selectedUsers, setSelectedUsers] = useState<UserListItem[]>([]);

  // Estado de modales
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);

  // Estado para mutaciones
  const [toggleReason, setToggleReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Permisos
  const canManageUsers = hasPermission('USERS_UPDATE') || isSuperAdmin;
  const canDeleteUsers = hasPermission('USERS_DELETE') || isSuperAdmin;
  const canChangeRoles = hasPermission('USERS_CHANGE_ROLE');
  const canVerifyUsers = hasPermission('USERS_VERIFY');

  // Parámetros de consulta
  const enabledParam =
    filters.statusFilter === 'enabled'
      ? true
      : filters.statusFilter === 'disabled'
        ? false
        : undefined;

  // Consulta de usuarios
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useUsersQuery(
    filters.roleFilter || undefined,
    enabledParam,
    filters.searchQuery || undefined,
    { page: currentPage - 1, size: pageSize }
  );

  // Mutaciones
  const toggleStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();
  const changeRoleMutation = useChangeUserRole();
  const verifyEmailMutation = useVerifyUserEmail();
  const verifyPhoneMutation = useVerifyUserPhone();

  // Datos de detalle
  const { data: userDetailData, isLoading: isLoadingDetail } = useUserById(detailUserId || 0);

  // Datos de propiedades/proyectos
  const { data: userPropertiesData, isLoading: isLoadingProperties } = useUserProperties(viewingUserId);
  const { data: userProjectsData, isLoading: isLoadingProjects } = useUserProjects(viewingUserId);

  // Usuarios y total
  const users = usersData?.content || [];
  const totalElements = usersData?.totalElements || 0;

  // Actualizar filtros
  const setFilters = useCallback((newFilters: Partial<UsersFiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset a primera página al filtrar
  }, []);

  // Manejadores de eventos
  const handleViewUser = useCallback((user: UserListItem) => {
    setSelectedUser(user);
    setDetailUserId(user.id);
    setIsViewModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback((user: UserListItem) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsToggleModalOpen(true);
  }, []);

  const handleChangeRole = useCallback((user: UserListItem) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  }, []);

  const handleVerifyEmail = useCallback(
    async (userId: number) => {
      try {
        await verifyEmailMutation.mutateAsync(userId);
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = err?.response?.data?.message || err?.message || 'Error desconocido';
        throw new Error(`Error al verificar email: ${errorMessage}`);
      }
    },
    [verifyEmailMutation]
  );

  const handleVerifyPhone = useCallback(
    async (userId: number) => {
      try {
        await verifyPhoneMutation.mutateAsync(userId);
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = err?.response?.data?.message || err?.message || 'Error desconocido';
        throw new Error(`Error al verificar teléfono: ${errorMessage}`);
      }
    },
    [verifyPhoneMutation]
  );

  const handleViewProperties = useCallback((user: UserListItem) => {
    setViewingUserId(user.id);
    setIsPropertiesModalOpen(true);
  }, []);

  const handleViewProjects = useCallback((user: UserListItem) => {
    setViewingUserId(user.id);
    setIsProjectsModalOpen(true);
  }, []);

  const confirmRoleChange = useCallback(
    async (newRole: string, reason: string) => {
      if (!selectedUser) return;
      await changeRoleMutation.mutateAsync({
        userId: selectedUser.id,
        request: {
          newRole: newRole as 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN',
          reason,
        } as ChangeUserRoleRequest,
      });
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    },
    [selectedUser, changeRoleMutation]
  );

  const handleDeleteUser = useCallback((user: UserListItem) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setDeleteReason('');
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(async () => {
    if (!selectedUserId) return;
    await deleteUserMutation.mutateAsync({
      userId: selectedUserId,
      reason: deleteReason || undefined,
    });
    setIsDeleteModalOpen(false);
    setDeleteReason('');
    setSelectedUserId(null);
    setSelectedUser(null);
  }, [selectedUserId, deleteReason, deleteUserMutation]);

  const confirmToggleStatus = useCallback(
    async (reason: string) => {
      if (!selectedUserId || !selectedUser) return;
      await toggleStatusMutation.mutateAsync({
        userId: selectedUserId,
        enabled: !selectedUser.enabled,
        reason: reason || undefined,
      });
      setIsToggleModalOpen(false);
      setToggleReason('');
      setSelectedUserId(null);
      setSelectedUser(null);
    },
    [selectedUserId, selectedUser, toggleStatusMutation]
  );

  const handleClearFilters = useCallback(() => {
    setFiltersState({
      searchQuery: '',
      statusFilter: 'all',
      roleFilter: '',
      userTypeFilter: 'ALL',
    });
    setCurrentPage(1);
  }, []);

  return {
    // Datos
    users,
    totalElements,
    isLoading,
    error,

    // Filtros
    filters,
    setFilters,

    // Paginación
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,

    // Vista
    viewMode,
    setViewMode,

    // Selección
    selectedUsers,
    setSelectedUsers,

    // Modales
    detailUserId,
    setDetailUserId,
    isViewModalOpen,
    setIsViewModalOpen,
    selectedUser,
    setSelectedUser,
    isRoleModalOpen,
    setIsRoleModalOpen,
    isToggleModalOpen,
    setIsToggleModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isPropertiesModalOpen,
    setIsPropertiesModalOpen,
    isProjectsModalOpen,
    setIsProjectsModalOpen,
    viewingUserId,
    setViewingUserId,
    setToggleReason,
    setDeleteReason,

    // Mutaciones
    toggleStatusMutation,
    deleteUserMutation,
    changeRoleMutation,
    verifyEmailMutation,
    verifyPhoneMutation,

    // Datos de detalle
    userDetailData,
    isLoadingDetail,

    // Datos de propiedades/proyectos
    userPropertiesData,
    isLoadingProperties,
    userProjectsData,
    isLoadingProjects,

    // Permisos
    canManageUsers,
    canDeleteUsers,
    canChangeRoles,
    canVerifyUsers,

    // Acciones
    handleViewUser,
    handleToggleStatus,
    handleChangeRole,
    handleVerifyEmail,
    handleVerifyPhone,
    handleViewProperties,
    handleViewProjects,
    confirmRoleChange,
    confirmDeleteUser,
    confirmToggleStatus,
    handleDeleteUser,
    handleClearFilters,
    refetch,
  };
}