'use client';

import { useState, useMemo } from 'react';
import {
  useUsers,
  useToggleUserStatus,
  useDeleteUser,
  useUserById,
  useChangeUserRole,
  useVerifyUserEmail,
  useVerifyUserPhone,
  useUserProperties,
  useUserProjects
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/Card';
import { Modal } from '@/presentation/components/ui/Modal';
import { Button } from '@/presentation/components/ui/Button';
import { AdminBulkOperations } from '@/presentation/components/admin/AdminBulkOperations/AdminBulkOperations';
import { UsersHeaderStats } from '@/presentation/components/admin/UsersHeaderStats/UsersHeaderStats';
import { UsersFilters } from '@/presentation/components/admin/UsersFilters/UsersFilters';
import { UserDetailModal } from '@/presentation/components/admin/users/UserDetailModal';
import { RoleChangeModal } from '@/presentation/components/admin/RoleChangeModal/RoleChangeModal';
import { UserPropertiesModal } from '@/presentation/components/admin/UserPropertiesModal/UserPropertiesModal';
import { UserProjectsModal } from '@/presentation/components/admin/UserProjectsModal/UserProjectsModal';
import { UserListItem, ChangeUserRoleRequest } from '@/core/domain/entities/Admin';
import { toast } from '@/presentation/store/toastStore';
import { ChevronLeft, ChevronRight, Mail, Phone, Users, LayoutGrid, List } from 'lucide-react';
import { UserCardView } from '@/presentation/components/admin/UserCardView/UserCardView';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<"ADMIN" | "USER" | "AGENT" | "DEVELOPER" | "">('');
  const [userTypeFilter, setUserTypeFilter] = useState<'ALL' | 'WITH_PROPERTIES' | 'WITH_PROJECTS' | 'NORMAL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedUsers, setSelectedUsers] = useState<UserListItem[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [toggleReason, setToggleReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const { hasPermission, isSuperAdmin } = usePermissions();

  // Fetch datos completos del usuario cuando se abre el modal de detalle
  const { data: userDetailData, isLoading: isLoadingDetail } = useUserById(detailUserId || 0);
  const canVerifyUsers = hasPermission('USERS_VERIFY');
  const canManageUsers = hasPermission('USERS_UPDATE') || isSuperAdmin;
  const canDeleteUsers = hasPermission('USERS_DELETE') || isSuperAdmin;
  const canChangeRoles = hasPermission('USERS_CHANGE_ROLE');

  const enabledParam = statusFilter === 'enabled' ? true : statusFilter === 'disabled' ? false : undefined;

  const { data: usersData, isLoading, error, refetch } = useUsers(
    roleFilter || undefined,
    enabledParam,
    searchQuery || undefined,
    { page: currentPage - 1, size: pageSize }
  );

  const toggleStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();
  const changeRoleMutation = useChangeUserRole();
  const verifyEmailMutation = useVerifyUserEmail();
  const verifyPhoneMutation = useVerifyUserPhone();

  const { data: userPropertiesData, isLoading: isLoadingProperties } = useUserProperties(viewingUserId);
  const { data: userProjectsData, isLoading: isLoadingProjects } = useUserProjects(viewingUserId);

  const handleViewUser = (user: UserListItem) => {
    setSelectedUser(user);
    setDetailUserId(user.id);
    setIsViewModalOpen(true);
  };

  // Usar datos completos si están disponibles, sino los de la lista
  const displayUser = userDetailData || selectedUser;

  const handleToggleStatus = async (user: UserListItem) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsToggleModalOpen(true);
  };

  const handleChangeRole = async (user: UserListItem) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleVerifyEmail = async (userId: number) => {
    if (!userId) {
      toast.error('ID de usuario no válido');
      return;
    }
    try {
      await verifyEmailMutation.mutateAsync(userId);
      toast.success('Email verificado correctamente');
      // Refetch datos del usuario y lista
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      toast.error(`Error al verificar email: ${errorMessage}`);
      console.error('Error verifying email:', error);
    }
  };

  const handleVerifyPhone = async (userId: number) => {
    if (!userId) {
      toast.error('ID de usuario no válido');
      return;
    }
    try {
      await verifyPhoneMutation.mutateAsync(userId);
      toast.success('Teléfono verificado correctamente');
      // Refetch datos del usuario y lista
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      toast.error(`Error al verificar teléfono: ${errorMessage}`);
      console.error('Error verifying phone:', error);
    }
  };

  const handleViewProperties = (user: UserListItem) => {
    setViewingUserId(user.id);
    setIsPropertiesModalOpen(true);
  };

  const handleViewProjects = (user: UserListItem) => {
    setViewingUserId(user.id);
    setIsProjectsModalOpen(true);
  };

  const confirmRoleChange = async (newRole: string, reason: string) => {
    if (!selectedUser) return;

    await changeRoleMutation.mutateAsync({
      userId: selectedUser.id,
      request: {
        newRole: newRole as any,
        reason
      }
    });
    setIsRoleModalOpen(false);
    setSelectedUser(null);
    refetch();
  };

  const handleDeleteUser = (user: UserListItem) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setDeleteReason('');
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUserMutation.mutateAsync({
        userId: selectedUserId,
        reason: deleteReason || undefined,
      });
      toast.success('Usuario eliminado correctamente');
      setIsDeleteModalOpen(false);
      setDeleteReason('');
      setSelectedUserId(null);
      setSelectedUser(null);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      toast.error(`Error al eliminar usuario: ${errorMessage}`);
    }
  };

  const confirmToggleStatus = async () => {
    if (!selectedUserId) return;

    await toggleStatusMutation.mutateAsync({
      userId: selectedUserId,
      enabled: !selectedUser?.enabled,
      reason: toggleReason || undefined,
    });

    setIsToggleModalOpen(false);
    setToggleReason('');
    setSelectedUserId(null);
    setSelectedUser(null);
    refetch();
  };

  // Función auxiliar para formatear valores para renderizado
  const formatCellValue = (user: UserListItem, key: keyof UserListItem): React.ReactNode => {
    const value = user[key];
    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
    if (value === undefined || value === null) {
      return '-';
    }
    return value;
  };

  // Type definition for table columns
  type TableColumn = {
    key: keyof UserListItem;
    label: string;
    sortable: boolean;
    width: string;
    render?: (...args: any[]) => React.ReactNode;
  };

  // Table columns dinámicas según rol filtrado
  const columns = useMemo(() => {
    const baseColumns: TableColumn[] = [
      {
        key: 'email' as keyof UserListItem,
        label: 'Usuario',
        sortable: true,
        width: '280px',
        render: (value: string, user: UserListItem) => (
          <div className="flex items-center gap-3">
            {user.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-medium">
                {user.firstName?.[0] || user.email[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{user.firstName} {user.lastName}</div>
            </div>
          </div>
        )
      },
      {
        key: 'role' as keyof UserListItem,
        label: 'Rol',
        sortable: true,
        width: '100px',
        render: (value: string, _user?: UserListItem) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
            value === 'AGENT' ? 'bg-blue-100 text-blue-800' :
            value === 'DEVELOPER' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value}
          </span>
        )
      },
      {
        key: 'enabled' as keyof UserListItem,
        label: 'Estado',
        sortable: true,
        width: '90px',
        render: (value: boolean, _user?: UserListItem) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Activo' : 'Desactivado'}
          </span>
        )
      },
      {
        key: 'emailVerified' as keyof UserListItem,
        label: 'Verif.',
        sortable: false,
        width: '80px',
        render: (value: boolean, user: UserListItem) => (
          <div className="flex items-center gap-2">
            {/* Email */}
            <div className="flex items-center" title={user.emailVerified ? 'Email Verificado' : 'Email Pendiente'}>
              <Mail className="" />
            </div>
            {/* Phone */}
            <div className="flex items-center" title={user.phoneVerified ? 'Teléfono Verificado' : 'Teléfono Pendiente'}>
              <Phone className={`w-4 h-4 ${user.phoneVerified ? 'text-green-500' : 'text-yellow-500'}`} />
            </div>
          </div>
        )
      }
    ];

    // Columnas condicionales según rol
    const conditionalColumns: TableColumn[] = [];

    // DEVELOPER: solo muestra Proyectos
    // AGENT y USER: solo muestra Propiedades
    // Sin filtro o ALL/ADMIN: muestra ambas
    if (roleFilter === 'DEVELOPER') {
      conditionalColumns.push({
        key: 'publishedProjectsCount' as keyof UserListItem,
        label: 'Proyectos',
        sortable: true,
        width: '100px',
        render: (value: number, user: UserListItem) => (
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">{value || 0}</span>
            {value > 0 && (
              <button
                onClick={() => handleViewProjects(user)}
                className="text-xs px-1 py-0.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                V
              </button>
            )}
          </div>
        )
      });
    } else if (roleFilter === 'AGENT' || roleFilter === 'USER') {
      conditionalColumns.push({
        key: 'publishedPropertiesCount' as keyof UserListItem,
        label: 'Propiedades',
        sortable: true,
        width: '100px',
        render: (value: number, user: UserListItem) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{value || 0}</span>
            {value > 0 && (
              <button
                onClick={() => handleViewProperties(user)}
                className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
              >
                Ver
              </button>
            )}
          </div>
        )
      });
    } else {
      // Sin filtro específico: mostrar ambas columnas
      conditionalColumns.push({
        key: 'publishedPropertiesCount' as keyof UserListItem,
        label: 'Propiedades',
        sortable: true,
        width: '90px',
        render: (value: number, user: UserListItem) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{value || 0}</span>
            {value > 0 && (
              <button
                onClick={() => handleViewProperties(user)}
                className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
              >
                Ver
              </button>
            )}
          </div>
        )
      });
      conditionalColumns.push({
        key: 'publishedProjectsCount' as keyof UserListItem,
        label: 'Proyectos',
        sortable: true,
        width: '90px',
        render: (value: number, user: UserListItem) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{value || 0}</span>
            {value > 0 && (
              <button
                onClick={() => handleViewProjects(user)}
                className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                Ver
              </button>
            )}
          </div>
        )
      });
    }

    return [
      ...baseColumns,
      ...conditionalColumns,
      {
        key: 'lastLoginAt' as keyof UserListItem,
        label: 'Ult. Login',
        sortable: true,
        width: '100px',
        render: (value: string | Date, _user?: UserListItem) => value ? new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'Nunca'
      }
    ];
  }, [roleFilter, handleViewProperties, handleViewProjects]);

  // Table actions - solo mostrar Ver Detalle en la tabla, resto en bulk
  const actions = [
    {
      label: 'Ver Detalle',
      onClick: handleViewUser,
      variant: 'primary' as const
    }
  ];

  // Filter options
  const filterOptions = [
    {
      key: 'status',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos los Estados' },
        { value: 'enabled', label: 'Activo' },
        { value: 'disabled', label: 'Desactivado' }
      ]
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos los Roles' },
        { value: 'USER', label: 'Usuario' },
        { value: 'AGENT', label: 'Agente' },
        { value: 'DEVELOPER', label: 'Desarrollador' },
        { value: 'ADMIN', label: 'Admin' }
      ]
    }
  ];

  const handleFilterChange = (filters: Record<string, any>) => {
    if (filters.status !== undefined) {
      setStatusFilter(filters.status);
    }
    if (filters.role !== undefined) {
      setRoleFilter(filters.role);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setRoleFilter('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Calculate stats
  const activeUsers = usersData?.content?.filter(u => u.enabled).length || 0;
  const pendingUsers = usersData?.content?.filter(u => !u.emailVerified || !u.phoneVerified).length || 0;
  const totalUsers = usersData?.totalElements || 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-3 sm:py-4">
      {/* Header - 3 tarjetas en fila */}
      <UsersHeaderStats activeUsers={activeUsers} pendingUsers={pendingUsers} totalUsers={totalUsers} />

      {/* Contenedor Principal */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Buscador y Filtros */}
        <UsersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleChange={(value) => setRoleFilter(value as any)}
          onClear={handleClearFilters}
        />

        {/* Toggle de vista: Tabla / Tarjetas */}
        <div className="flex items-center justify-end px-3 sm:px-6 py-2 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Tabla
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Tarjetas
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 text-sm">Cargando usuarios...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-3 font-medium text-sm">Error: {error.message}</div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!usersData?.content || usersData.content.length === 0) && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-2">No se encontraron usuarios</h4>
            <p className="text-gray-500 mb-3 text-sm">Intenta ajustar tu búsqueda o criterios de filtro.</p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {/* Vista Tabla */}
        {!isLoading && !error && usersData?.content && usersData.content.length > 0 && viewMode === 'table' && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={usersData.content.length > 0 && selectedUsers.length === usersData.content.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(usersData.content);
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-offset-2 border-gray-300 rounded"
                      />
                    </th>

                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                          column.sortable ? 'cursor-pointer hover:bg-gray-200/50 transition-colors' : ''
                        }`}
                        style={{ width: column.width, minWidth: column.width }}
                      >
                        {column.label}
                      </th>
                    ))}

                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {usersData.content.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.some(u => u.id === user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-offset-2 border-gray-300 rounded"
                        />
                      </td>

                      {columns.map((column) => (
                        <td key={String(column.key)} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {column.render ? column.render(user[column.key] as any, user as any) : formatCellValue(user, column.key)}
                        </td>
                      ))}

                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 shadow-sm hover:shadow-md transition-all"
                          >
                            Ver Detalle
                          </button>
                          {canManageUsers && (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={toggleStatusMutation.isPending && selectedUserId === user.id}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                                user.enabled
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={user.enabled ? 'Pausar usuario (deshabilitar temporalmente)' : 'Reanudar usuario (habilitar de nuevo)'}
                            >
                              {toggleStatusMutation.isPending && selectedUserId === user.id ? (
                                <>
                                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Procesando...
                                </>
                              ) : user.enabled ? (
                                'Pausar'
                              ) : (
                                'Reanudar'
                              )}
                            </button>
                          )}
                          {canDeleteUsers && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                              title="Eliminar usuario"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación Integrada */}
            <div className="px-3 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-gray-600">
                  {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, usersData.totalElements)} de {usersData.totalElements}
                </span>

                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <span className="text-xs sm:text-sm font-medium text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">
                  {currentPage}/{Math.ceil(usersData.totalElements / pageSize)}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(usersData.totalElements / pageSize)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Vista Tarjetas */}
        {!isLoading && !error && usersData?.content && usersData.content.length > 0 && viewMode === 'cards' && (
          <>
            <UserCardView
              users={usersData.content}
              onViewDetail={handleViewUser}
              onToggleStatus={canManageUsers ? handleToggleStatus : undefined}
              onDelete={canDeleteUsers ? handleDeleteUser : undefined}
              canManage={canManageUsers}
              canDelete={canDeleteUsers}
            />

            {/* Paginación para tarjetas */}
            <div className="px-3 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-gray-600">
                  {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, usersData.totalElements)} de {usersData.totalElements}
                </span>

                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <span className="text-xs sm:text-sm font-medium text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">
                  {currentPage}/{Math.ceil(usersData.totalElements / pageSize)}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(usersData.totalElements / pageSize)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Operations */}
      {selectedUsers.length > 0 && (
        <AdminBulkOperations
          selectedItems={selectedUsers}
          onClearSelection={() => setSelectedUsers([])}
          onOperationComplete={() => refetch()}
          itemType="users"
        />
      )}

      {/* User Details Modal */}
      <UserDetailModal
        user={displayUser}
        isLoading={isLoadingDetail}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setDetailUserId(null);
        }}
        onVerifyEmail={handleVerifyEmail}
        onVerifyPhone={handleVerifyPhone}
        onViewProperties={handleViewProperties}
        onViewProjects={handleViewProjects}
        isEmailVerifying={verifyEmailMutation.isPending}
        isPhoneVerifying={verifyPhoneMutation.isPending}
      />

      {/* Role Change Modal */}
      {selectedUser && (
        <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}>
          <RoleChangeModal
            user={selectedUser}
            onConfirm={confirmRoleChange}
            onCancel={() => setIsRoleModalOpen(false)}
          />
        </Modal>
      )}

      {/* Properties Modal */}
      <UserPropertiesModal
        data={userPropertiesData ?? null}
        isLoading={isLoadingProperties}
        isOpen={isPropertiesModalOpen}
        onClose={() => setIsPropertiesModalOpen(false)}
      />

      {/* Projects Modal */}
      <UserProjectsModal
        data={userProjectsData ?? null}
        isLoading={isLoadingProjects}
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
      />

      {/* Toggle Status Confirmation Modal */}
      <Modal isOpen={isToggleModalOpen} onClose={() => setIsToggleModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            {selectedUser?.enabled ? '¿Pausar usuario?' : '¿Reanudar usuario?'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {selectedUser?.enabled
              ? `¿Estás seguro de que deseas deshabilitar temporalmente al usuario ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email})?`
              : `¿Estás seguro de que deseas habilitar nuevamente al usuario ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email})?`
            }
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo (opcional)
            </label>
            <textarea
              value={toggleReason}
              onChange={(e) => setToggleReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={3}
              placeholder="Indica el motivo del cambio de estado..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsToggleModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmToggleStatus}
              disabled={toggleStatusMutation.isPending}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedUser?.enabled
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {toggleStatusMutation.isPending ? 'Procesando...' : selectedUser?.enabled ? 'Pausar usuario' : 'Reanudar usuario'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Eliminar usuario?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> ({selectedUser?.email})?
            Esta acción no se puede deshacer.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo (opcional)
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={3}
              placeholder="Indica el motivo de la eliminación..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteUserMutation.isPending ? 'Eliminando...' : 'Eliminar usuario'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
