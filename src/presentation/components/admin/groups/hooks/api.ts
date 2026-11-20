import { axiosClient } from '@/infrastructure/api/axios-client';

import type { GroupItem } from '../types';

export interface CreateGroupPayload {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
  city?: string;
  isActive: boolean;
}

export const fetchGroups = async (): Promise<GroupItem[]> => {
  const response = await axiosClient.get('/contacts/extended/groups');
  return response.data.content || [];
};

export const fetchChannelsForAdmin = async (): Promise<GroupItem[]> => {
  const response = await axiosClient.get('/admin/groups/channels/all');
  return response.data.channels || [];
};

export const fetchSuspendedGroups = async (): Promise<GroupItem[]> => {
  const [allGroupsRes, groupViolationsRes, allChannelsRes, channelViolationsRes] = await Promise.all([
    axiosClient.get('/admin/groups/all'),
    axiosClient.get('/admin/groups/violations'),
    axiosClient.get('/admin/groups/channels/all'),
    axiosClient.get('/admin/groups/channels/violations'),
  ]);

  const allGroups = allGroupsRes.data.groups || [];
  const violationGroups = groupViolationsRes.data.groups || [];
  const allChannels = allChannelsRes.data.channels || [];
  const violationChannels = channelViolationsRes.data.channels || [];

  const combinedMap = new Map<number, GroupItem>();

  allGroups
    .filter((group: GroupItem) => !group.isActive)
    .forEach((group: GroupItem) => combinedMap.set(group.id, { ...group, suspensionType: 'disabled' }));
  allChannels
    .filter((channel: GroupItem) => !channel.isActive)
    .forEach((channel: GroupItem) => combinedMap.set(channel.id, { ...channel, suspensionType: 'disabled' }));

  violationGroups.forEach((group: GroupItem) => {
    const existing = combinedMap.get(group.id);
    combinedMap.set(group.id, { ...(existing ?? group), suspensionType: 'violation' });
  });
  violationChannels.forEach((channel: GroupItem) => {
    const existing = combinedMap.get(channel.id);
    combinedMap.set(channel.id, { ...(existing ?? channel), suspensionType: 'violation' });
  });

  return Array.from(combinedMap.values());
};

export const fetchGroupViolations = async (): Promise<GroupItem[]> => {
  const response = await axiosClient.get('/admin/groups/violations');
  return response.data.groups || [];
};

export const fetchChannelViolations = async (): Promise<GroupItem[]> => {
  const response = await axiosClient.get('/admin/groups/channels/violations');
  return response.data.channels || [];
};

export const createGroup = async (payload: CreateGroupPayload) => {
  const response = await axiosClient.post('/admin/groups', payload);
  return response.data;
};

export const toggleGroupStatus = async (id: number, isActive: boolean) => {
  await axiosClient.patch(`/admin/groups/${id}/status`, { isActive });
};

export const suspendGroup = async (id: number, reason: string) => {
  await axiosClient.post(`/admin/groups/${id}/suspend`, { reason });
};

export const sendGroupViolationEmail = async (id: number, violationType: string, message: string) => {
  await axiosClient.post(`/admin/groups/${id}/violation-email`, { violationType, message });
};

export const toggleChannelStatus = async (id: number, isActive: boolean) => {
  await axiosClient.patch(`/admin/groups/channels/${id}/status`, { isActive });
};

export const suspendChannel = async (id: number, reason: string) => {
  await axiosClient.post(`/admin/groups/channels/${id}/suspend`, { reason });
};

export const sendChannelViolationEmail = async (id: number, violationType: string, message: string) => {
  await axiosClient.post(`/admin/groups/channels/${id}/violation-email`, { violationType, message });
};
