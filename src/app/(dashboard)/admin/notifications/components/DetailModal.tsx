'use client';

import { AlertTriangle, Bell, Calendar, Users, XCircle, Trash2, CheckCircle, Clock, Shield, Megaphone, TrendingUp, Settings } from 'lucide-react';
import { format } from 'date-fns';

interface DetailModalProps {
  detailItem: { type: 'notification' | 'alert'; data: any } | null;
  onClose: () => void;
  onDelete: (type: 'notification' | 'alert', id: number | string) => void;
  getDeliveryStatus: (item: any) => { label: string; color: string; dot: string };
  getChannels: (item: any) => { label: string; active: boolean }[];
  getAlertTypeLabel: (type: string) => string;
}

const alertTypeStyles = {
  EMERGENCY: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertTriangle, iconBg: 'bg-red-500' },
  SYSTEM: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Settings, iconBg: 'bg-blue-500' },
  ANNOUNCEMENT: { bg: 'bg-teal-100', text: 'text-teal-700', icon: Megaphone, iconBg: 'bg-teal-500' },
  MARKETING: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: TrendingUp, iconBg: 'bg-cyan-500' },
  SECURITY: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Shield, iconBg: 'bg-purple-500' },
};

export function DetailModal({
  detailItem,
  onClose,
  onDelete,
  getDeliveryStatus,
  getChannels,
  getAlertTypeLabel,
}: DetailModalProps) {
  if (!detailItem) return null;

  const isAlert = detailItem.type === 'alert';
  const data = detailItem.data;
  const status = getDeliveryStatus(data);
  const channels = getChannels(data);
  const alertStyle = isAlert ? alertTypeStyles[data.alertType as keyof typeof alertTypeStyles] || alertTypeStyles.EMERGENCY : null;
  const AlertIcon = isAlert && alertStyle ? alertStyle.icon : Bell;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={`p-6 border-b ${isAlert ? 'border-red-100 bg-gradient-to-r from-red-50 to-red-100/50' : 'border-teal-100 bg-gradient-to-r from-teal-50 to-teal-100/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isAlert ? alertStyle?.iconBg : 'bg-teal-500'}`}>
                <AlertIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isAlert ? 'Detalle de Alerta' : 'Detalle de Notificación'}
                </h3>
                <p className="text-sm text-gray-500">Información completa del envío</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              <span className={`w-2 h-2 rounded-full ${status.dot} mr-2`}></span>
              {status.label}
            </span>
            {isAlert && alertStyle && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${alertStyle.bg} ${alertStyle.text}`}>
                {getAlertTypeLabel(data.alertType)}
              </span>
            )}
            {!isAlert && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
                NOTIFICACIÓN
              </span>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Asunto</label>
            <p className="text-lg font-semibold text-gray-900">{data.title || data.subject}</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mensaje</label>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100">{data.message}</p>
          </div>

          {/* Details Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de Envío</label>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {format(new Date(data.createdAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Destinatarios</label>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                {isAlert
                  ? `${data.targetUserCount || 0} usuarios`
                  : `${data.recipientCount || 1} ${data.recipientCount === 1 ? 'usuario' : 'usuarios'}`}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Canales</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {channels.map((ch, i) => (
                  <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    ch.active ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {ch.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">ID</label>
              <p className="text-sm font-mono text-gray-900">#{data.id}</p>
            </div>
          </div>

          {/* Roles / Targets */}
          {data.roles && data.roles.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Roles Destinatarios</label>
              <div className="flex flex-wrap gap-2">
                {data.roles.map((role: string) => (
                  <span key={role} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Send to All */}
          {data.sendToAll && (
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
              <p className="text-sm text-teal-800 font-medium">Enviado a todos los usuarios</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              if (confirm(`¿Eliminar esta ${isAlert ? 'alerta' : 'notificación'} del historial?`)) {
                onDelete(isAlert ? 'alert' : 'notification', data.id);
                onClose();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}