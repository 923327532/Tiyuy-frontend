'use client';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';

import type { ModerationAction } from '../types/properties.types';
import { DisableModal } from './modals/DisableModal';
import { ModerationModal } from './modals/ModerationModal';
import { NotifyModal } from './modals/NotifyModal';
import { PropertyDetailModal } from './modals/PropertyDetailModal';

type ActiveModal = 'detail' | 'moderate' | 'disable' | 'notify' | null;

interface PropertiesModalsProps {
  selected: PropertyModerationItem | null;
  modal: ActiveModal;
  moderationAction: ModerationAction;
  canModerate: boolean;
  isModerating: boolean;
  isDisabling: boolean;
  isEnabling: boolean;
  isNotifying: boolean;
  onClose: () => void;
  onOpenModeration: (property: PropertyModerationItem, action: ModerationAction) => void;
  onOpenDisable: (property: PropertyModerationItem) => void;
  onOpenNotify: (property: PropertyModerationItem) => void;
  onEnable: (property: PropertyModerationItem) => void;
  onConfirmModeration: (action: ModerationAction, reason?: string, notifyOwner?: boolean) => void;
  onConfirmDisable: (reason: string) => void;
  onConfirmNotify: (subject: string, message: string, includeDetails: boolean) => void;
}

export function PropertiesModals({
  selected,
  modal,
  moderationAction,
  canModerate,
  isModerating,
  isDisabling,
  isEnabling,
  isNotifying,
  onClose,
  onOpenModeration,
  onOpenDisable,
  onOpenNotify,
  onEnable,
  onConfirmModeration,
  onConfirmDisable,
  onConfirmNotify,
}: PropertiesModalsProps) {
  if (!selected || !modal) return null;

  return (
    <>
      {modal === 'detail' && (
        <PropertyDetailModal
          property={selected}
          isOpen
          canModerate={canModerate}
          isEnabling={isEnabling}
          onModerate={(property) => onOpenModeration(property, 'APPROVE')}
          onEnable={onEnable}
          onDisable={onOpenDisable}
          onNotify={onOpenNotify}
          onClose={onClose}
        />
      )}

      {modal === 'moderate' && (
        <ModerationModal
          property={selected}
          action={moderationAction}
          isOpen
          isPending={isModerating}
          onConfirm={onConfirmModeration}
          onCancel={onClose}
        />
      )}

      {modal === 'disable' && (
        <DisableModal
          property={selected}
          isOpen
          isPending={isDisabling}
          onConfirm={onConfirmDisable}
          onCancel={onClose}
        />
      )}

      {modal === 'notify' && (
        <NotifyModal
          property={selected}
          isOpen
          isPending={isNotifying}
          onSend={onConfirmNotify}
          onCancel={onClose}
        />
      )}
    </>
  );
}
