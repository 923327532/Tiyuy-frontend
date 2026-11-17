'use client';

import { Bell, AlertTriangle, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface KpiStatsProps {
  notificationHistoryAll: { content: any[]; totalElements: number } | null;
  adminAlerts: { content: any[]; totalElements: number } | null;
}

export function KpiStats({ notificationHistoryAll, adminAlerts }: KpiStatsProps) {
  const recentNotifications = notificationHistoryAll?.content?.filter(
    (n: any) => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length || 0;

  const recentAlerts = adminAlerts?.content?.filter(
    (a: any) => new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length || 0;

  const totalRecipients = 
    (notificationHistoryAll?.content?.reduce((acc: number, n: any) => acc + (n.recipientCount || 1), 0) || 0) +
    (adminAlerts?.content?.reduce((acc: number, a: any) => acc + (a.targetUserCount || 0), 0) || 0);

  const stats = [
    {
      label: 'Total Notificaciones',
      value: notificationHistoryAll?.totalElements || 0,
      subLabel: 'Notificaciones enviadas',
      icon: Bell,
      gradient: 'from-teal-500 to-teal-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      subTextColor: 'text-teal-200',
    },
    {
      label: 'Total Alertas',
      value: adminAlerts?.totalElements || 0,
      subLabel: 'Alertas generadas',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      subTextColor: 'text-red-200',
    },
    {
      label: 'Últimos 7 Días',
      value: recentNotifications + recentAlerts,
      subLabel: 'Actividad reciente',
      icon: Clock,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      subTextColor: 'text-green-200',
    },
    {
      label: 'Total Destinatarios',
      value: totalRecipients,
      subLabel: 'Usuarios alcanzados',
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      subTextColor: 'text-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 ${stat.textColor} shadow-lg shadow-teal-500/20`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium uppercase tracking-wider ${stat.subTextColor}`}>{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.subTextColor}`}>{stat.subLabel}</p>
              </div>
              <div className={`p-3 rounded-xl backdrop-blur-sm ${stat.iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}