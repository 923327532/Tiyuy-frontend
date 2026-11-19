import type { ElementType } from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ElementType;
  path?: string;
  children?: SidebarNavItem[];
  badge?: number;
  requiredPermissions?: string[];
  /** Solo marcar activo en coincidencia exacta con la ruta. */
  exact?: boolean;
}

export interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
  /** Called when a collapsed sidebar needs to expand to show sub-sections. */
  onRequestExpand?: () => void;
}
