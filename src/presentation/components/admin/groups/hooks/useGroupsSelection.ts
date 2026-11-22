'use client';

import { useState } from 'react';

import type { GroupItem } from '../types';
import { isChannelItem } from '../types';

export function useGroupsSelection() {
  const [selectedItem, setSelectedItem] = useState<GroupItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [toggleReason, setToggleReason] = useState('');
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [violationType, setViolationType] = useState('CONTENT_VIOLATION');
  const [violationMessage, setViolationMessage] = useState('');
  const [reactivateReason, setReactivateReason] = useState('');

  const openViewModal = (item: GroupItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const openToggleModal = (item: GroupItem) => {
    setSelectedItem(item);
    setIsToggleModalOpen(true);
  };

  const openSuspendModal = (item: GroupItem) => {
    setSelectedItem(item);
    setIsSuspendModalOpen(true);
  };

  const openViolationModal = (item: GroupItem) => {
    setSelectedItem(item);
    setIsViolationModalOpen(true);
  };

  const openReactivateModal = (item: GroupItem) => {
    setSelectedItem(item);
    setIsReactivateModalOpen(true);
  };

  const selectedGroup = selectedItem && !isChannelItem(selectedItem) ? selectedItem : null;
  const selectedChannel = selectedItem && isChannelItem(selectedItem) ? selectedItem : null;
  const selectedItemType: 'group' | 'channel' = selectedChannel ? 'channel' : 'group';

  return {
    selectedItem,
    selectedGroup,
    selectedChannel,
    selectedItemType,
    isViewModalOpen,
    setIsViewModalOpen,
    isToggleModalOpen,
    setIsToggleModalOpen,
    toggleReason,
    setToggleReason,
    isSuspendModalOpen,
    setIsSuspendModalOpen,
    isViolationModalOpen,
    setIsViolationModalOpen,
    isReactivateModalOpen,
    setIsReactivateModalOpen,
    suspendReason,
    setSuspendReason,
    violationType,
    setViolationType,
    violationMessage,
    setViolationMessage,
    reactivateReason,
    setReactivateReason,
    openViewModal,
    openToggleModal,
    openSuspendModal,
    openViolationModal,
    openReactivateModal,
  };
}
