'use client';

import { Bell, Calendar, Users, CheckCircle, XCircle, AlertTriangle, Clock, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { ActionMenu } from './ActionMenu';

interface NotificationItemProps {
  notification: any;
  status: { label: string; color: string; dot: string };
  channels: { label: string; active: boolean }[];
  onActionMenu: (id: number | string, type: 'notification' | 'alert', data: any) => void;
  onDelete: (id: number | string) => void;
  onViewDetail: (type: 'notification' | 'alert', data: any) => void;
  openActionMenu: number | string | null;
  setOpenActionMenu: (id: number | string | null) => void;
}

const statusIcons = {
  alert: <AlertTriangle className="w-5 h-5 text-red-500" />,
  info: <CheckCircle className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  success: <CheckCircle className="w-5 h-5 text-teal-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  default: <Bell className="w-5 h-5 text-gray-500" />,
};

export function NotificationItem({
  notification,
  status,
  channels,
  onActionMenu,
  onDelete,
  onViewDetail,
  openActionMenu,
  setOpenActionMenu,
}: NotificationItemProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return statusIcons.alert;
      case 'info': return statusIcons.info;
      case 'warning': return statusIcons.warning;
      case 'success': return statusIcons.success;
      case 'error': return statusIcons.error;
      default: return statusIcons.default;
    }
  };

  return (
    <div
      className="p-4 sm:p-5 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon - hidden on very small screens, show on sm+ */}
        <div className="hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl items-center justify-center bg-teal-100 text-teal-600">
          <Bell className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                  NOTIFICACIÓN
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`}></span>
                  {status.label}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{notification.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
            </div>

            {/* Action Menu */}
            <ActionMenu
              itemId={notification.id}
              itemType="notification"
              onViewDetail={onViewDetail}
              onDelete={onDelete}
            />
          </div>

          {/* Metadata */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {format(new Date(notification.createdAt), 'dd MMM yyyy, HH:mm')}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {notification.recipientCount || 1} {notification.recipientCount === 1 ? 'destinatario' : 'destinatarios'}
            </span>
            <span className="flex items-center gap-1.5">
              {channels.map((ch, i) => (
                <span key={i} className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium ${
                  ch.active ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {ch.label}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}