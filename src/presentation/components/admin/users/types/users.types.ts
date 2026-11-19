/**
 * Users Types - Tipos centralizados para el panel de gestión de usuarios
 */

import type {
  UserListItem,
  UserPropertiesResponse,
  UserProjectsResponse,
} from '@/core/domain/entities/Admin';
import type { LucideIcon } from 'lucide-react';

/** Filtros de búsqueda y filtrado de usuarios */
export interface UsersFiltersState {
  searchQuery: string;
  statusFilter: string;
  roleFilter: 'ADMIN' | 'USER' | 'AGENT' | 'DEVELOPER' | '';
  userTypeFilter: 'ALL' | 'WITH_PROPERTIES' | 'WITH_PROJECTS' | 'NORMAL';
}

/** Opciones de filtro para dropdowns */
export interface FilterOption {
  value: string;
  label: string;
}

/** Props para tarjetas de estadísticas */
export interface UsersStatsProps {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers?: number;
  usersByRole?: Record<string, number>;
}

/** Props para barra de búsqueda y filtros */
export interface UsersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  onClear: () => void;
  statusOptions: FilterOption[];
  roleOptions: FilterOption[];
}

/** Columna de la tabla de usuarios */
export interface UserTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, user: UserListItem) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

/** Props para la tabla de usuarios */
export interface UsersTableProps {
  users: UserListItem[];
  columns: UserTableColumn[];
  selectedUsers: UserListItem[];
  onSelectionChange: (users: UserListItem[]) => void;
  onViewDetail: (user: UserListItem) => void;
  onToggleStatus?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
  canManage: boolean;
  canDelete: boolean;
  isLoading?: boolean;
  toggleStatusPending?: boolean;
  pendingUserId?: number | null;
}

/** Props para paginación */
export interface UsersPaginationProps {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/** Props para badge de estado de usuario */
export interface UserStatusBadgeProps {
  enabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  compact?: boolean;
}

/** Props para acciones de usuario */
export interface UserActionsProps {
  user: UserListItem;
  onViewDetail: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  onViewProperties: () => void;
  onViewProjects: () => void;
  canManage: boolean;
  canDelete: boolean;
  isTogglePending?: boolean;
  isDeletePending?: boolean;
}

/** Props para vista de tarjetas */
export interface UserCardViewProps {
  users: UserListItem[];
  onViewDetail: (user: UserListItem) => void;
  onToggleStatus?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  canManage?: boolean;
  canDelete?: boolean;
}

/** Estado del modal de detalle */
export interface UserDetailModalState {
  isOpen: boolean;
  user: UserListItem | null;
  detailUserId: number | null;
  isLoading: boolean;
}

/** Props para modal de detalle de usuario */
export interface UserDetailModalProps {
  user: UserListItem | null;
  extras?: import('@/presentation/components/admin/users/userTypes').UserDetailExtras;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onVerifyEmail: (userId: number) => void;
  onVerifyPhone: (userId: number) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
  onResolveCancellation?: (requestId: string, decision: 'APPROVE' | 'REJECT') => void;
  isEmailVerifying: boolean;
  isPhoneVerifying: boolean;
  isResolvingCancellation?: boolean;
}

/** Props para modal de cambio de rol */
export interface RoleChangeModalProps {
  user: UserListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newRole: string, reason: string) => Promise<void>;
}

/** Props para modal de confirmación de toggle status */
export interface ToggleStatusModalProps {
  user: UserListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isPending: boolean;
}

/** Props para modal de confirmación de eliminación */
export interface DeleteUserModalProps {
  user: UserListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isPending: boolean;
}

/** Props para modal de propiedades del usuario */
export interface UserPropertiesModalProps {
  data: UserPropertiesResponse | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

/** Props para modal de proyectos del usuario */
export interface UserProjectsModalProps {
  data: UserProjectsResponse | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

/** Props para operaciones en lote */
export interface AdminBulkOperationsProps {
  selectedItems: UserListItem[];
  onClearSelection: () => void;
  onOperationComplete: () => void;
  itemType: 'users';
}

/** Modo de vista */
export type ViewMode = 'table' | 'cards';

/** Configuración de rol para UI */
export interface RoleConfig {
  label: string;
  style: string;
  icon: LucideIcon;
}