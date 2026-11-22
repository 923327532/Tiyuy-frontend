'use client';

import { useState } from 'react';

import type { GroupsSuspendedFilter, GroupsViewType } from '../types';

export function useGroupsView() {
  const [viewType, setViewType] = useState<GroupsViewType>('groups');
  const [suspendedFilter, setSuspendedFilter] = useState<GroupsSuspendedFilter>('all');

  return { viewType, setViewType, suspendedFilter, setSuspendedFilter };
}
