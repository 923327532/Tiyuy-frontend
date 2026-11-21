'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDisabled = property.status === 'DISABLED_BY_ADMIN';
  const isPending = property.status === 'PENDING';
  const isPublished = property.status === 'PUBLISHED';
  const canToggleFeature = canFeature && (isPublished || Boolean(property.isFeatured));

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const runAndClose = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <div
      ref={menuRef}
      className="properties-row-actions"
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        variant="ghost"
        size="sm"
        icon={<Eye className="h-3.5 w-3.5" />}
        ariaLabel="Ver detalles"
        onClick={() => onViewDetail(property)}
      />

      {canModerate && isPending && !isDisabled ? (
        <IconButton
          variant="ghost"
          size="sm"
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
          ariaLabel="Aprobar propiedad"
          onClick={() => onModerate(property, 'APPROVE')}
        />
      ) : (
        canToggleFeature && (
          <IconButton
            variant="ghost"
            size="sm"
            icon={
              <Star
                className={`h-3.5 w-3.5 ${
                  property.isFeatured ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
            }
            ariaLabel={property.isFeatured ? 'Quitar destacado' : 'Destacar propiedad'}
            onClick={() => onToggleFeatured(property)}
          />
        )
      )}

      {canModerate && (
        <div className="properties-actions-dropdown">
          <IconButton
            variant="ghost"
            size="sm"
            icon={<MoreHorizontal className="h-3.5 w-3.5" />}
            ariaLabel="Más acciones"
            onClick={() => setOpen((prev) => !prev)}
          />

          {open && (
            <div className="properties-actions-menu" role="menu">
              {!isDisabled && (
                <>
                  {property.status !== 'PUBLISHED' && !isPending && (
                    <button
                      type="button"
                      className="properties-actions-menu__item properties-actions-menu__item--success"
                      onClick={() => runAndClose(() => onModerate(property, 'APPROVE'))}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Aprobar</span>
                    </button>
                  )}
                  {property.status !== 'SUSPENDED' && (
                    <button
                      type="button"
                      className="properties-actions-menu__item properties-actions-menu__item--warn"
                      onClick={() => runAndClose(() => onModerate(property, 'SUSPEND'))}
                    >
                      <PauseCircle className="h-3.5 w-3.5" />
                      <span>Suspender</span>
                    </button>
                  )}
                  {property.status !== 'REJECTED' && (
                    <button
                      type="button"
                      className="properties-actions-menu__item properties-actions-menu__item--danger"
                      onClick={() => runAndClose(() => onModerate(property, 'REJECT'))}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Rechazar</span>
                    </button>
                  )}
                  <div className="properties-actions-menu__divider" />
                </>
              )}

              {isDisabled ? (
                <button
                  type="button"
                  className="properties-actions-menu__item properties-actions-menu__item--success"
                  onClick={() => runAndClose(() => onEnable(property))}
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  <span>Habilitar</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="properties-actions-menu__item properties-actions-menu__item--danger"
                  onClick={() => runAndClose(() => onDisable(property))}
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Deshabilitar</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}