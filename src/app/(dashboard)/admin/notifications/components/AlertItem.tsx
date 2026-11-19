'use client';

import { AlertTriangle, Settings, Megaphone, TrendingUp, Shield, Calendar, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ActionMenu } from './ActionMenu';

interface AlertItemProps {
  alert: any;
  status: { label: string; color: string; dot: string };
  channels: { label: string; active: boolean }[];
  getAlertTypeIcon: (type: string) => React.ReactNode;
  getAlertTypeLabel: (type: string) => string;
  onActionMenu: (id: number | string, type: 'notification' | 'alert', data: any) => void;
  onDelete: (id: number | string) => void;
  onViewDetail: (type: 'notification' | 'alert', data: any) => void;
  openActionMenu: number | string | null;
  setOpenActionMenu: (id: number | string | null) => void;
}

const alertTypeStyles = {
  EMERGENCY: 'bg-red-100 text-red-600',
  SYSTEM: 'bg-blue-100 text-blue-600',
  ANNOUNCEMENT: 'bg-teal-100 text-teal-600',
  MARKETING: 'bg-cyan-100 text-cyan-600',
  SECURITY: 'bg-purple-100 text-purple-600',
};

const alertTypeIcons = {
  EMERGENCY: <AlertTriangle className="w-5 h-5" />,
  SYSTEM: <Settings className="w-5 h-5" />,
  ANNOUNCEMENT: <Megaphone className="w-5 h-5" />,
  MARKETING: <TrendingUp className="w-5 h-5" />,
  SECURITY: <Shield className="w-5 h-5" />,
};

export function AlertItem({
  alert,
  status,
  channels,
  getAlertTypeIcon,
  getAlertTypeLabel,
  onActionMenu,
  onDelete,
  onViewDetail,
  openActionMenu,
  setOpenActionMenu,
}: AlertItemProps) {
  const iconStyle = alertTypeStyles[alert.alertType as keyof typeof alertTypeStyles] || 'bg-cyan-100 text-cyan-600';
  const typeIcon = alertTypeIcons[alert.alertType as keyof typeof alertTypeIcons] || <AlertTriangle className="w-5 h-5" />;

  return (
    <div
      className="p-4 sm:p-5 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon - hidden on very small screens */}
        <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl items-center justify-center ${iconStyle}`}>
          {typeIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  ALERTA: {getAlertTypeLabel(alert.alertType)}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`}></span>
                  {status.label}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{alert.subject}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
            </div>

            {/* Action Menu */}
            <ActionMenu
              itemId={alert.id}
              itemType="alert"
              onViewDetail={onViewDetail}
              onDelete={onDelete}
            />
          </div>

          {/* Metadata */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {format(new Date(alert.createdAt), 'dd MMM yyyy, HH:mm')}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {alert.targetUserCount || 0} destinatarios
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