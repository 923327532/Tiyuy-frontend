'use client';

import { useMemo } from 'react';

import type { GroupsSummary } from '../types';
import { isChannelItem } from '../types';
import type { GroupsQueryData } from './useGroupsQueries';

export function useGroupsStats(data: GroupsQueryData): GroupsSummary {
  return useMemo<GroupsSummary>(() => {
    const { groups, channels, suspended, groupViolations, channelViolations } = data;

    const totalGroups = groups.length;
    const totalChannels = channels.length;
    const totalItems = totalGroups + totalChannels;
    const activeGroups = groups.filter((item) => item.isActive).length;
    const activeChannels = channels.filter((item) => item.isActive).length;
    const activeItems = activeGroups + activeChannels;
    const groupsWithViolationsCount = groupViolations.length;
    const channelsWithViolationsCount = channelViolations.length;
    const itemsWithViolations = groupsWithViolationsCount + channelsWithViolationsCount;

    return {
      totalItems,
      totalGroups,
      totalChannels,
      activeItems,
      activeGroups,
      activeChannels,
      suspendedItems: suspended.length,
      suspendedGroupsCount: suspended.filter((item) => !isChannelItem(item)).length,
      suspendedChannelsCount: suspended.filter(isChannelItem).length,
      groupsWithViolationsCount,
      channelsWithViolationsCount,
      itemsWithViolations,
      activePercentage: totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0,
      suspendedPercentage: totalItems > 0 ? Number(((suspended.length / totalItems) * 100).toFixed(1)) : 0,
      violationsPercentage:
        totalItems > 0 ? Number(((itemsWithViolations / totalItems) * 100).toFixed(1)) : 0,
    };
  }, [data]);
}
