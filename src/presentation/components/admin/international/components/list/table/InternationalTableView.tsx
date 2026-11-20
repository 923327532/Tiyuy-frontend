'use client';

import { Check, X } from 'lucide-react';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';
import { DOC_TYPE_LABELS } from '../../../config/international.constants';
import { StatusBadge } from '../StatusBadge';
import { formatDate, getFullName, getInitials } from '../cards/InternationalCardConfig';
import './styles/InternationalTable.css';

interface Props {
  users: InternationalUserListItem[];
  canReview?: boolean;
  onViewDetail: (user: InternationalUserListItem) => void;
  onApprove?: (user: InternationalUserListItem) => void;
  onReject?: (user: InternationalUserListItem) => void;
}

export function InternationalTableView({ users, canReview, onViewDetail, onApprove, onReject }: Props) {
  return (
    <div className="intc-table-wrap">
      <table className="intc-table">
        <thead className="intc-table__head">
          <tr>
            <th className="intc-table__th">Usuario</th>
            <th className="intc-table__th">País</th>
            <th className="intc-table__th">Documento</th>
            <th className="intc-table__th">N° documento</th>
            <th className="intc-table__th">Registro</th>
            <th className="intc-table__th">Estado</th>
            <th className="intc-table__th intc-table__th--actions">Acciones</th>
          </tr>
        </thead>
        <tbody className="intc-table__body">
          {users.map((user) => {
            const fullName = getFullName(user);
            const docType = DOC_TYPE_LABELS[user.internationalDocumentType] || user.internationalDocumentType || '—';
            const canApprove = canReview && user.verificationStatus !== 'VERIFIED' && Boolean(onApprove);
            const canReject = canReview && user.verificationStatus !== 'REJECTED' && Boolean(onReject);

            return (
              <tr key={user.userId} className="intc-table__row">
                <td className="intc-table__td intc-table__td--user">
                  <div className="intc-table__identity">
                    <div className="intc-table__avatar" aria-hidden="true">
                      <span className="intc-table__avatar-text">{getInitials(user)}</span>
                    </div>
                    <div className="intc-table__identity-info">
                      <p className="intc-table__name" title={fullName}>{fullName}</p>
                      <p className="intc-table__email" title={user.email || '—'}>{user.email || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="intc-table__td">{user.issuingCountry || '—'}</td>
                <td className="intc-table__td">{docType}</td>
                <td className="intc-table__td intc-table__td--mono">{user.internationalDocumentNumber || '—'}</td>
                <td className="intc-table__td">{formatDate(user.createdAt)}</td>
                <td className="intc-table__td"><StatusBadge status={user.verificationStatus} /></td>
                <td className="intc-table__td intc-table__td--actions">
                  <div className="intc-table__actions">
                    <button type="button" className="intc-table__btn" onClick={() => onViewDetail(user)}>
                      Ver detalle
                    </button>
                    {canApprove && (
                      <button
                        type="button"
                        className="intc-table__icon-btn intc-table__icon-btn--approve"
                        aria-label={`Aprobar a ${fullName}`}
                        title="Aprobar"
                        onClick={() => onApprove?.(user)}
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                    {canReject && (
                      <button
                        type="button"
                        className="intc-table__icon-btn intc-table__icon-btn--reject"
                        aria-label={`Rechazar a ${fullName}`}
                        title="Rechazar"
                        onClick={() => onReject?.(user)}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
