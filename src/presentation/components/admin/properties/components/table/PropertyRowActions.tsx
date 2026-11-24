'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import '@/presentation/components/admin/properties/components/styles/properties-table.css';

interface PropertyRowActionsProps extends PropertyActionHandlers {
  property: PropertyModerationItem;
  canModerate: boolean;
  canFeature: boolean;
}

const MENU_WIDTH = 170;

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
  const [position, setPosition] = useState({ top: 0, left: 0, ready: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDisabled = property.status === 'DISABLED_BY_ADMIN';
  const isPending = property.status === 'PENDING';
  const isPublished = property.status === 'PUBLISHED';
  const canToggleFeature = canFeature && (isPublished || Boolean(property.isFeatured));

  // getBoundingClientRect ya devuelve coordenadas del viewport; con position: fixed
  // no hay que sumar scrollY/scrollX. Se mide la altura real antes de pintar.
  useLayoutEffect(() => {
    if (!open) {
      setPosition((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu || typeof window === 'undefined') return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight || 120;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openAbove = spaceBelow < menuHeight + gap + 4 && spaceAbove > spaceBelow;
    const top = openAbove
      ? Math.max(8, rect.top - menuHeight - gap)
      : Math.min(rect.bottom + gap, Math.max(8, window.innerHeight - menuHeight - 8));
    const left = Math.max(
      8,
      Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)
    );

    setPosition({ top, left, ready: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const handleScroll = () => setOpen(false);

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open]);

  const runAndClose = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  const menu = open &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={menuRef}
        role="menu"
        className="properties-actions-menu"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          right: 'auto',
          bottom: 'auto',
          width: MENU_WIDTH,
          visibility: position.ready ? 'visible' : 'hidden',
          zIndex: 9999,
        }}
      >
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
      </div>,
      document.body
    );

  return (
    <div className="properties-row-actions" onClick={(event) => event.stopPropagation()}>
      <IconButton
        variant="ghost"
        size="sm"
        icon={<Eye className="h-3.5 w-3.5" />}
        ariaLabel={`Ver ${property.title}`}
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
                className={`h-3.5 w-3.5 ${property.isFeatured ? 'fill-amber-400 text-amber-500' : ''}`}
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
            ref={triggerRef}
            variant="ghost"
            size="sm"
            icon={<MoreHorizontal className="h-3.5 w-3.5" />}
            ariaLabel={`Más acciones de ${property.title}`}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
      )}

      {menu}
    </div>
  );
}
