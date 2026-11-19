import type { LucideIcon } from 'lucide-react';

export interface AdminMobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export interface MobileMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Permiso necesario para mostrar la acción. */
  permission?: string;
}

export interface MobileMenuProfileData {
  photoUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  roleType: string;
}
