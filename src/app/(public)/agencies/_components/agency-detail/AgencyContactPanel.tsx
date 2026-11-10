'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AgencyDetail } from '../types';
import type { AgencyLead } from '../../_hooks/useAgencyDetail';

interface AgencyContactPanelProps {
  agency: AgencyDetail;
  userLoggedIn: boolean;
  sending: boolean;
  sent: boolean;
  error: string;
  onRequireAuthentication: () => void;
  onSend: (lead: AgencyLead) => void;
}

const EMPTY_LEAD: AgencyLead = { name: '', email: '', phone: '', message: '' };

export default function AgencyContactPanel({
  agency,
  userLoggedIn,
  sending,
  sent,
  error,
  onRequireAuthentication,
  onSend,
}: AgencyContactPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_LEAD);
  const waNumber = agency.phone?.replace(/[^0-9]/g, '') || '';
  const waPhone = waNumber.startsWith('51') ? waNumber : `51${waNumber}`;
  const waMessage = encodeURIComponent(`Hola ${agency.name || ''}, vi tu perfil en Tiyuy.`);

  const handleOpenForm = () => {
    if (!userLoggedIn) {
      onRequireAuthentication();
      return;
    }
    setShowForm(true);
  };

  const handleWhatsApp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!userLoggedIn) {
      event.preventDefault();
      onRequireAuthentication();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(formData);
  };

  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
        Contacto
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        Comunícate con la agencia
      </h2>

      <dl className="mt-5 space-y-4 border-t border-[var(--border-light)] pt-5">
        <ContactItem Icon={Mail} label="Correo electrónico">
          {agency.email ? (
            <a href={`mailto:${agency.email}`} className="hover:text-[var(--brand-primary-hover)] focus-visible:outline-none focus-visible:underline">
              {agency.email}
            </a>
          ) : 'No disponible'}
        </ContactItem>
        <ContactItem Icon={Phone} label="Teléfono">
          {agency.phone ? (
            <a href={`tel:${agency.phone}`} className="hover:text-[var(--brand-primary-hover)] focus-visible:outline-none focus-visible:underline">
              {agency.phone}
            </a>
          ) : 'No disponible'}
        </ContactItem>
        <ContactItem Icon={MapPin} label="Ciudad">
          {agency.city || 'No disponible'}
        </ContactItem>
      </dl>

      <div className="mt-6 flex flex-col gap-2 border-t border-[var(--border-light)] pt-5">
        {waNumber && (
          <a
            href={`https://wa.me/${waPhone}?text=${waMessage}`}
            onClick={handleWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] px-4 text-sm font-semibold text-[var(--brand-primary-hover)] transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        )}
        {!showForm && !sent && (
          <button
            type="button"
            onClick={handleOpenForm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary-hover)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            Enviar mensaje
          </button>
        )}
      </div>

      {showForm && !sent && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 border-t border-[var(--border-light)] pt-5">
          <LeadInput
            id="agency-contact-name"
            label="Nombre"
            required
            autoComplete="name"
            value={formData.name}
            onChange={(name) => setFormData((previous) => ({ ...previous, name }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <LeadInput
              id="agency-contact-email"
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(email) => setFormData((previous) => ({ ...previous, email }))}
            />
            <LeadInput
              id="agency-contact-phone"
              label="Teléfono"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(phone) => setFormData((previous) => ({ ...previous, phone }))}
            />
          </div>
          <div>
            <label htmlFor="agency-contact-message" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              Mensaje <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="agency-contact-message"
              required
              rows={4}
              value={formData.message}
              onChange={(event) => setFormData((previous) => ({ ...previous, message: event.target.value }))}
              className="w-full resize-y rounded-lg border border-[var(--input-border)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
            />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-10 rounded-lg px-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--brand-primary-hover)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              {sending ? 'Enviando…' : 'Enviar mensaje'}
            </button>
          </div>
        </form>
      )}

      {sent && (
        <p role="status" className="mt-5 flex items-center gap-2 border-t border-[var(--border-light)] pt-5 text-sm font-medium text-[var(--brand-primary-hover)]">
          <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          Tu mensaje fue enviado.
        </p>
      )}
    </section>
  );
}

function ContactItem({
  Icon,
  label,
  children,
}: {
  Icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
      <div className="min-w-0">
        <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
        <dd className="mt-1 break-all text-sm font-medium text-[var(--text-primary)]">
          {children}
        </dd>
      </div>
    </div>
  );
}

function LeadInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-[var(--input-border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
      />
    </div>
  );
}
