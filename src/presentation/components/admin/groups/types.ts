import type { Channel, Group } from '@/app/(dashboard)/admin/groups/types';

export type GroupItem = Group | Channel;
export type GroupsViewType = 'groups' | 'channels' | 'suspended';
export type GroupsViewMode = 'table' | 'cards';
export type GroupsStatusFilter = 'all' | 'active' | 'inactive' | 'suspended' | 'violations';
export type GroupsSortBy =
  | 'newest'
  | 'oldest'
  | 'az'
  | 'za'
  | 'most_members'
  | 'least_members';
export type GroupsSuspendedFilter = 'all' | 'groups' | 'channels';

export interface GroupsFiltersState {
  searchQuery: string;
  statusFilter: GroupsStatusFilter;
  sortBy: GroupsSortBy;
  cityFilter: string;
}

export interface GroupsSummary {
  totalItems: number;
  totalGroups: number;
  totalChannels: number;
  activeItems: number;
  activeGroups: number;
  activeChannels: number;
  suspendedItems: number;
  suspendedGroupsCount: number;
  suspendedChannelsCount: number;
  groupsWithViolationsCount: number;
  channelsWithViolationsCount: number;
  itemsWithViolations: number;
  activePercentage: number;
  suspendedPercentage: number;
  violationsPercentage: number;
}

export function isChannelItem(item: GroupItem): item is Channel {
  return 'city' in item;
}

export function getItemMemberCount(item: GroupItem): number {
  return isChannelItem(item) ? item.subscriberCount : item.memberCount;
}
