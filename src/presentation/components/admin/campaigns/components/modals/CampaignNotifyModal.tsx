'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';

interface Template {
  label: string;
  subject: string;
  message: string;
}

function getTemplates(campaign: PromotionCampaign): Template[] {
  const owner = campaign.ownerName || 'Anunciante';
  const title = campaign.title;
  return [
    {
      label: 'Campaña aprobada',
      subject: 'Tu campaña ha sido aprobada',
      message: `Hola ${owner},\n\nLa campaña "${title}" ha sido aprobada y ya está activa en la plataforma.\n\nGracias por confiar en Tiyuy.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Campaña pausada',
      subject: 'Tu campaña ha sido pausada',
      message: `Hola ${owner},\n\nLa campaña "${title}" ha sido pausada temporalmente.\n\nRevisa su estado en tu panel y realiza los ajustes necesarios para reactivarla.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Cambios requeridos',
      subject: 'Se requieren cambios en tu campaña',
      message: `Hola ${owner},\n\nNecesitamos que revises la campaña "${title}" y realices los cambios indicados por el equipo de moderación.\n\nCuando esté lista, vuelve a enviarla para aprobación.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Campaña rechazada',
      subject: 'Tu campaña ha sido rechazada',
      message: `Hola ${owner},\n\nLa campaña "${title}" ha sido rechazada porque no cumple nuestras políticas de publicación.\n\nRevisa los lineamientos y envíala nuevamente cuando esté lista.\n\nSaludos,\nEquipo Tiyuy`,
    },
  ];
}

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0f2e3a] outline-none transition placeholder:text-slate-400 focus:border-[#0f2e3a] focus:ring-2 focus:ring-[#0f2e3a]/15 disabled:cursor-not-allowed disabled:opacity-60';

interface Props {
  campaign: PromotionCampaign;
  isOpen: boolean;
  isPending?: boolean;
  onSend: (subject: string, message: string, includeDetails: boolean) => void;
  onCancel: () => void;
}

export function CampaignNotifyModal({ campaign, isOpen, isPending = false, onSend, onCancel }: Props) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);

  const templates = getTemplates(campaign);
  const canSubmit = subject.trim().length > 0 && message.trim().length > 0 && !isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSend(subject.trim(), message.trim(), includeDetails);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="lg" contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 flex-col bg-white">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-5">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#0f2e3a]">Notificar Anunciante</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Envía un correo al creador responsable de la campaña
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs sm:text-sm text-[#0f2e3a]">
              <p className="break-words">
                <strong>Para:</strong> {campaign.ownerName || 'Anunciante'} (
                {campaign.ownerEmail || 'sin correo'})
              </p>
              <p className="mt-1 break-words">
                <strong>Campaña:</strong> {campaign.title}
              </p>
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Plantillas rápidas
              </span>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.label}
                    type="button"
                    onClick={() => {
                      setSubject(template.subject);
                      setMessage(template.message);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-[#0f2e3a]/30 hover:bg-slate-50 hover:text-[#0f2e3a]"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="campaign-notify-subject" className="mb-1 block text-sm font-medium text-[#0f2e3a]">
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                id="campaign-notify-subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className={INPUT_CLASS}
                placeholder="Asunto del mensaje"
                disabled={isPending}
                required
              />
            </div>

            <div>
              <label htmlFor="campaign-notify-message" className="mb-1 block text-sm font-medium text-[#0f2e3a]">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                id="campaign-notify-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Escribe tu mensaje aquí..."
                disabled={isPending}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(event) => setIncludeDetails(event.target.checked)}
                className="rounded border-slate-300 text-[#0f2e3a] focus:ring-[#0f2e3a]/30"
                disabled={isPending}
              />
              Incluir detalles de la campaña en el email
            </label>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:justify-end md:px-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-[#0f2e3a] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#0f2e3a] px-4 text-sm font-medium text-white transition hover:bg-[#164e63] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Enviando...' : 'Enviar notificación'}
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  );
}
