'use client';

import { format } from 'date-fns';
import { AgentDiscount } from '@/core/domain/entities/AgentDiscount';
import { getDiscountStatusConfig } from './discountStatus';
import { RefreshCw, Trash2 } from 'lucide-react';

interface DiscountHistoryTableProps {
  discounts: AgentDiscount[];
  canManage: boolean;
  onToggleStatus: (id: number) => void;
  onRemove: (id: number) => void;
}

export function DiscountHistoryTable({
  discounts,
  canManage,
  onToggleStatus,
  onRemove,
}: DiscountHistoryTableProps) {
  return (
    <div className="generic-table__wrapper">
      <table className="generic-table agent-discounts__table">
        <thead className="generic-table__head">
          <tr>
            <th className="generic-table__th" scope="col">Codigo</th>
            <th className="generic-table__th" scope="col">Tipo</th>
            <th className="generic-table__th" scope="col">Valor</th>
            <th className="generic-table__th" scope="col">Uso</th>
            <th className="generic-table__th" scope="col">Expira</th>
            <th className="generic-table__th" scope="col">Estado</th>
            <th className="generic-table__th generic-table__th--right" scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody className="generic-table__body">
          {discounts.map((discount: AgentDiscount) => {
            const config = getDiscountStatusConfig(discount.status);
            const isExpired = Boolean(discount.expiresAt && new Date(discount.expiresAt) < new Date());
            const usagePercentage = discount.maxUsage ? Math.round((discount.usageCount / discount.maxUsage) * 100) : 0;
            const usageTone = usagePercentage >= 80
              ? 'agent-discounts__usage-fill--danger'
              : usagePercentage >= 50
                ? 'agent-discounts__usage-fill--warning'
                : '';

            return (
              <tr key={discount.id} className="generic-table__row generic-table__row--hoverable">
                <td className="generic-table__td">
                  <div className="agent-discounts__code-badge">{discount.discountCode.code}</div>
                  <div className="agent-discounts__code-date">
                    Asignado el {format(new Date(discount.assignedAt), 'dd/MM/yyyy')}
                  </div>
                </td>
                <td className="generic-table__td">
                  <span className="agent-discounts__type-badge">
                    {discount.discountCode.applicability === 'USER_SPECIFIC' ? 'Personalizado' : 'General'}
                  </span>
                </td>
                <td className="generic-table__td">
                  <span className="agent-discounts__value">-{discount.discountCode.discountPercentage}%</span>
                </td>
                <td className="generic-table__td">
                  <span className="agent-discounts__usage">
                    {discount.usageCount} / {discount.maxUsage || '∞'}
                  </span>
                  {discount.maxUsage && (
                    <div className="agent-discounts__usage-track" aria-hidden="true">
                      <div
                        className={`agent-discounts__usage-fill ${usageTone}`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                  )}
                </td>
                <td className="generic-table__td">
                  {discount.expiresAt ? (
                    <>
                      <div className={`agent-discounts__expiry ${isExpired ? 'agent-discounts__expiry--expired' : ''}`}>
                        {format(new Date(discount.expiresAt), 'dd/MM/yyyy')}
                      </div>
                      <div className="agent-discounts__expiry-note">{isExpired ? 'Expirado' : 'Vigente'}</div>
                    </>
                  ) : (
                    <span className="agent-discounts__expiry-note">Sin expiración</span>
                  )}
                </td>
                <td className="generic-table__td">
                  <span className={`agent-discounts__status-badge ${config.className}`}>
                    <span className="agent-discounts__status-dot" />
                    {config.label}
                  </span>
                </td>
                <td className="generic-table__td generic-table__td--right">
                  {canManage && (
                    <div className="agent-discounts__row-actions">
                      <button
                        type="button"
                        className="agent-discounts__icon-btn"
                        onClick={() => onToggleStatus(discount.id)}
                        title="Cambiar estado"
                        aria-label="Cambiar estado"
                      >
                        <RefreshCw aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="agent-discounts__icon-btn agent-discounts__icon-btn--danger"
                        onClick={() => onRemove(discount.id)}
                        title="Eliminar"
                        aria-label="Eliminar"
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
