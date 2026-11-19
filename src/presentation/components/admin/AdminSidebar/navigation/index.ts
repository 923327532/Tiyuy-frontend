import type { SidebarNavItem } from '../types';
import { administrationSection } from './sections/administration';
import { commercialSection } from './sections/commercial';
import { communicationsSection } from './sections/communications';
import { dashboardSection } from './sections/dashboard';
import { financeSection } from './sections/finance';
import { propertiesSection } from './sections/properties';
import { usersSection } from './sections/users';

/**
 * Árbol de navegación del panel administrativo.
 * Solo incluye rutas que existen en `src/app/(dashboard)/admin`.
 */
export const SIDEBAR_NAVIGATION: SidebarNavItem[] = [
  dashboardSection,
  usersSection,
  propertiesSection,
  commercialSection,
  financeSection,
  communicationsSection,
  administrationSection,
];
