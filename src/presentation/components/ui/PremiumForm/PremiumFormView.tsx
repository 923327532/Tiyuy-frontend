'use client';

import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

import { Button } from '@/presentation/components/ui/Button';

import './styles/PremiumForm.css';

interface PremiumFormViewProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  backHref?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  cancelHref?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  asideTitle?: string;
  asideDescription?: string;
  asideItems?: string[];
  children: ReactNode;
  className?: string;
}

export function PremiumFormView({
  eyebrow = 'Formulario TIYUY',
  title,
  description,
  backHref,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  cancelHref,
  onCancel,
  isSubmitting = false,
  submitDisabled = false,
  asideTitle = 'Antes de continuar',
  asideDescription = 'Revisa la información antes de guardar. Podrás editar estos datos más adelante desde el panel de administración.',
  asideItems = [
    'Verifica que el nombre sea claro y reconocible.',
    'Confirma que los datos de administrador sean correctos.',
    'El elemento se creará con el estado seleccionado.',
  ],
  children,
  className = '',
}: PremiumFormViewProps) {
  return (
    <div className={`premium-form ${className}`.trim()}>
      <header className="premium-form__hero">
        <span className="premium-form__eyebrow">
          <span className="premium-form__eyebrow-dot" aria-hidden="true" />
          {eyebrow}
        </span>

        <h1 className="premium-form__title">
          {title}
          <span className="premium-form__title-accent">.</span>
        </h1>

        {description ? <p className="premium-form__description">{description}</p> : null}

        {backHref ? (
          <Link href={backHref} className="premium-form__back">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al listado
          </Link>
        ) : null}
      </header>

      <form onSubmit={onSubmit} className="premium-form__layout" noValidate>
        <div className="premium-form__main">
          <div className="premium-form__card">{children}</div>

          <div className="premium-form__actions">
            <p className="premium-form__actions-hint">Los campos marcados con * son obligatorios.</p>
            {cancelHref ? (
              <Link
                href={cancelHref}
                className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                {cancelLabel}
              </Link>
            ) : onCancel ? (
              <Button type="button" variant="secondary" size="md" onClick={onCancel}>
                {cancelLabel}
              </Button>
            ) : null}
            <Button
              type="submit"
              variant="brand"
              size="md"
              isLoading={isSubmitting}
              disabled={submitDisabled || isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </div>

        <aside className="premium-form__aside" aria-label="Recomendaciones del formulario">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
            <h2 className="premium-form__aside-title">{asideTitle}</h2>
          </div>
          <p className="premium-form__aside-text">{asideDescription}</p>

          <ul className="premium-form__aside-list">
            {asideItems.map((item) => (
              <li key={item} className="premium-form__aside-item">
                <CheckCircle2 className="premium-form__aside-check mt-0.5 h-4 w-4" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </form>
    </div>
  );
}
