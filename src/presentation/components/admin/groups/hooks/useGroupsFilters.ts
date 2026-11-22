'use client';

import { useEffect, useMemo, useState } from 'react';

import type {
  GroupItem,
  GroupsFiltersState,
  GroupsSortBy,
  GroupsStatusFilter,
  GroupsViewMode,
} from '../types';
import { getItemMemberCount, isChannelItem } from '../types';
import type { GroupsQueryData } from './useGroupsQueries';
import type { useGroupsView } from './useGroupsView';

type GroupsView = ReturnType<typeof useGroupsView>;

const INITIAL_FILTERS: GroupsFiltersState = {
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'newest',
  cityFilter: '',
};

export function useGroupsFilters(data: GroupsQueryData, view: GroupsView) {
  const { viewType, suspendedFilter } = view;
  const [filters, setFiltersState] = useState<GroupsFiltersState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<GroupsViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const setFilters = (updates: Partial<GroupsFiltersState>) => {
    setFiltersState((previous) => ({ ...previous, ...updates }));
  };

  const clearFilters = () => {
    setFiltersState(INITIAL_FILTERS);
    view.setSuspendedFilter('all');
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, viewType, suspendedFilter, pageSize]);

  const cityOptions = useMemo(() => {
    const cities = new Set<string>();
    data.channels.forEach((item) => {
      if (isChannelItem(item) && item.city) cities.add(item.city);
    });
    return Array.from(cities).sort((a, b) => a.localeCompare(b));
  }, [data.channels]);

  const sortedData = useMemo<GroupItem[]>(() => {
    const source =
      viewType === 'groups'
        ? data.groups.filter((item) => item.isActive)
        : viewType === 'channels'
          ? data.channels.filter((item) => item.isActive)
          : data.suspended;

    const query = filters.searchQuery.trim().toLowerCase();
    const city = filters.cityFilter.trim().toLowerCase();

    const filtered = source.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (isChannelItem(item) && item.city.toLowerCase().includes(query));
      if (!matchesQuery) return false;

      if (city) {
        if (viewType !== 'channels' || !isChannelItem(item)) return false;
        if (!item.city.toLowerCase().includes(city)) return false;
      }

      if (filters.statusFilter !== 'all') {
        const hasViolation =
          item.suspensionType === 'violation' ||
          (!isChannelItem(item) && Boolean(item.hasViolation));
        switch (filters.statusFilter as GroupsStatusFilter) {
          case 'active':
            if (!item.isActive) return false;
            break;
          case 'inactive':
          case 'suspended':
            if (item.isActive) return false;
            break;
          case 'violations':
            if (!hasViolation) return false;
            break;
          default:
            break;
        }
      }

      if (viewType === 'suspended' && suspendedFilter !== 'all') {
        if (suspendedFilter === 'groups' && isChannelItem(item)) return false;
        if (suspendedFilter === 'channels' && !isChannelItem(item)) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sortBy as GroupsSortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az':
          return a.name.localeCompare(b.name);
        case 'za':
          return b.name.localeCompare(a.name);
        case 'most_members':
          return getItemMemberCount(b) - getItemMemberCount(a);
        case 'least_members':
          return getItemMemberCount(a) - getItemMemberCount(b);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [
    viewType,
    data.groups,
    data.channels,
    data.suspended,
    filters.searchQuery,
    filters.cityFilter,
    filters.statusFilter,
    filters.sortBy,
    suspendedFilter,
  ]);

  const totalElements = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const items = useMemo(
    () => sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedData, currentPage, pageSize],
  );

  return {
    filters,
    setFilters,
    clearFilters,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalElements,
    totalPages,
    cityOptions,
    items,
  };
}
