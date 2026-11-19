import type { ElementType } from 'react';

export interface AdminSearchRoute {
  label: string;
  href: string;
  icon: ElementType;
  keywords: string[];
  permission?: string;
}
