'use client';

import { useQuery } from '@tanstack/react-query';

import type { GroupItem, GroupsViewType } from '../types';
import {
  fetchChannelViolations,
  fetchChannelsForAdmin,
  fetchGroupViolations,
  fetchGroups,
  fetchSuspendedGroups,
} from './api';

export interface GroupsQueryData {
  groups: GroupItem[];
  channels: GroupItem[];
  suspended: GroupItem[];
  groupViolations: GroupItem[];
  channelViolations: GroupItem[];
}

export function useGroupsQueries(viewType: GroupsViewType) {
  const groupsQuery = useQuery({ queryKey: ['admin-groups'], queryFn: fetchGroups });
  const channelsQuery = useQuery({ queryKey: ['admin-channels'], queryFn: fetchChannelsForAdmin });
  const suspendedQuery = useQuery({ queryKey: ['admin-suspended-groups'], queryFn: fetchSuspendedGroups });
  const groupViolationsQuery = useQuery({ queryKey: ['admin-group-violations'], queryFn: fetchGroupViolations });
  const channelViolationsQuery = useQuery({ queryKey: ['admin-channel-violations'], queryFn: fetchChannelViolations });

  const refetch = () => {
    void groupsQuery.refetch();
    void channelsQuery.refetch();
    void suspendedQuery.refetch();
    void groupViolationsQuery.refetch();
    void channelViolationsQuery.refetch();
  };

  const isLoading =
    viewType === 'groups'
      ? groupsQuery.isLoading
      : viewType === 'channels'
        ? channelsQuery.isLoading
        : suspendedQuery.isLoading;

  const error =
    viewType === 'groups'
      ? groupsQuery.error
      : viewType === 'channels'
        ? channelsQuery.error
        : suspendedQuery.error;

  const data: GroupsQueryData = {
    groups: groupsQuery.data ?? [],
    channels: channelsQuery.data ?? [],
    suspended: suspendedQuery.data ?? [],
    groupViolations: groupViolationsQuery.data ?? [],
    channelViolations: channelViolationsQuery.data ?? [],
  };

  return { data, isLoading, error, refetch };
}
