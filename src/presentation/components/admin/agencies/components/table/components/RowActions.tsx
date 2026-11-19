'use client';

import { Eye, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { IconButton } from '@/presentation/components/ui/Button';

interface RowActionsProps {
  agency: InmobiliariaWithStats;
  onViewDetail: () => void;
  onNotify?: () => void;
}

export function RowActions({ agency, onViewDetail, onNotify }: RowActionsProps) {
  return (
    <div
      className="users-table__actions"
      onClick={(event) => event.stopPropagation()}
    >
      <IconButton
        variant="ghost"
        size="sm"
        className="users-table__action-btn users-table__action-btn--view"
        icon={<Eye className="w-4 h-4" aria-hidden="true" />}
        ariaLabel={`Ver detalle de ${agency.name}`}
        onClick={onViewDetail}
      />
      {onNotify && (
        <IconButton
          variant="ghost"
          size="sm"
          className="users-table__action-btn users-table__action-btn--properties"
          icon={<MessageSquare className="w-4 h-4" aria-hidden="true" />}
          ariaLabel={`Notificar a ${agency.name}`}
          onClick={onNotify}
        />
      )}
      <IconButton
        variant="ghost"
        size="sm"
        className="users-table__action-btn"
        icon={<MoreHorizontal className="w-4 h-4" aria-hidden="true" />}
        ariaLabel={`Más opciones de ${agency.name}`}
        onClick={onViewDetail}
      />
    </div>
  );
}
