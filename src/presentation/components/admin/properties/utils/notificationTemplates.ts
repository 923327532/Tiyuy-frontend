import type { PropertyModerationItem } from '@/core/domain/entities/Admin';

export interface NotificationTemplate {
  label: string;
  subject: string;
  message: string;
}

export function getNotificationTemplates(property: PropertyModerationItem): NotificationTemplate[] {
  const name = property.ownerName || 'propietario';
  const title = property.title;

  return [
    {
      label: 'Propiedad deshabilitada',
      subject: 'Tu propiedad ha sido deshabilitada',
      message: `Hola ${name},\n\nTu propiedad "${title}" ha sido deshabilitada por incumplimiento de nuestras políticas.\n\nRevisa las reglas de publicación y realiza los cambios necesarios para habilitarla nuevamente.\n\nSi tienes dudas, contacta con soporte.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Reportes recibidos',
      subject: 'Reportes sobre tu propiedad',
      message: `Hola ${name},\n\nHemos recibido reportes de usuarios sobre tu propiedad "${title}".\n\nTe recomendamos revisar la información publicada y actualizarla si es necesario para evitar suspensiones.\n\nSaludos,\nEquipo Tiyuy`,
    },
    {
      label: 'Recordatorio de suscripción',
      subject: 'Tu suscripción está por vencer',
      message: `Hola ${name},\n\nTe recordamos que tu suscripción está próxima a vencer. Para mantener tu propiedad "${title}" visible, te recomendamos renovar tu plan.\n\nSaludos,\nEquipo Tiyuy`,
    },
  ];
}
