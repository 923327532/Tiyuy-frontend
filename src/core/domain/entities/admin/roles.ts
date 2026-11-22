/**
 * Admin domain entities — Roles, permissions and admin accounts
 */
// Admin role types matching backend AdminRoleType
export type AdminRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT';

// Department types matching backend DepartmentType
export type DepartmentType = 
  | 'USER_MANAGEMENT' 
  | 'PROPERTY_MANAGEMENT' 
  | 'COMMUNICATIONS' 
  | 'FINANCE' 
  | 'ANALYTICS'
  | 'ACTORS'
  | 'SYSTEM';

// Permission enum matching backend Permission.java
export type Permission =
  // User Management
  | 'USERS_VIEW' | 'USERS_CREATE' | 'USERS_UPDATE' | 'USERS_DELETE' 
  | 'USERS_CHANGE_ROLE' | 'USERS_VERIFY'
  // Property Management
  | 'PROPERTIES_VIEW' | 'PROPERTIES_MODERATE' | 'PROPERTIES_DELETE' | 'PROPERTIES_FEATURE'
  | 'PROJECTS_VIEW' | 'PROJECTS_MODERATE' | 'PROJECTS_DELETE'
  | 'AGENCIES_VIEW' | 'AGENCIES_MANAGE'
  // Communications
  | 'COMMUNICATIONS_VIEW' | 'COMMUNICATIONS_MANAGE' | 'EVENTS_VIEW' | 'CHAT_MONITOR'
  | 'GROUPS_VIEW' | 'GROUPS_MANAGE'
  // Finance
  | 'FINANCE_VIEW' | 'FINANCE_MANAGE_SUBSCRIPTIONS' | 'FINANCE_REFUNDS'
  | 'DISCOUNTS_CREATE' | 'DISCOUNTS_MANAGE'
  // Analytics
  | 'ANALYTICS_VIEW' | 'ANALYTICS_EXPORT' | 'ANALYTICS_DASHBOARD'
  // Admin Management
  | 'ADMINS_VIEW' | 'ADMINS_CREATE' | 'ADMINS_UPDATE' | 'ADMINS_DELETE' | 'DEPARTMENTS_MANAGE'
  // Global
  | 'NOTIFICATIONS_SEND' | 'AUDIT_LOGS_VIEW' | 'SYSTEM_CONFIG';

// Department entity
export interface Department {
  id: number;
  type: DepartmentType;
  displayName: string;
  description: string;
}

// Admin user entity matching AdminUserResponse from backend
export interface AdminUser {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roleType: AdminRoleType;
  departments: DepartmentType[];
  permissions?: Permission[];
  additionalPermissions?: Permission[];
  active: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

// Request to create a new admin/support account (User) via SuperAdminController
export interface CreateAdminAccountRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Admin user creation request (matches backend CreateAdminUserRequest DTO)
export interface CreateAdminUserRequest {
  userId: number;
  roleType: AdminRoleType;
  departments: DepartmentType[];
  additionalPermissions: Permission[];
}

// Admin user update request (matches backend UpdateAdminUserRequest DTO)
export interface UpdateAdminUserRequest {
  departments?: DepartmentType[];
  additionalPermissions?: Permission[];
  active?: boolean;
}

// Admin navigation item
export interface AdminNavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  requiredPermissions: Permission[];
  department: DepartmentType;
  badge?: number;
}

// Admin sidebar section
export interface AdminSidebarSection {
  title: string;
  department: DepartmentType;
  items: AdminNavItem[];
}

