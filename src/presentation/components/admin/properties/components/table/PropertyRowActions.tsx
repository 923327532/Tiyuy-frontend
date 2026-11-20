'use client';

import {
  Ban,
  CheckCircle2,
  Eye,
  PauseCircle,
  PlayCircle,
  Star,
  XCircle,
} from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { IconButton } from '@/presentation/components/ui/Button';
import type { PropertyActionHandlers } from '../../types/properties.types';

interface PropertyRowActionsProps extends PropertyActionHandlers {
  property: PropertyModerationItem;
  canModerate: boolean;
  canFeature: boolean;
}

export function PropertyRowActions({
  property,
  canModerate,
  canFeature,
  onViewDetail,
  onModerate,
  onToggleFeatured,
  onDisable,
  onEnable,
}: PropertyRowActionsProps) {
  const isDisabled = property.status === 'DISABLED_BY_ADMIN';

  return (
    <div className="properties-row-actions">
      <IconButton
        variant="ghost"
        size="sm"
        icon={<Eye className="h-3.5 w-3.5" />}
        ariaLabel="Ver detalles"
        onClick={() => onViewDetail(property)}
      />

      {canModerate && !isDisabled && (
        <>
          <IconButton
            variant="ghost"
            size="sm"
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            ariaLabel="Aprobar propiedad"
            onClick={() => onModerate(property, 'APPROVE')}
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon={<XCircle className="h-3.5 w-3.5" />}
            ariaLabel="Rechazar propiedad"
            onClick={() => onModerate(property, 'REJECT')}
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon={<PauseCircle className="h-3.5 w-3.5" />}
            ariaLabel="Suspender propiedad"
            onClick={() => onModerate(property, 'SUSPEND')}
          />
        </>
      )}

      {canFeature && (
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Star className={`h-3.5 w-3.5 ${property.isFeatured ? 'fill-amber-400 text-amber-500' : ''}`} />}
          ariaLabel={property.isFeatured ? 'Quitar destacado' : 'Destacar propiedad'}
          onClick={() => onToggleFeatured(property)}
        />
      )}

      {canModerate && (isDisabled ? (
        <IconButton
          variant="ghost"
          size="sm"
          icon={<PlayCircle className="h-3.5 w-3.5" />}
          ariaLabel="Habilitar propiedad"
          onClick={() => onEnable(property)}
        />
      ) : (
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Ban className="h-3.5 w-3.5" />}
          ariaLabel="Deshabilitar propiedad"
          onClick={() => onDisable(property)}
        />
      ))}
    </div>
  );
}
