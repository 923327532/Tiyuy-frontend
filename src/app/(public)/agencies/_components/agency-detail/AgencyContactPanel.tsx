'use client';

import { useState, type FormEvent } from 'react';
import { LoaderCircle, Lock, Mail, MessageCircle, MessageSquare, Phone, Send, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AgencyLead } from '../../_hooks/useAgencyDetail';
import type { AgencyDetail } from '../types';

interface AgencyContactPanelProps {
  agency: AgencyDetail;
  sending: boolean;
  sent: boolean;
  error: string;
  onSend: (lead: AgencyLead) => void;
}

const EMPTY_LEAD: AgencyLead = { name: '', email: '', phone: '', message: '' };

const FIELD_CLASS =
  'w-full rounded-2xl border border-stone-200/80 bg-white py-2.5 pl-10 pr-3.5 text-xs font-medium text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-[#4A9A3E] focus:ring-2 focus:ring-[#4A9A3E]/25';

export default function AgencyContactPanel({
  agency,
  sending,
  sent,
  error,
  onSend,
}: AgencyContactPanelProps) {
  const [lead, setLead] = useState<AgencyLead>(EMPTY_LEAD);

  const waNumber = agency.phone?.replace(/[^0-9]/g, '') || '';
  const waPhone = waNumber.startsWith('51') ? waNumber : `51${waNumber}`;
  const waMessage = encodeURIComponent(
    `Hola ${agency.name || ''}, vi tu perfil en Tiyuy.`,
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(lead);
  };

  const update =
    (key: keyof AgencyLead) => (event: { target: { value: string } }) =>
      setLead((current) => ({ ...current, [key]: event.target.value }));

  const fields = [
    { key: 'name' as const, Icon: User as LucideIcon, label: 'Nombre' },
    { key: 'email' as const, Icon: Mail as LucideIcon, label: 'Correo' },
    { key: 'phone' as const, Icon: Phone as LucideIcon, label: 'Teléfono' },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-[#FAF7F2] shadow-xl">
      {/* Header verde Tiyuy */}
      <div className="bg-gradient-to-br from-[#4A9A3E] to-[#3b7c31] p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
            <MessageSquare aria-hidden="true" className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-tight">
              Escribe a {agency.name}
            </h2>
            <p className="text-xs text-white/85">Nuestro equipo te ayudará con gusto.</p>
          </div>
        </div>
      </div>

      {/* Cuerpo del formulario */}
      <div className="p-5">
        {/* WhatsApp */}
        {waNumber && (
          <a
            href={`https://wa.me/${waPhone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#1da851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
        )}

        {sent ? (
          <div role="status" aria-live="polite" className="py-6 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#4A9A3E]/10 text-[#3b7c31]">
              <Send aria-hidden="true" className="h-4 w-4" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-stone-900">¡Mensaje enviado!</h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              {agency.name} ha recibido tu mensaje y se pondrá en contacto pronto.
            </p>
          </div>
        ) : (
          <>
            {waNumber && (
              <div className="flex items-center gap-3 py-4 text-[11px] font-medium text-stone-400">
                <span aria-hidden="true" className="h-px flex-1 bg-stone-200/80" />
                <span>o déjanos un mensaje</span>
                <span aria-hidden="true" className="h-px flex-1 bg-stone-200/80" />
              </div>
            )}

            <form onSubmit={submit} noValidate className="space-y-3">
              {fields.map(({ key, Icon, label }) => (
                <div key={key} className="relative">
                  <Icon
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    value={lead[key]}
                    onChange={update(key)}
                    placeholder={
                      key === 'name' ? 'Tu nombre *' : key === 'email' ? 'Tu correo *' : 'Tu teléfono'
                    }
                    autoComplete={key === 'name' ? 'name' : key}
                    aria-label={label}
                    required={key === 'name'}
                    className={FIELD_CLASS}
                  />
                </div>
              ))}

              {/* Campo Mensaje */}
              <div className="relative">
                <MessageSquare
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400"
                />
                <textarea
                  value={lead.message}
                  onChange={update('message')}
                  placeholder="Tu mensaje *"
                  aria-label="Mensaje"
                  rows={3}
                  required
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-red-600" role="alert">
                  {error}
                </p>
              )}

              {/* Botón Enviar */}
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A9A3E] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#3b7c31] focus:outline-none focus:ring-2 focus:ring-[#4A9A3E] focus:ring-offset-2 disabled:opacity-60"
              >
                {sending ? (
                  <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-white" />
                ) : (
                  <Send aria-hidden="true" className="h-3.5 w-3.5" />
                )}
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>

              {/* Pie de privacidad */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-stone-500">
                <Lock aria-hidden="true" className="h-3 w-3 text-stone-400" />
                <span>Tu información está segura</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
