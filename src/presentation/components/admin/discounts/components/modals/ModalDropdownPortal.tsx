'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

/** Menu flotante fuera del modal: evita que el scroll del body recorte las opciones. */
export function ModalDropdownPortal({ anchorRef, children, onClose, className = '' }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useEffect(() => {
    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const width = menuRef.current?.offsetWidth || rect.width;
      const left = Math.min(rect.left, window.innerWidth - width - 12);
      setStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: Math.max(12, left),
        width: rect.width,
        maxHeight: Math.max(160, window.innerHeight - rect.bottom - 20),
        zIndex: 120,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    if (!onClose) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [anchorRef, onClose]);

  if (typeof document === 'undefined' || !style) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className={`overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10 ${className}`}
      role="listbox"
    >
      {children}
    </div>,
    document.body,
  );
}
