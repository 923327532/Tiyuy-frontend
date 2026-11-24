'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Trash2,
  XCircle,
} from 'lucide-react';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import type { CampaignModerationAction } from '../../hooks/useCampaignsActions';
import { IconButton } from '@/presentation/components/ui/Button';
import '@/presentation/components/admin/properties/components/styles/properties-table.css';

interface Props {
  campaign: PromotionCampaign;
  canModerate: boolean;
  onView: (campaign: PromotionCampaign) => void;
  onAction: (campaign: PromotionCampaign, action: CampaignModerationAction) => void;
}

const MENU_WIDTH = 180;

export function CampaignRowActions({ campaign, canModerate, onView, onAction }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, ready: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const status = campaign.status;
  const canApprove = status !== 'ACTIVE' && status !== 'EXPIRED';
  const canReject = status === 'PENDING_APPROVAL' || status === 'DRAFT';
  const canSuspend = status === 'ACTIVE';
  const canReactivate = status === 'SUSPENDED' || status === 'PAUSED' || status === 'REJECTED';

  useLayoutEffect(() => {
    if (!open) {
      setPosition((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu || typeof window === 'undefined') return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight || 140;
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

  const runAndClose = (action: CampaignModerationAction) => {
    setOpen(false);
    onAction(campaign, action);
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
        {canApprove && (
          <button
            type="button"
            className="properties-actions-menu__item properties-actions-menu__item--success"
            onClick={() => runAndClose('APPROVE')}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Aprobar</span>
          </button>
        )}
        {canReject && (
          <button
            type="button"
            className="properties-actions-menu__item properties-actions-menu__item--danger"
            onClick={() => runAndClose('REJECT')}
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Rechazar</span>
          </button>
        )}
        {canSuspend && (
          <button
            type="button"
            className="properties-actions-menu__item properties-actions-menu__item--warn"
            onClick={() => runAndClose('SUSPEND')}
          >
            <PauseCircle className="h-3.5 w-3.5" />
            <span>Suspender</span>
          </button>
        )}
        {canReactivate && (
          <button
            type="button"
            className="properties-actions-menu__item properties-actions-menu__item--success"
            onClick={() => runAndClose('REACTIVATE')}
          >
            <PlayCircle className="h-3.5 w-3.5" />
            <span>Reactivar</span>
          </button>
        )}
        <div className="properties-actions-menu__divider" />
        <button
          type="button"
          className="properties-actions-menu__item properties-actions-menu__item--danger"
          onClick={() => runAndClose('DELETE')}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Eliminar</span>
        </button>
      </div>,
      document.body
    );

  return (
    <div className="campaigns-table__actions" onClick={(event) => event.stopPropagation()}>
      <IconButton
        variant="ghost"
        size="sm"
        icon={<Eye className="h-3.5 w-3.5" />}
        ariaLabel={`Ver ${campaign.title}`}
        onClick={() => onView(campaign)}
      />
      {canModerate && (
        <IconButton
          ref={triggerRef}
          variant="ghost"
          size="sm"
          icon={<MoreHorizontal className="h-3.5 w-3.5" />}
          ariaLabel={`Más acciones de ${campaign.title}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        />
      )}
      {menu}
    </div>
  );
}

