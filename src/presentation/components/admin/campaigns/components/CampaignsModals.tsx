'use client';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import { ActionConfirmModal } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import { getCampaignActionConfig } from '../config/campaignActionModalConfig';
import type { CampaignModerationAction } from '../hooks/useCampaignsActions';
import { CampaignDetailModal } from './modals/CampaignDetailModal';
import { CampaignNotifyModal } from './modals/CampaignNotifyModal';

interface Props {
  campaign: PromotionCampaign | null;
  isViewOpen: boolean;
  action: CampaignModerationAction | null;
  reason: string;
  pending: boolean;
  resetKey: string | number;
  isNotifyOpen: boolean;
  isNotifying: boolean;
  onCloseView: () => void;
  onCloseAction: () => void;
  onCloseNotify: () => void;
  onReasonChange: (value: string) => void;
  onConfirm: (reason: string) => void;
  onNotify: (subject: string, message: string, includeDetails: boolean) => void;
  onRequestAction: (action: CampaignModerationAction) => void;
  onRequestNotify: () => void;
}

/**
 * Conjunto unificado de modales de Campañas: detalle, confirmación de acción
 * (componente compartido con Usuarios/Proyectos) y notificación al anunciante.
 */
export function CampaignsModals({
  campaign,
  isViewOpen,
  action,
  reason,
  pending,
  resetKey,
  isNotifyOpen,
  isNotifying,
  onCloseView,
  onCloseAction,
  onCloseNotify,
  onReasonChange,
  onConfirm,
  onNotify,
  onRequestAction,
  onRequestNotify,
}: Props) {
  if (!campaign) return null;

  const actionConfig = action
    ? getCampaignActionConfig(action, campaign.title)
    : getCampaignActionConfig('APPROVE', campaign.title);

  return (
    <>
      <CampaignDetailModal
        campaign={campaign}
        isOpen={isViewOpen}
        isPending={pending}
        onClose={onCloseView}
        onNotify={onRequestNotify}
        onAction={onRequestAction}
      />

      <ActionConfirmModal
        isOpen={Boolean(action)}
        onClose={onCloseAction}
        onConfirm={onConfirm}
        title={actionConfig.title}
        description={actionConfig.description}
        icon={actionConfig.icon}
        variant={actionConfig.variant}
        confirmLabel={actionConfig.confirmLabel}
        reason={reason}
        onReasonChange={onReasonChange}
        reasonPlaceholder={actionConfig.reasonPlaceholder}
        requireReason={actionConfig.requireReason}
        warning={actionConfig.warning}
        isPending={pending}
        resetKey={resetKey}
      />

      <CampaignNotifyModal
        campaign={campaign}
        isOpen={isNotifyOpen}
        isPending={isNotifying}
        onSend={onNotify}
        onCancel={onCloseNotify}
      />
    </>
  );
}
