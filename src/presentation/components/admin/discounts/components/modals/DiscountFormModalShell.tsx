'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  footer: ReactNode;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  tone?: 'executive' | 'emerald';
}

function Header({
  icon, title, subtitle, onClose, emerald,
}: Pick<Props, 'icon' | 'title' | 'subtitle' | 'onClose'> & { emerald: boolean }) {
  return (
    <header
      className={
        emerald
          ? 'flex shrink-0 items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/60 px-6 py-4'
          : 'sticky top-0 z-20 shrink-0 bg-gradient-to-r from-[#0f2e3a] via-[#133c4b] to-[#164e63] px-5 py-4 text-white'
      }
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={
            emerald
              ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-100/80 font-semibold text-emerald-700'
              : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20'
          }
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className={emerald ? 'text-base font-semibold text-slate-900' : 'truncate text-base font-bold tracking-tight'}>
            {title}
          </h3>
          {subtitle && (
            <p className={emerald ? 'mt-0.5 text-xs text-slate-500' : 'mt-0.5 truncate text-xs text-slate-200/90'}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar modal"
        className={
          emerald
            ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700'
            : 'shrink-0 rounded-xl bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white'
        }
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </header>
  );
}

/** Shell de formularios de descuentos: ejecutivo o esmeralda (SaaS limpio). */
export function DiscountFormModalShell({
  isOpen, onClose, icon, title, subtitle, footer, children, size = 'lg', tone = 'executive',
}: Props) {
  const emerald = tone === 'emerald';

  useEffect(() => {
    if (!emerald || !isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [emerald, isOpen]);

  const header = <Header icon={icon} title={title} subtitle={subtitle} onClose={onClose} emerald={emerald} />;

  if (emerald) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10"
        >
          {header}
          <div className="min-h-[16rem] flex-1 overflow-y-auto px-6 py-5">{children}</div>
          <footer className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            {footer}
          </footer>
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      <div className="flex min-h-0 flex-1 flex-col bg-white">
        {header}
        <div className="min-h-[16rem] flex-1 overflow-visible p-5 sm:p-6">{children}</div>
        <footer className="sticky bottom-0 z-20 flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/95 px-5 py-3.5 backdrop-blur">
          {footer}
        </footer>
      </div>
    </Modal>
  );
}
