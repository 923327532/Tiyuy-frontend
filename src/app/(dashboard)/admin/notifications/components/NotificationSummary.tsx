'use client';

interface NotificationSummaryProps {
  newNotification: {
    sendToAll: boolean;
    roles: string[];
    userIds: number[];
    agencyIds: string[];
    sendEmail: boolean;
    sendInApp: boolean;
  };
}

export function NotificationSummary({ newNotification }: NotificationSummaryProps) {
  return (
    <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
      <p className="text-xs sm:text-sm text-teal-800 break-words">
        <strong>Resumen:</strong>
        {newNotification.sendToAll
          ? ' Enviar a todos los usuarios'
          : newNotification.roles.length > 0
            ? ` Roles: ${newNotification.roles.join(', ')}`
            : newNotification.userIds.length > 0
              ? ` ${newNotification.userIds.length} usuarios seleccionados`
              : newNotification.agencyIds.length > 0
                ? ` ${newNotification.agencyIds.length} inmobiliarias`
                  : ' Selecciona destinatarios'}
        {newNotification.sendEmail && ' via Email'}
        {newNotification.sendInApp && ' + In-App'}
      </p>
    </div>
  );
}