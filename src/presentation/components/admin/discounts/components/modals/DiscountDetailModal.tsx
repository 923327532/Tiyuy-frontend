'use client';

import type { ReactNode } from 'react';
import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { AdminDetailShell } from '@/presentation/components/admin/shared/detail-shell/AdminDetailShell';

import {
  getSourceLabel,
  getSourceVariant,
  getStatusLabel,
  getStatusVariant,
} from '../../config/discounts.config';
import { formatDiscountDate } from '../../utils/discountFormat';

interface Props {
  discount: CentralDiscountDto | null;
  onClose: () => void;
  onToggleStatus: (discount: CentralDiscountDto) => void;
  onDelete: (discount: CentralDiscountDto) => void;
  isPending?: boolean;
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white px-3.5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-slate-900">{children}</div>
    </div>
  );
}

/** Detalle centralizado con el mismo shell que Usuarios, Agentes e Inmobiliarias. */
export function DiscountDetailModal({
  discount,
  onClose,
  onToggleStatus,
  onDelete,
  isPending = false,
}: Props) {
  if (!discount) return null;

  const isActive = discount.status === 'ACTIVE';

  return (
    <AdminDetailShell
      isOpen
      onClose={onClose}
      title={discount.code || 'Sin código'}
      subtitle={`ID #${discount.id} · ${discount.entityName || '-'}`}
      avatarFallback={(discount.code || '?').slice(0, 2).toUpperCase()}
      avatarDisabled={!isActive}
      badges={
        <>
          <Badge variant={getSourceVariant(discount.source)} size="sm">
            {getSourceLabel(discount.source)}
          </Badge>
          <Badge variant={getStatusVariant(discount.status)} size="sm" dot>
            {getStatusLabel(discount.status)}
          </Badge>
        </>
      }
      footerLeft={<span className="hidden sm:inline">Registro de actividad reciente</span>}
      footerRight={
        <>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onToggleStatus(discount)}
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {isActive ? 'Desactivar' : 'Activar'}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onDelete(discount)}
            className="inline-flex h-10 items-center rounded-xl border border-rose-200 bg-white px-4 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
          >
            Eliminar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <DetailItem label="Descuento">
          <span className="tabular-nums">{discount.discountPercentage}%</span>
        </DetailItem>
        <DetailItem label="Asignado">{discount.assignedByName || '-'}</DetailItem>
        <DetailItem label="Uso">
          <span className="tabular-nums">
            {discount.usageCount} / {discount.maxUsage}
          </span>
        </DetailItem>
        <DetailItem label="Aplicabilidad">{discount.applicability || '-'}</DetailItem>
        <DetailItem label="Fecha de creación">
          <time className="tabular-nums">{formatDiscountDate(discount.createdAt)}</time>
        </DetailItem>
        <DetailItem label="Vencimiento">
          <time className="tabular-nums">{formatDiscountDate(discount.expiresAt)}</time>
        </DetailItem>
      </div>
    </AdminDetailShell>
  );
}
