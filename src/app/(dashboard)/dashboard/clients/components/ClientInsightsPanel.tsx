'use client';

import { CRMMetrics, CRMClient } from '@/core/domain/entities/CRM';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Activity,
  Zap,
  BarChart3,
  Clock,
  UserCheck
} from 'lucide-react';

interface ClientInsightsPanelProps {
  metrics: CRMMetrics;
  topClients: CRMClient[];
  atRiskClients: CRMClient[];
}

export function ClientInsightsPanel({ metrics, topClients, atRiskClients }: ClientInsightsPanelProps) {
  const insights = [
    {
      icon: Users,
      title: 'Crecimiento',
      value: `+${metrics.newClientsThisWeek}`,
      label: 'nuevos esta semana',
      color: 'bg-blue-500',
      trend: 'positive' as const
    },
    {
      icon: MessageSquare,
      title: 'Interacciones',
      value: metrics.interactionsThisWeek.toString(),
      label: 'esta semana',
      color: 'bg-teal-500',
      trend: 'neutral' as const
    },
    {
      icon: Target,
      title: 'Tasa de Conversión',
      value: `${Math.round((metrics.highInterestClients / Math.max(metrics.totalClients, 1)) * 100)}%`,
      label: 'alto interés',
      color: 'bg-green-500',
      trend: 'positive' as const
    },
    {
      icon: Activity,
      title: 'Score Promedio',
      value: metrics.averageInteractionScore.toString(),
      label: 'general',
      color: 'bg-violet-500',
      trend: metrics.averageInteractionScore > 50 ? 'positive' as const : 'warning' as const
    }
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item, index) => (
          <div key={index} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`${item.color} bg-opacity-10 p-2 rounded-lg`}>
                <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
              </div>
              {item.trend === 'positive' && (
                <span className="text-green-500 text-xs font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  ↑
                </span>
              )}
              {item.trend === 'warning' && (
                <span className="text-yellow-500 text-xs font-medium flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-0.5" />
                  !
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-xs text-[var(--text-secondary)]">{item.title}</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{item.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Clientes en Riesgo */}
      {atRiskClients.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-orange-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Clientes en Riesgo
            </h3>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {atRiskClients.length}
            </span>
          </div>
          <p className="text-xs text-orange-600 mb-3">
            Clientes con alto score pero sin actividad reciente (+14 días)
          </p>
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {atRiskClients.slice(0, 5).map(client => (
              <div key={client.id} className="flex items-center justify-between p-2.5 bg-[var(--bg-card)] rounded-lg shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-xs">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{client.name}</p>
                    <p className="text-xs text-orange-600">
                      Sin actividad: {client.daysSinceLastActivity} días
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Score: {client.interactionScore}</span>
                  <p className="text-xs text-[var(--text-muted)]">{client.messageActivity.totalMessages} mensajes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
