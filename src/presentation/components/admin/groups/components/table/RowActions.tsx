'use client';

import {
  AlertTriangle,
  Ban,
  Eye,
  PauseCircle,
  RefreshCw,
} from 'lucide-react';

import { IconButton } from '@/presentation/components/ui/Button';
import type { GroupItem } from '../../types';

interface RowActionsProps {
  item: GroupItem;
  isSuspendedView: boolean;
  onViewDetail: (item: GroupItem) => void;
  onToggleStatus: (item: GroupItem) => void;
  onSuspend: (item: GroupItem) => void;
  onViolation: (item: GroupItem) => void;
  onReactivate: (item: GroupItem) => void;
}

export function RowActions({
  item,
  isSuspendedView,
  onViewDetail,
  onToggleStatus,
  onSuspend,
  onViolation,
  onReactivate,
}: RowActionsProps) {
  const name = item.name;

  return (
    <div
      className="users-table__actions flex items-center"
      style={{ justifyContent: 'center', gap: '0.375rem' }}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        variant="ghost"
        size="sm"
        className="users-table__action-btn users-table__action-btn--view"
        icon={<Eye className="w-4 h-4" />}
        ariaLabel={`Ver detalle de ${name}`}
        onClick={() => onViewDetail(item)}
      />

      {isSuspendedView ? (
        <IconButton
          variant="ghost"
          size="sm"
          className="users-table__action-btn users-table__action-btn--activate"
          icon={<RefreshCw className="w-4 h-4" />}
          ariaLabel={`Reactivar a ${name}`}
          onClick={() => onReactivate(item)}
        />
      ) : (
        <>
          <IconButton
            variant="ghost"
            size="sm"
            className={`users-table__action-btn ${item.isActive ? 'users-table__action-btn--suspend' : 'users-table__action-btn--activate'}`}
            icon={<Ban className="w-4 h-4" />}
            ariaLabel={item.isActive ? `Deshabilitar a ${name}` : `Habilitar a ${name}`}
            onClick={() => onToggleStatus(item)}
          />

          <IconButton
            variant="ghost"
            size="sm"
            className="users-table__action-btn users-table__action-btn--suspend"
            icon={<PauseCircle className="w-4 h-4" />}
            ariaLabel={`Suspender a ${name}`}
            onClick={() => onSuspend(item)}
          />

          <IconButton
            variant="danger"
            size="sm"
            className="users-table__action-btn users-table__action-btn--delete"
            icon={<AlertTriangle className="w-4 h-4" />}
            ariaLabel={`Reportar violación de ${name}`}
            onClick={() => onViolation(item)}
          />
        </>
      )}
    </div>
  );
}
