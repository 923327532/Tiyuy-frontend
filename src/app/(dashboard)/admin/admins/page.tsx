/**
 * Admin Users Management Page
 * Only SUPER_ADMIN can create new admin users
 * Flow: Step 1 - Create User account (email/password) -> Step 2 - Assign permissions (departments/roleType)
 */

'use client';

import { useState, useMemo } from 'react';
import { 
  useAdmins, 
  useCreateAdmin, 
  useUpdateAdmin,
  useDeleteAdmin,
  useCreateAdminAccount,
  useCreateSupportAccount,
  useToggleAdminStatus,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useCreateActionParam } from '@/presentation/hooks/useCreateActionParam';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { Modal } from '@/presentation/components/ui/Modal';
import { AdminRoleType, Permission, DepartmentType } from '@/core/domain/entities/Admin';

// Available permissions organized by department
const PERMISSIONS_BY_DEPT: Record<string, Permission[]> = {
  'User Management': [
    'USERS_VIEW', 'USERS_CREATE', 'USERS_UPDATE', 'USERS_DELETE', 
    'USERS_CHANGE_ROLE', 'USERS_VERIFY'
  ],
  'Property Management': [
    'PROPERTIES_VIEW', 'PROPERTIES_MODERATE', 'PROPERTIES_DELETE', 'PROPERTIES_FEATURE',
    'PROJECTS_VIEW', 'PROJECTS_MODERATE', 'PROJECTS_DELETE'
  ],
  'Finance': [
    'FINANCE_VIEW', 'FINANCE_MANAGE_SUBSCRIPTIONS', 'FINANCE_REFUNDS',
    'DISCOUNTS_CREATE', 'DISCOUNTS_MANAGE'
  ],
  'Analytics': [
    'ANALYTICS_VIEW', 'ANALYTICS_EXPORT', 'ANALYTICS_DASHBOARD',
    'AUDIT_LOGS_VIEW'
  ],
  'Communications': [
    'COMMUNICATIONS_VIEW', 'COMMUNICATIONS_MANAGE', 'EVENTS_VIEW', 'CHAT_MONITOR',
    'NOTIFICATIONS_SEND'
  ],
  'Admin Management': [
    'ADMINS_VIEW', 'ADMINS_CREATE', 'ADMINS_UPDATE', 'ADMINS_DELETE', 'DEPARTMENTS_MANAGE'
  ],
};

const DEPARTMENT_OPTIONS: DepartmentType[] = [
  'USER_MANAGEMENT',
  'PROPERTY_MANAGEMENT', 
  'FINANCE',
  'ANALYTICS',
  'COMMUNICATIONS',
  'ACTORS',
  'SYSTEM'
];

const ROLE_CONFIG = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    badge: 'bg-purple-100 text-purple-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Acceso Total',
    description: 'Tiene acceso completo a todas las secciones y configuraciones del sistema.',
  },
  ADMIN: {
    label: 'Administrador',
    badge: 'bg-blue-100 text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Acceso por Departamentos',
    description: 'Gestiona operaciones internas, usuarios, propiedades y reportes según sus permisos.',
  },
  SUPPORT: {
    label: 'Soporte',
    badge: 'bg-amber-100 text-amber-800',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: 'Acceso Limitado',
    description: 'Gestiona incidencias y soporte operativo con acceso restringido a funcionalidades.',
  },
};

export default function AdminUsersPage() {
  const { isSuperAdmin } = usePermissions();
  const { data: adminsData, isLoading } = useAdmins({ page: 0, size: 50 });
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const createAdminAccount = useCreateAdminAccount();
  const createSupportAccount = useCreateSupportAccount();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'account' | 'permissions'>('account');
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [createdUserEmail, setCreatedUserEmail] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [previewRole, setPreviewRole] = useState<AdminRoleType | null>(null);

  // Abre el selector de rol cuando se llega desde el menú "Crear".
  useCreateActionParam(() => setShowCreateDropdown(true));

  // Step 1: Account form
  const [accountForm, setAccountForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    role: 'ADMIN' as AdminRoleType,
  });

  // Step 2: Permissions form
  const [permForm, setPermForm] = useState({
    departments: [] as DepartmentType[],
    permissions: [] as Permission[],
  });

  const [editForm, setEditForm] = useState({
    departments: [] as DepartmentType[],
    permissions: [] as Permission[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForms = () => {
    setCurrentStep('account');
    setCreatedUserId(null);
    setCreatedUserEmail('');
    setAccountForm({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      role: 'ADMIN',
    });
    setPermForm({
      departments: [],
      permissions: [],
    });
    setErrors({});
    setPreviewRole(null);
  };

  const validateAccountForm = () => {
    const newErrors: Record<string, string> = {};
    if (!accountForm.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(accountForm.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }
    if (!accountForm.firstName) newErrors.firstName = 'El nombre es requerido';
    if (!accountForm.lastName) newErrors.lastName = 'El apellido es requerido';
    if (accountForm.phone && !/^\d{9}$/.test(accountForm.phone)) {
      newErrors.phone = 'El teléfono debe tener exactamente 9 dígitos';
    }
    if (!accountForm.password || accountForm.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePermForm = () => {
    const newErrors: Record<string, string> = {};
    if (permForm.departments.length === 0) {
      newErrors.departments = 'Al menos un departamento es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Create the User account
  const handleCreateAccount = async () => {
    if (!validateAccountForm()) return;

    try {
      let result;
      if (accountForm.role === 'SUPPORT') {
        result = await createSupportAccount.mutateAsync({
          email: accountForm.email,
          phone: accountForm.phone,
          password: accountForm.password,
          firstName: accountForm.firstName,
          lastName: accountForm.lastName,
        });
      } else {
        result = await createAdminAccount.mutateAsync({
          email: accountForm.email,
          phone: accountForm.phone,
          password: accountForm.password,
          firstName: accountForm.firstName,
          lastName: accountForm.lastName,
        });
      }

      setCreatedUserId(result.userId);
      setCreatedUserEmail(result.email);
      setCurrentStep('permissions');
      setErrors({});
    } catch (error: any) {
      console.error('Error creating account:', error);
      // Manejar errores específicos del backend
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message || '';
      
      if (status === 409) {
        if (message?.toLowerCase().includes('email')) {
          setErrors({ email: 'Este email ya está registrado. Usa otro diferente.', submit: '' });
        } else if (message?.toLowerCase().includes('teléfono') || message?.toLowerCase().includes('phone')) {
          setErrors({ phone: 'Este teléfono ya está registrado. Usa otro diferente.', submit: '' });
        } else {
          setErrors({ submit: `Conflicto: ${message || 'El email o teléfono ya existen'}` });
        }
      } else if (status === 400) {
        setErrors({ submit: `Datos inválidos: ${message || 'Revisa los campos ingresados'}` });
      } else {
        setErrors({ submit: `Error al crear la cuenta: ${message || 'Intente nuevamente.'}` });
      }
    }
  };

  // Step 2: Assign permissions to the created user
  const handleAssignPermissions = async () => {
    if (!validatePermForm() || !createdUserId) return;

    try {
      await createAdmin.mutateAsync({
        userId: createdUserId,
        roleType: accountForm.role,
        departments: permForm.departments,
        additionalPermissions: permForm.permissions,
      });

      setIsCreateModalOpen(false);
      resetForms();
    } catch (error) {
      console.error('Error assigning permissions:', error);
      setErrors({ submit: 'Error al asignar permisos. Intente nuevamente.' });
    }
  };

  const toggleAdminStatus = useToggleAdminStatus();

  const handleToggleStatus = async (adminId: number, active: boolean) => {
    const action = active ? 'reanudar' : 'pausar';
    if (!confirm(`¿Estás seguro de ${action} este admin?`)) return;
    try {
      await toggleAdminStatus.mutateAsync({ adminId, active });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      alert('Error al cambiar el estado del admin');
    }
  };

  const handleDelete = async (adminId: number) => {
    if (!confirm('¿Estás seguro de eliminar este admin?')) return;
    await deleteAdmin.mutateAsync(adminId);
  };

  const toggleDepartment = (dept: DepartmentType) => {
    setPermForm(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const togglePermission = (permission: Permission) => {
    setPermForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    setEditForm({
      departments: admin.departments || [],
      permissions: admin.additionalPermissions || [],
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAdmin) return;
    try {
      await updateAdmin.mutateAsync({
        adminId: editingAdmin.id,
        request: {
          departments: editForm.departments,
          additionalPermissions: editForm.permissions,
        },
      });
      setIsEditModalOpen(false);
      setEditingAdmin(null);
    } catch (error) {
      console.error('Error updating admin:', error);
      setErrors({ submit: 'Error al actualizar el admin. Intente nuevamente.' });
    }
  };

  const handleOpenCreate = (role: AdminRoleType) => {
    setShowCreateDropdown(false);
    setAccountForm(prev => ({ ...prev, role }));
    setPreviewRole(role);
    setIsCreateModalOpen(true);
  };

  // Filtered lists
  const filteredAdmins = useMemo(() => {
    if (!adminsData?.content) return [];
    const q = searchQuery.toLowerCase();
    return adminsData.content.filter(admin =>
      !q || 
      admin.firstName?.toLowerCase().includes(q) ||
      admin.lastName?.toLowerCase().includes(q) ||
      admin.email?.toLowerCase().includes(q)
    );
  }, [adminsData, searchQuery]);

  const administrators = filteredAdmins.filter(
    a => a.roleType === 'ADMIN' || a.roleType === 'SUPER_ADMIN'
  );
  const supportUsers = filteredAdmins.filter(
    a => a.roleType === 'SUPPORT'
  );

  // Determine hero card content
  const heroRole = previewRole || 'SUPER_ADMIN';
  const heroConfig = ROLE_CONFIG[heroRole as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.SUPER_ADMIN;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-none space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Administradores</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gestiona los administradores del sistema y sus permisos
          </p>
        </div>
        {isSuperAdmin && (
          <div className="relative self-end sm:self-auto">
            <Button
              variant="primary"
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            >
              + Create
            </Button>
            {showCreateDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCreateDropdown(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => handleOpenCreate('ADMIN')}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Create Admin</div>
                      <div className="text-xs text-gray-500">Acceso por departamentos</div>
                    </div>
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={() => handleOpenCreate('SUPPORT')}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Create Support</div>
                      <div className="text-xs text-gray-500">Soporte operativo</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Hero Card ── */}
      <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 lg:gap-8">
            {/* Columna 1: Avatar */}
            <div className="flex justify-center sm:justify-start">
              <div className={`w-16 h-16 sm:w-20 sm:h-24 lg:w-24 lg:h-24 rounded-full ${heroConfig.iconBg} flex items-center justify-center`}>
                <svg className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${heroConfig.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>

            {/* Columna 2: Info personal */}
            <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {previewRole ? 'Nuevo Usuario' : 'Super Administrador'}
                </h2>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${heroConfig.badge}`}>
                  {heroConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {previewRole ? 'admin@ejemplo.com' : 'admin@tiyuy.com'}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-700 font-medium">Activo</span>
              </div>
            </div>

            {/* Columna 3: Descripción de acceso */}
            <div className="sm:border-l border-slate-200 sm:pl-4 lg:pl-8 sm:max-w-[200px] lg:max-w-[280px]">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{heroConfig.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 leading-relaxed">
                {heroConfig.description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Main Content: Listado + Sidebar ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Listado */}
        <div className="space-y-6">
          {/* Barra de acciones */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {filteredAdmins.length} administradores
              </span>
            </div>
            <div className="relative w-full sm:w-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar administrador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 h-11 pl-10 pr-4 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Bloque: Administradores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Administradores
            </h3>
            <div className="space-y-3">
              {administrators.length === 0 && (
                <Card className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm text-gray-500">No hay administradores</p>
                </Card>
              )}
              {administrators.map((admin) => {
                const cfg = ROLE_CONFIG[admin.roleType as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.ADMIN;
                return (
                  <Card key={admin.id} className="rounded-2xl shadow-sm border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-xs sm:text-sm font-bold ${cfg.iconColor}`}>
                          {admin.firstName?.[0]}{admin.lastName?.[0]}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {admin.firstName} {admin.lastName}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge} w-fit`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{admin.email}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${admin.active ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-gray-500">{admin.active ? 'Activo' : 'Inactivo'}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            Último acceso: {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : 'Nunca'}
                          </span>
                        </div>
                        {/* Departments badges */}
                        {admin.departments && admin.departments.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {admin.departments.map((dept: string) => (
                              <span key={dept} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                                {dept.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                        >
                          Editar
                        </button>
                        {isSuperAdmin && admin.roleType !== 'SUPER_ADMIN' && (
                          <>
                            <button
                              onClick={() => handleDelete(admin.id)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => handleToggleStatus(admin.id, !admin.active)}
                              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors font-medium ${
                                admin.active
                                  ? 'text-orange-600 hover:bg-orange-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {admin.active ? 'Pausar' : 'Reanudar'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bloque: Soporte */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Soporte
            </h3>
            <div className="space-y-3">
              {supportUsers.length === 0 && (
                <Card className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm text-gray-500">No hay usuarios de soporte</p>
                </Card>
              )}
              {supportUsers.map((admin) => {
                const cfg = ROLE_CONFIG.SUPPORT;
                return (
                  <Card key={admin.id} className="rounded-2xl shadow-sm border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-xs sm:text-sm font-bold ${cfg.iconColor}`}>
                          {admin.firstName?.[0]}{admin.lastName?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {admin.firstName} {admin.lastName}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge} w-fit`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{admin.email}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${admin.active ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-gray-500">{admin.active ? 'Activo' : 'Inactivo'}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            Último acceso: {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : 'Nunca'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                        >
                          Editar
                        </button>
                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => handleDelete(admin.id)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => handleToggleStatus(admin.id, !admin.active)}
                              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors font-medium ${
                                admin.active
                                  ? 'text-orange-600 hover:bg-orange-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {admin.active ? 'Pausar' : 'Reanudar'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Card: Permisos y Roles */}
          <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Permisos y Roles</h3>
                <p className="text-xs text-gray-500">Gestión de accesos</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Super Admin</strong> — Acceso total al sistema</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Admin</strong> — Acceso por departamentos asignados</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Support</strong> — Acceso limitado a soporte</span>
              </div>
            </div>
          </Card>

          {/* Card: Departamentos */}
          <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Departamentos</h3>
                <p className="text-xs text-gray-500">Áreas del sistema</p>
              </div>
            </div>
            <div className="space-y-2">
              {DEPARTMENT_OPTIONS.map((dept) => (
                <div key={dept} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-700 font-medium">
                    {dept.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Create Admin Modal ── */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForms();
        }}
        title={currentStep === 'account' ? 'Crear Administrador' : 'Asignar Permisos'}
        size="lg"
      >
        {/* Role info card */}
        {currentStep === 'account' && (
          <div className={`mb-6 p-4 rounded-2xl border ${
            accountForm.role === 'SUPPORT' 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${
                accountForm.role === 'SUPPORT' ? 'bg-amber-100' : 'bg-blue-100'
              } flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${
                  accountForm.role === 'SUPPORT' ? 'text-amber-600' : 'text-blue-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {accountForm.role === 'SUPPORT' ? 'Soporte' : 'Administrador'}
                </h3>
                <p className="text-sm text-gray-600">
                  {accountForm.role === 'SUPPORT'
                    ? 'Gestiona incidencias y soporte operativo.'
                    : 'Gestiona operaciones internas, usuarios, propiedades y reportes.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex items-center gap-2 ${currentStep === 'account' ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === 'account' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
              {currentStep === 'permissions' ? '✓' : '1'}
            </div>
            <span className="text-sm font-medium">Crear Cuenta</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-2" />
          <div className={`flex items-center gap-2 ${currentStep === 'permissions' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === 'permissions' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Asignar Permisos</span>
          </div>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {currentStep === 'account' ? (
          /* ── Step 1: Account Form ── */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={accountForm.firstName}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nombre"
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={accountForm.lastName}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Apellido"
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={accountForm.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setAccountForm(prev => ({ ...prev, phone: value }));
                }}
                maxLength={9}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="999 999 999"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Mínimo 8 caracteres"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForms();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateAccount}
                isLoading={createAdminAccount.isPending || createSupportAccount.isPending}
              >
                Crear Cuenta
              </Button>
            </div>
          </div>
        ) : (
          /* ── Step 2: Permissions Form ── */
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700">
                Cuenta creada exitosamente para <strong>{createdUserEmail}</strong>. 
                Ahora asigna los permisos y departamentos.
              </p>
            </div>

            {/* Departments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departamentos</label>
              <div className="grid grid-cols-2 gap-2">
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <label key={dept} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={permForm.departments.includes(dept)}
                      onChange={() => toggleDepartment(dept)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{dept.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              {errors.departments && <p className="text-xs text-red-500 mt-1">{errors.departments}</p>}
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permisos Adicionales</label>
              <div className="space-y-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                {Object.entries(PERMISSIONS_BY_DEPT).map(([deptName, permissions]) => (
                  <div key={deptName}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{deptName}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={permForm.permissions.includes(perm)}
                            onChange={() => togglePermission(perm)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-xs text-gray-600">{perm.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentStep('account');
                  setCreatedUserId(null);
                  setCreatedUserEmail('');
                }}
              >
                Volver
              </Button>
              <Button
                variant="primary"
                onClick={handleAssignPermissions}
                isLoading={createAdmin.isPending}
              >
                Asignar Permisos
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Admin Modal ── */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAdmin(null);
        }}
        title={`Editar Admin: ${editingAdmin?.firstName} ${editingAdmin?.lastName}`}
        size="lg"
      >
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Departments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamentos
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENT_OPTIONS.map((dept) => (
                <label key={dept} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={editForm.departments.includes(dept)}
                    onChange={() => {
                      setEditForm(prev => ({
                        ...prev,
                        departments: prev.departments.includes(dept)
                          ? prev.departments.filter(d => d !== dept)
                          : [...prev.departments, dept]
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{dept.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permisos Adicionales
            </label>
            <div className="space-y-3 max-h-48 overflow-y-auto border rounded-lg p-3">
              {Object.entries(PERMISSIONS_BY_DEPT).map(([deptName, permissions]) => (
                <div key={deptName}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{deptName}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((perm) => (
                      <label key={perm} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editForm.permissions.includes(perm)}
                          onChange={() => {
                            setEditForm(prev => ({
                              ...prev,
                              permissions: prev.permissions.includes(perm)
                                ? prev.permissions.filter(p => p !== perm)
                                : [...prev.permissions, perm]
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs text-gray-600">{perm.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingAdmin(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              isLoading={updateAdmin.isPending}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
