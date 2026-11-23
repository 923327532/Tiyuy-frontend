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

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import type { ProjectModerationAction } from '@/presentation/components/admin/projects/hooks/useProjectsActions';
import { IconButton } from '@/presentation/components/ui/Button';
import '@/presentation/components/admin/properties/components/styles/properties-table.css';

interface Props {
  project: ProjectAdminItem;
  canModerate: boolean;
  onView: (project: ProjectAdminItem) => void;
  onModerate: (project: ProjectAdminItem, action: ProjectModerationAction) => void;
  onToggleFeatured: (project: ProjectAdminItem) => void;
  onDisable: (project: ProjectAdminItem) => void;
  onEnable: (project: ProjectAdminItem) => void;
}

const MENU_WIDTH = 170;

export function ProjectRowActions({
  project,
  canModerate,
  onView,
  onModerate,
  onToggleFeatured,
  onDisable,
  onEnable,
}: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, ready: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPublished = project.status === 'PUBLISHED';
  const isDraft = project.status === 'DRAFT';
  const isSuspended = project.status === 'SUSPENDED' || project.status === 'CANCELLED';
  const isDisabled = !project.isActive;
  const canToggleFeature = project.isFeatured || isPublished;

  // getBoundingClientRect ya devuelve coordenadas del viewport; con position: fixed
  // no hay que sumar scrollY/scrollX. Se mide la altura real del menú antes de pintar.
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

    // Preferir debajo; solo abrir arriba si claramente hay más espacio y no cabe debajo.
    const openAbove =
      spaceBelow < menuHeight + gap + 4 && spaceAbove > spaceBelow;
    const top = openAbove
      ? Math.max(8, rect.top - menuHeight - gap)
      : Math.min(rect.bottom + gap, Math.max(8, window.innerHeight - menuHeight - 8));

    // Alinear el borde derecho del menú con el del botón "..."
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
            {!isPublished && !isSuspended && (
              <button
                type="button"
                className="properties-actions-menu__item properties-actions-menu__item--success"
                onClick={() => runAndClose(() => onModerate(project, 'APPROVE'))}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Publicar</span>
              </button>
            )}
            {(isPublished || isDraft) && (
              <button
                type="button"
                className="properties-actions-menu__item properties-actions-menu__item--warn"
                onClick={() => runAndClose(() => onModerate(project, 'SUSPEND'))}
              >
                <PauseCircle className="h-3.5 w-3.5" />
                <span>Pausar</span>
              </button>
            )}
            {!isSuspended && (
              <button
                type="button"
                className="properties-actions-menu__item properties-actions-menu__item--danger"
                onClick={() => runAndClose(() => onModerate(project, 'REJECT'))}
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Suspender</span>
              </button>
            )}
            <div className="properties-actions-menu__divider" />
          </>
        )}

        {isDisabled ? (
          <button
            type="button"
            className="properties-actions-menu__item properties-actions-menu__item--success"
            onClick={() => runAndClose(() => onEnable(project))}
          >
            <PlayCircle className="h-3.5 w-3.5" />
            <span>Habilitar</span>
          </button>
        ) : (
          <button
            type="button"
            className="properties-actions-menu__item properties-actions-menu__item--danger"
            onClick={() => runAndClose(() => onDisable(project))}
          >
            <Ban className="h-3.5 w-3.5" />
            <span>Deshabilitar</span>
          </button>
        )}
      </div>,
      document.body
    );

  return (
    <div className="projects-table__actions" onClick={(event) => event.stopPropagation()}>
      <IconButton
        variant="ghost"
        size="sm"
        icon={<Eye className="h-3.5 w-3.5" />}
        ariaLabel={`Ver ${project.name}`}
        onClick={() => onView(project)}
      />

      {canToggleFeature && (
        <IconButton
          variant="ghost"
          size="sm"
          icon={
            <Star
              className={`h-3.5 w-3.5 ${
                project.isFeatured ? 'fill-amber-400 text-amber-500' : ''
              }`}
            />
          }
          ariaLabel={project.isFeatured ? 'Quitar destacado' : 'Destacar proyecto'}
          onClick={() => onToggleFeatured(project)}
        />
      )}

      {canModerate && (
        <IconButton
          ref={triggerRef}
          variant="ghost"
          size="sm"
          icon={<MoreHorizontal className="h-3.5 w-3.5" />}
          ariaLabel={`Más acciones de ${project.name}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        />
      )}

      {menu}
    </div>
  );
}
