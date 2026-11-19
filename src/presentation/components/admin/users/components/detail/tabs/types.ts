'use client';

import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserDetailExtras } from '../../../userTypes';
import type { DetailTab } from '../ui/detailParts';

export interface TabProps {
  user: UserListItem;
  extras?: UserDetailExtras;
  loading: boolean;
  goToTab: (tab: DetailTab) => void;
  onViewProperties?: (user: UserListItem) => void;
  onViewProjects?: (user: UserListItem) => void;
  onVerifyEmail?: (userId: number) => void;
  onVerifyPhone?: (userId: number) => void;
  onResolveCancellation?: (id: string) => void;
  isEmailVerifying?: boolean;
  isPhoneVerifying?: boolean;
  isResolvingCancellation?: boolean;
}

export type { DetailTab };
