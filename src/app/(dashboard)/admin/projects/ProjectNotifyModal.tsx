/**
 * Modal para notificar al desarrollador de un proyecto.
 * Header blanco y actions fijas, con un único scroll central.
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';

interface ProjectNotifyModalProps {
  project: ProjectAdminItem;
  isOpen: boolean;
  isPending?: boolean;
  onSend: (subject: string, message: string, includeDetails: boolean) => void;
  onCancel: () => void;
}

interface ProjectTemplate {
  label: string;
  subject: string;
  message: string;
}

function getProjectTemplates(project: ProjectAdminItem): ProjectTemplate[] {
  const recipient = project.developerName || 'Desarrollador';
  const title = project.name;

  return [
    {
      label: 'Proyecto pausado',
      subject: 'Tu proyecto ha sido pausado',
      message: `Hola ${recipient},\n\nEl proyecto "${title}" ha sido pausado temporalmente.\n\nRevisa su estado en tu panel y realiza los ajustes necesarios para reactivarlo.\n\nSi tienes dudas, contacta con soporte.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Proyecto deshabilitado',
      subject: 'Tu proyecto ha sido deshabilitado',
      message: `Hola ${recipient},\n\nEl proyecto "${title}" ha sido deshabilitado por incumplimiento de nuestras políticas.\n\nRevisa las reglas de publicación y realiza los cambios necesarios para solicitar su habilitación.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Reportes recibidos',
      subject: 'Reportes sobre tu proyecto',
      message: `Hola ${recipient},\n\nHemos recibido reportes de usuarios sobre el proyecto "${title}".\n\nTe recomendamos revisar la información publicada y actualizarla si es necesario para evitar suspensiones.\n\nSaludos,\nEquipo Tiyuy`,
    },
  ];
}

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0f2e3a] outline-none transition placeholder:text-slate-400 focus:border-[#0f2e3a] focus:ring-2 focus:ring-[#0f2e3a]/15 disabled:cursor-not-allowed disabled:opacity-60';

export function ProjectNotifyModal({
  project,
  isOpen,
  isPending = false,
  onSend,
  onCancel,
}: ProjectNotifyModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);

  const templates = getProjectTemplates(project);
  const canSubmit = subject.trim().length > 0 && message.trim().length > 0 && !isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSend(subject.trim(), message.trim(), includeDetails);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="lg"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col bg-white">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-5">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#0f2e3a]">Notificar Desarrollador</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Envía un correo al desarrollador responsable del proyecto
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
                <strong>Para:</strong> {project.developerName || 'Desarrollador'} (
                {project.developerEmail || 'sin correo'})
              </p>
              <p className="mt-1 break-words">
                <strong>Proyecto:</strong> {project.name}
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
              <label htmlFor="project-notify-subject" className="mb-1 block text-sm font-medium text-[#0f2e3a]">
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                id="project-notify-subject"
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
              <label htmlFor="project-notify-message" className="mb-1 block text-sm font-medium text-[#0f2e3a]">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                id="project-notify-message"
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
              Incluir detalles del proyecto en el email
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
