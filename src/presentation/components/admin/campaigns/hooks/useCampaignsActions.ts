'use client';

import { toast } from 'sonner';
import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import {
  useApprovePromotionCampaign,
  useDeletePromotionCampaign,
  useReactivatePromotionCampaign,
  useRejectPromotionCampaign,
  useSuspendPromotionCampaign,
} from '@/presentation/hooks/useAdmin';

export type CampaignModerationAction =
  | 'APPROVE'
  | 'REJECT'
  | 'SUSPEND'
  | 'REACTIVATE'
  | 'DELETE';

interface Params {
  refetch: () => void;
  closeAction: () => void;
}

const SUCCESS_MESSAGES: Record<CampaignModerationAction, string> = {
  APPROVE: 'Campaña aprobada',
  REJECT: 'Campaña rechazada',
  SUSPEND: 'Campaña suspendida',
  REACTIVATE: 'Campaña reactivada',
  DELETE: 'Campaña eliminada',
};

export function useCampaignsActions({ refetch, closeAction }: Params) {
  const approve = useApprovePromotionCampaign();
  const reject = useRejectPromotionCampaign();
  const suspend = useSuspendPromotionCampaign();
  const reactivate = useReactivatePromotionCampaign();
  const remove = useDeletePromotionCampaign();

  const handleAction = async (
    campaign: PromotionCampaign,
    action: CampaignModerationAction,
    reason?: string
  ) => {
    try {
      switch (action) {
        case 'APPROVE':
          await approve.mutateAsync(campaign.id);
          break;
        case 'REJECT':
          await reject.mutateAsync({ id: campaign.id, reason: reason?.trim() || undefined });
          break;
        case 'SUSPEND':
          await suspend.mutateAsync({ id: campaign.id, reason: reason?.trim() || undefined });
          break;
        case 'REACTIVATE':
          await reactivate.mutateAsync(campaign.id);
          break;
        case 'DELETE':
          await remove.mutateAsync(campaign.id);
          break;
      }
      toast.success(SUCCESS_MESSAGES[action]);
      closeAction();
      refetch();
    } catch (error: any) {
      toast.error('No se pudo completar la acción', { description: error?.message });
    }
  };

  return {
    handleAction,
    pending:
      approve.isPending ||
      reject.isPending ||
      suspend.isPending ||
      reactivate.isPending ||
      remove.isPending,
  };
}
