'use client';

import type { ReactNode } from 'react';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';

/** Union type for all supported user types */
export type GenericUser = UserListItem | InternationalUserListItem;

/** Type discriminator to identify user type */
export type UserType = 'regular' | 'international';

/** Configuration for a table column */
export interface GenericColumn<T extends GenericUser> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

/** Configuration for row actions */
export interface GenericAction<T extends GenericUser> {
  key: string;
  label: string | ((row: T) => string);
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  show?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (row: T, event: React.MouseEvent) => void;
  ariaLabel?: (row: T) => string;
}

/** Configuration for user type-specific rendering */
export interface UserTypeConfig<T extends GenericUser> {
  type: UserType;
  /** Get display name for the user */
  getDisplayName: (user: T) => string;
  /** Get email for the user */
  getEmail: (user: T) => string;
  /** Get avatar initials */
  getInitials: (user: T) => string;
  /** Get avatar image URL (optional) */
  getAvatarUrl?: (user: T) => string | undefined;
  /** Get country for the user */
  getCountry?: (user: T) => string | undefined;
  /** Get document type for the user */
  getDocumentType?: (user: T) => string | undefined;
  /** Get document number for the user */
  getDocumentNumber?: (user: T) => string | undefined;
  /** Get registration date */
  getRegisteredAt: (user: T) => Date | string | undefined;
  /** Get status for badge display */
  getStatus: (user: T) => { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' };
  /** Check if user is disabled */
  isDisabled?: (user: T) => boolean;
  /** Unique identifier for the row */
  getRowKey: (user: T) => string | number;
}

/** Search configuration */
export interface SearchConfig {
  placeholder?: string;
  debounceMs?: number;
  /** Fields to search in - will match against user properties */
  searchFields: Array<{
    key: string;
    label: string;
    getValue: (user: GenericUser) => string;
  }>;
}

/** Main props for the GenericUserTable */
export interface GenericUserTableProps<T extends GenericUser> {
  /** Array of users to display */
  data: T[];
  /** User type configuration */
  userTypeConfig: UserTypeConfig<T>;
  /** Additional columns beyond the default ones */
  extraColumns?: GenericColumn<T>[];
  /** Row actions */
  actions?: GenericAction<T>[];
  /** Click handler for row (opens detail) */
  onRowClick?: (user: T) => void;
  /** Selection */
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state icon */
  emptyIcon?: ReactNode;
  /** Custom className */
  className?: string;
  /** Search configuration */
  search?: SearchConfig | false; // false to disable search
  /** Show row stripes */
  striped?: boolean;
  /** Show hover effect */
  hoverable?: boolean;
  /** Custom row className */
  rowClassName?: (row: T, index: number) => string;
}

/** Default search configuration for regular users */
export const DEFAULT_REGULAR_SEARCH_CONFIG: SearchConfig = {
  placeholder: 'Buscar por email, nombre o DNI...',
  debounceMs: 300,
  searchFields: [
    { key: 'email', label: 'Email', getValue: (u) => u.email },
    { key: 'name', label: 'Nombre', getValue: (u) => `${u.firstName} ${u.lastName}`.toLowerCase() },
    { key: 'dni', label: 'DNI', getValue: (u) => 'dni' in u ? u.dni : '' },
  ],
};

/** Default search configuration for international users */
export const DEFAULT_INTERNATIONAL_SEARCH_CONFIG: SearchConfig = {
  placeholder: 'Buscar por email, nombre o documento...',
  debounceMs: 300,
  searchFields: [
    { key: 'email', label: 'Email', getValue: (u) => u.email },
    { key: 'name', label: 'Nombre', getValue: (u) => `${u.firstName} ${u.lastName}`.toLowerCase() },
    { key: 'documentNumber', label: 'N° Documento', getValue: (u) => 'internationalDocumentNumber' in u ? u.internationalDocumentNumber : '' },
  ],
};