'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import { ActionConfirmModal } from '@/presentation/components/admin/shared/action-modal/ActionConfirmModal';
import { ADMIN_QUERY_KEY } from '@/presentation/hooks/admin/useAdminShared';
import { useDeleteDiscountCode, useUpdateDiscountCode } from '@/presentation/hooks/useAdmin';

import { getDiscountActionConfig, type DiscountAction } from './discountActionModalConfig';

interface Props {
  discount: CentralDiscountDto | null;
  action: DiscountAction | null;
  reason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSuccess?: () => void;
}

/** Confirmaciones de actividad reciente con el modal compartido de acciones. */
export function DiscountsActionModal({
  discount,
  action,
  reason,
  onReasonChange,
  onClose,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const updateDiscount = useUpdateDiscountCode();
  const deleteDiscount = useDeleteDiscountCode();
  const isPending = updateDiscount.isPending || deleteDiscount.isPending;

  const handleConfirm = async () => {
    if (!discount || !action) return;

    if (action === 'delete') {
      await deleteDiscount.mutateAsync(discount.id);
    } else {
      await updateDiscount.mutateAsync({
        codeId: discount.id,
        request: { status: action === 'activate' ? 'ACTIVE' : 'INACTIVE' },
      });
    }

    await queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'central-discounts'] });
    onSuccess?.();
  };

  const config = getDiscountActionConfig(
    action ?? 'deactivate',
    discount?.code || 'este descuento'
  );

  return (
    <ActionConfirmModal
      isOpen={Boolean(discount && action)}
      onClose={onClose}
      onConfirm={handleConfirm}
      isPending={isPending}
      resetKey={discount?.id ?? ''}
      reason={reason}
      onReasonChange={onReasonChange}
      variant={config.variant}
      icon={config.icon}
      title={config.title}
      description={config.description}
      confirmLabel={config.confirmLabel}
      reasonPlaceholder={config.reasonPlaceholder}
      requireReason={config.requireReason}
      warning={config.warning}
    />
  );
}
