'use client';

import { usePermissions } from '@/presentation/hooks/usePermissions';

import { useGroupsFilters } from './useGroupsFilters';
import { useGroupsMutations } from './useGroupsMutations';
import { useGroupsQueries } from './useGroupsQueries';
import { useGroupsSelection } from './useGroupsSelection';
import { useGroupsStats } from './useGroupsStats';
import { useGroupsView } from './useGroupsView';

export function useGroupsAdmin() {
  const { hasPermission } = usePermissions();
  const canManageGroups = hasPermission('MANAGE_GROUPS');

  const view = useGroupsView();
  const queries = useGroupsQueries(view.viewType);
  const filters = useGroupsFilters(queries.data, view);
  const stats = useGroupsStats(queries.data);
  const selection = useGroupsSelection();
  const mutations = useGroupsMutations(selection);

  return {
    canManageGroups,

    ...view,
    ...filters,
    ...queries,
    ...stats,
    ...selection,
    ...mutations,

    isLoading: queries.isLoading,
    error: queries.error,
    refetch: queries.refetch,
    items: filters.items,
    summary: stats,
  };
}
