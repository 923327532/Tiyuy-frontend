'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import type { Banner } from '@/core/domain/entities/Admin';
import { IconButton } from '@/presentation/components/ui/Button';
import '@/presentation/components/admin/properties/components/styles/properties-table.css';

interface Props {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onToggle: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  busyId?: number | null;
  className?: string;
}

const MENU_WIDTH = 190;

export function BannerActionsMenu({
  banner,
  onEdit,
  onToggle,
  onDelete,
  busyId,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, ready: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isBusy = busyId === banner.id;

  useLayoutEffect(() => {
    if (!open) {
      setPosition((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }

    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu || typeof window === 'undefined') return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight || 150;
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
    const close = () => setOpen(false);

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const runAndClose = (action: () => void) => {
    setOpen(false);
    action();
  };

  const menu =
    open &&
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
        <button
          type="button"
          className="properties-actions-menu__item"
          disabled={isBusy}
          onClick={() => runAndClose(() => onEdit(banner))}
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Editar</span>
        </button>
        <button
          type="button"
          className={`properties-actions-menu__item ${banner.isActive ? 'properties-actions-menu__item--warn' : 'properties-actions-menu__item--success'}`}
          disabled={isBusy}
          onClick={() => runAndClose(() => onToggle(banner))}
        >
          {banner.isActive ? (
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{banner.isActive ? 'Pausar' : 'Activar'}</span>
        </button>
        <div className="properties-actions-menu__divider" />
        <button
          type="button"
          className="properties-actions-menu__item properties-actions-menu__item--danger"
          disabled={isBusy}
          onClick={() => runAndClose(() => onDelete(banner))}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Eliminar</span>
        </button>
      </div>,
      document.body
    );

  return (
    <div className={className} onClick={(event) => event.stopPropagation()}>
      <IconButton
        ref={triggerRef}
        variant="ghost"
        size="sm"
        icon={<MoreHorizontal className="h-4 w-4" aria-hidden="true" />}
        ariaLabel={`Acciones de ${banner.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isBusy}
        onClick={() => setOpen((prev) => !prev)}
      />
      {menu}
    </div>
  );
}
