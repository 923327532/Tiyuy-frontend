'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import {
  useModerateProperty,
  useToggleFeaturedProperty,
  useDisablePropertyByAdmin,
  useEnablePropertyByAdmin,
  useNotifyPropertyOwner,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import {
  STATUS_TO_ACTION,
  type ModerationAction,
} from '../types/properties.types';

export function usePropertiesActions(refetch: () => void) {
  const { hasPermission } = usePermissions();
  const canModerate = hasPermission('PROPERTIES_MODERATE');
  const canFeature = hasPermission('PROPERTIES_FEATURE');

  const [selected, setSelected] = useState<PropertyModerationItem | null>(null);
  const [modal, setModal] = useState<'detail' | 'moderate' | 'disable' | 'notify' | null>(null);
  const [moderationAction, setModerationAction] = useState<ModerationAction>('APPROVE');

  const moderateMutation = useModerateProperty();
  const featureMutation = useToggleFeaturedProperty();
  const disableMutation = useDisablePropertyByAdmin();
  const enableMutation = useEnablePropertyByAdmin();
  const notifyMutation = useNotifyPropertyOwner();

  const openDetail = (property: PropertyModerationItem) => {
    setSelected(property);
    setModal('detail');
  };

  const openModerate = (property: PropertyModerationItem, action: ModerationAction) => {
    setSelected(property);
    setModerationAction(action);
    setModal('moderate');
  };

  const openDisable = (property: PropertyModerationItem) => {
    setSelected(property);
    setModal('disable');
  };

  const openNotify = (property: PropertyModerationItem) => {
    setSelected(property);
    setModal('notify');
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const confirmModeration = async (action: ModerationAction, reason?: string, notifyOwner = true) => {
    if (!selected) return;
    try {
      await moderateMutation.mutateAsync({
        propertyId: selected.id,
        request: {
          status: STATUS_TO_ACTION[action],
          reason: reason?.trim() || undefined,
          notifyOwner,
        },
      });
      toast.success('Propiedad moderada', { description: 'El estado se actualizó correctamente.' });
      closeModal();
      refetch();
    } catch {
      toast.error('No se pudo moderar la propiedad');
    }
  };

  const toggleFeatured = async (property: PropertyModerationItem) => {
    try {
      await featureMutation.mutateAsync({
        propertyId: property.id,
        featured: !property.isFeatured,
      });
      toast.success(property.isFeatured ? 'Destaque removido' : 'Propiedad destacada');
      refetch();
    } catch {
      toast.error('No se pudo actualizar el destacado');
    }
  };

  const disableProperty = async (reason: string) => {
    if (!selected) return;
    try {
      await disableMutation.mutateAsync({
        propertyId: selected.id,
        reason: reason.trim(),
        notifyOwner: true,
      });
      toast.success('Propiedad deshabilitada');
      closeModal();
      refetch();
    } catch {
      toast.error('No se pudo deshabilitar la propiedad');
    }
  };

  const enableProperty = async (property: PropertyModerationItem) => {
    try {
      await enableMutation.mutateAsync({
        propertyId: property.id,
        notifyOwner: true,
      });
      toast.success('Propiedad habilitada');
      closeModal();
      refetch();
    } catch {
      toast.error('No se pudo habilitar la propiedad');
    }
  };

  const notifyOwner = async (subject: string, message: string, includeDetails: boolean) => {
    if (!selected) return;
    try {
      await notifyMutation.mutateAsync({
        propertyId: selected.id,
        request: { subject, message, includePropertyDetails: includeDetails },
      });
      toast.success('Notificación enviada', { description: 'El propietario fue notificado.' });
      closeModal();
    } catch {
      toast.error('No se pudo enviar la notificación');
    }
  };

  return {
    canModerate,
    canFeature,
    selected,
    modal,
    moderationAction,
    openDetail,
    openModerate,
    openDisable,
    openNotify,
    closeModal,
    confirmModeration,
    toggleFeatured,
    disableProperty,
    enableProperty,
    notifyOwner,
    isModerating: moderateMutation.isPending,
    isDisabling: disableMutation.isPending,
    isEnabling: enableMutation.isPending,
    isNotifying: notifyMutation.isPending,
  };
}
