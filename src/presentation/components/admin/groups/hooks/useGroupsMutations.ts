'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { isChannelItem } from '../types';
import type { GroupItem } from '../types';
import {
  sendChannelViolationEmail,
  sendGroupViolationEmail,
  suspendChannel,
  suspendGroup,
  toggleChannelStatus,
  toggleGroupStatus,
} from './api';
import type { useGroupsSelection } from './useGroupsSelection';

type GroupsSelection = ReturnType<typeof useGroupsSelection>;

export function useGroupsMutations(selection: GroupsSelection) {
  const queryClient = useQueryClient();
  const {
    selectedItem,
    suspendReason,
    violationType,
    violationMessage,
    reactivateReason,
    setIsToggleModalOpen,
    setIsSuspendModalOpen,
    setSuspendReason,
    setIsViolationModalOpen,
    setViolationType,
    setViolationMessage,
    setIsReactivateModalOpen,
    setReactivateReason,
  } = selection;

  const invalidateAll = () => {
    [
      'admin-groups',
      'admin-channels',
      'admin-suspended-groups',
      'admin-group-violations',
      'admin-channel-violations',
    ].forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }));
  };

  const toggleGroupStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => toggleGroupStatus(id, isActive),
    onSuccess: () => {
      invalidateAll();
      setIsToggleModalOpen(false);
    },
    onError: (error: Error) => alert('❌ Error al cambiar estado del grupo: ' + error.message),
  });

  const suspendGroupMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => suspendGroup(id, reason),
    onSuccess: () => {
      invalidateAll();
      setIsSuspendModalOpen(false);
      setSuspendReason('');
      alert('✅ Grupo suspendido exitosamente');
    },
    onError: (error: Error) => alert('❌ Error al suspender grupo: ' + error.message),
  });

  const sendGroupViolationEmailMutation = useMutation({
    mutationFn: ({ id, violationType: type, message }: { id: number; violationType: string; message: string }) =>
      sendGroupViolationEmail(id, type, message),
    onSuccess: () => {
      invalidateAll();
      setIsViolationModalOpen(false);
      setViolationType('CONTENT_VIOLATION');
      setViolationMessage('');
      alert('✅ Email de violación enviado exitosamente');
    },
    onError: (error: Error) => alert('❌ Error al enviar email de violación: ' + error.message),
  });

  const toggleChannelStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => toggleChannelStatus(id, isActive),
    onSuccess: () => {
      invalidateAll();
      setIsToggleModalOpen(false);
    },
    onError: (error: Error) => alert('❌ Error al cambiar estado del canal: ' + error.message),
  });

  const suspendChannelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => suspendChannel(id, reason),
    onSuccess: () => {
      invalidateAll();
      setIsSuspendModalOpen(false);
      setSuspendReason('');
      alert('✅ Canal suspendido exitosamente');
    },
    onError: (error: Error) => alert('❌ Error al suspender canal: ' + error.message),
  });

  const sendChannelViolationEmailMutation = useMutation({
    mutationFn: ({ id, violationType: type, message }: { id: number; violationType: string; message: string }) =>
      sendChannelViolationEmail(id, type, message),
    onSuccess: () => {
      invalidateAll();
      setIsViolationModalOpen(false);
      setViolationType('CONTENT_VIOLATION');
      setViolationMessage('');
      alert('✅ Correo de violación enviado exitosamente');
    },
    onError: (error: Error) => alert('❌ Error al enviar correo de violación: ' + error.message),
  });

  const reactivateGroupMutation = useMutation({
    mutationFn: ({ id }: { id: number; reason: string }) => toggleGroupStatus(id, true),
    onSuccess: () => {
      invalidateAll();
      setIsReactivateModalOpen(false);
      setReactivateReason('');
      alert('✅ Grupo reactivado exitosamente');
    },
    onError: (error: Error) => alert('❌ Error al reactivar grupo: ' + error.message),
  });

  const reactivateChannelMutation = useMutation({
    mutationFn: ({ id }: { id: number; reason: string }) => toggleChannelStatus(id, true),
    onSuccess: () => {
      invalidateAll();
      setIsReactivateModalOpen(false);
      setReactivateReason('');
      alert('✅ Canal reactivado exitosamente');
    },
    onError: (error: Error) => alert('❌ Error al reactivar canal: ' + error.message),
  });

  const handleToggleStatus = (item: GroupItem) => {
    selection.openToggleModal(item);
  };

  const confirmToggleStatus = () => {
    if (!selectedItem) return;
    if (isChannelItem(selectedItem)) {
      toggleChannelStatusMutation.mutate({ id: selectedItem.id, isActive: !selectedItem.isActive });
    } else {
      toggleGroupStatusMutation.mutate({ id: selectedItem.id, isActive: !selectedItem.isActive });
    }
  };

  const handleSuspend = () => {
    if (!selectedItem) return;
    if (isChannelItem(selectedItem)) {
      suspendChannelMutation.mutate({ id: selectedItem.id, reason: suspendReason });
    } else {
      suspendGroupMutation.mutate({ id: selectedItem.id, reason: suspendReason });
    }
  };

  const handleViolation = () => {
    if (!selectedItem) return;
    const payload = { id: selectedItem.id, violationType, message: violationMessage };
    if (isChannelItem(selectedItem)) {
      sendChannelViolationEmailMutation.mutate(payload);
    } else {
      sendGroupViolationEmailMutation.mutate(payload);
    }
  };

  const handleReactivate = () => {
    if (!selectedItem) return;
    const payload = { id: selectedItem.id, reason: reactivateReason };
    if (isChannelItem(selectedItem)) {
      reactivateChannelMutation.mutate(payload);
    } else {
      reactivateGroupMutation.mutate(payload);
    }
  };

  return {
    handleToggleStatus,
    confirmToggleStatus,
    handleSuspend,
    handleViolation,
    handleReactivate,
    isTogglePending: toggleGroupStatusMutation.isPending || toggleChannelStatusMutation.isPending,
    isSuspendPending: suspendGroupMutation.isPending || suspendChannelMutation.isPending,
    isViolationPending:
      sendGroupViolationEmailMutation.isPending || sendChannelViolationEmailMutation.isPending,
    isReactivatePending:
      reactivateGroupMutation.isPending || reactivateChannelMutation.isPending,
  };
}
