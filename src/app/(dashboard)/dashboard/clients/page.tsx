'use client';

import { useState } from 'react';
import { useClientCRM } from '@/presentation/hooks/useClientCRM';
import { useAuthStore } from '@/presentation/store/authStore';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { StockTickerCards } from './components/StockTickerCards';
import { RealTimeHeatmap } from './components/RealTimeHeatmap';
import { InteractiveActivityChart } from './components/InteractiveActivityChart';
import { ClientList } from './components/ClientList';
import { ClientInsightsPanel } from './components/ClientInsightsPanel';
import { HotLeadsPanel } from './components/HotLeadsPanel';
import { ConversionPipeline } from './components/ConversionPipeline';
import { PropertyMatchesPanel } from './components/PropertyMatchesPanel';
import { CRMClient } from '@/core/domain/entities/CRM';
import {
  ArrowLeft,
  Users,
  Zap,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

type TabView = 'principal' | 'estadisticas' | 'avanzado';

export default function CRMDashboardPage() {
  const { user } = useAuthStore();
  const {
    clients,
    metrics,
    heatmapData,
    isLoading,
    filterClients,
  } = useClientCRM(user?.id);

  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>('principal');

  if (isLoading) {
    return (
      <ProtectedRoute requiredRoles={['AGENT', 'DEVELOPER', 'ADMIN']}>
        <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] font-medium">Cargando panel de clientes...</p>
            <p className="text-sm text-[var(--text-muted)] mt-2">Sincronizando contactos, leads y propiedades</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['AGENT', 'DEVELOPER', 'ADMIN']}>
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        {/* Header */}
        <div className="bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-30">
          <div className="max-w-7xl mx-auto sm:px-6 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  href="/dashboard"
                  className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-50 rounded-lg shrink-0">
                      <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)] truncate">Análisis y Seguimiento</h1>
                  </div>
                </div>
              </div>

              {/* Tabs - scrollable en mobile */}
              <div className="overflow-x-auto overflow-y-hidden scrollbar-hide -mr-4 pr-4 sm:mr-0 sm:pr-0 ml-auto">
                <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-0.5 w-max">
                  <button
                    onClick={() => setActiveTab('principal')}
                    className={`
                      flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 whitespace-nowrap
                      ${activeTab === 'principal'
                        ? 'bg-[var(--bg-card)] text-teal-600 shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <Users className="w-3 h-3" />
                    Ppal
                  </button>
                  <button
                    onClick={() => setActiveTab('estadisticas')}
                    className={`
                      flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 whitespace-nowrap
                      ${activeTab === 'estadisticas'
                        ? 'bg-[var(--bg-card)] text-teal-600 shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <BarChart3 className="w-3 h-3" />
                    Stats
                  </button>
                  <button
                    onClick={() => setActiveTab('avanzado')}
                    className={`
                      flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 whitespace-nowrap
                      ${activeTab === 'avanzado'
                        ? 'bg-[var(--bg-card)] text-teal-600 shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <Zap className="w-3 h-3" />
                    Avanz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 px-4 py-6 space-y-6">
          {/* VISTA PRINCIPAL - Tarjetas + Heatmap */}
          {activeTab === 'principal' && (
            <>
              <StockTickerCards metrics={metrics} />
              <RealTimeHeatmap clients={clients} heatmapData={heatmapData} />
            </>
          )}

          {/* VISTA ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <div className="space-y-6">
              {/* KPI Cards - ancho completo */}
              <ClientInsightsPanel
                metrics={metrics}
                topClients={metrics.topEngagedClients}
                atRiskClients={metrics.clientsAtRisk}
              />

              {/* ClientList + Top Clientes lado a lado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClientList
                  clients={clients}
                  filterClients={filterClients}
                  selectedClientId={selectedClient?.id}
                  onClientSelect={setSelectedClient}
                />
                {/* Top Clientes */}
                <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Más Comprometidos
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">Top 5</span>
                  </div>
                  <div className="space-y-2">
                    {metrics.topEngagedClients.length === 0 ? (
                      <p className="text-[var(--text-secondary)] text-center py-3 text-sm">No hay datos suficientes</p>
                    ) : (
                      metrics.topEngagedClients.slice(0, 5).map((client, index) => {
                        const topName = client.name && client.name !== 'Sin nombre' && client.name.length > 2 
                          ? client.name 
                          : (client.email || client.phone || `Cliente #${client.id}`);
                        return (
                        <div key={client.id} className="flex items-center justify-between p-2.5 bg-[var(--bg-tertiary)] rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 
                              flex items-center justify-center text-white font-semibold text-xs">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{topName}</p>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {client.messageActivity.totalMessages} mensajes · {client.totalInteractions} interacciones
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                              <span className="font-bold text-blue-600 text-sm">{client.interactionScore}</span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)]">
                              {client.daysSinceLastActivity <= 7 ? 'Activo reciente' : `Hace ${client.daysSinceLastActivity} días`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                    )}
                  </div>
                </div>
              </div>

              {/* Gráfica al final */}
              <InteractiveActivityChart metrics={metrics} />
            </div>
          )}

          {/* VISTA CRM AVANZADO */}
          {activeTab === 'avanzado' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Conversión</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <HotLeadsPanel />
                  <ConversionPipeline />
                  <PropertyMatchesPanel />
                </div>
              </div>

              {/* Selected Client Detail - Solo en Conversión */}
              {selectedClient && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                  <div className="sm:px-6 px-4 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-gradient-to-r from-teal-50 to-[var(--bg-card)]">
                    <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2 min-w-0">
                      <div className="p-1 bg-teal-100 rounded-lg shrink-0">
                        <Users className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="truncate">Detalle: {selectedClient.name && selectedClient.name !== 'Sin nombre' && selectedClient.name.length > 2 
                        ? selectedClient.name 
                        : (selectedClient.email || selectedClient.phone || `Cliente #${selectedClient.id}`)}</span>
                    </h3>
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1 hover:bg-[var(--bg-tertiary)] rounded-lg shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="sm:p-6 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="font-medium text-blue-900 mb-2 text-sm">Mensajes</h4>
                        <div className="space-y-1">
                          <p className="text-blue-700 text-sm"><span className="font-semibold">{selectedClient.messageActivity.totalMessages}</span> total</p>
                          <p className="text-blue-600 text-sm"><span className="font-semibold">{selectedClient.messageActivity.sentMessages}</span> enviados</p>
                          <p className="text-blue-600 text-sm"><span className="font-semibold">{selectedClient.messageActivity.receivedMessages}</span> recibidos</p>
                        </div>
                      </div>
                      <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                        <h4 className="font-medium text-teal-900 mb-2 text-sm">Grupos</h4>
                        <div className="space-y-1">
                          <p className="text-teal-700 text-sm"><span className="font-semibold">{selectedClient.groupActivity.groupsJoined}</span> grupos</p>
                          <p className="text-teal-600 text-sm"><span className="font-semibold">{selectedClient.groupActivity.postsCreated}</span> posts</p>
                          <p className="text-teal-600 text-sm"><span className="font-semibold">{selectedClient.groupActivity.commentsMade}</span> comentarios</p>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <h4 className="font-medium text-purple-900 mb-2 text-sm">Canales</h4>
                        <div className="space-y-1">
                          <p className="text-purple-700 text-sm"><span className="font-semibold">{selectedClient.channelActivity.channelsSubscribed}</span> suscripciones</p>
                          <p className="text-purple-600 text-sm"><span className="font-semibold">{selectedClient.channelActivity.eventsAttended}</span> eventos</p>
                          <p className="text-purple-600 text-sm"><span className="font-semibold">{selectedClient.channelActivity.eventResponses}</span> respuestas</p>
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <h4 className="font-medium text-amber-900 mb-2 text-sm">Propiedades</h4>
                        <div className="space-y-1">
                          <p className="text-amber-700 text-sm"><span className="font-semibold">{selectedClient.propertyActivity.propertiesViewed}</span> vistas</p>
                          <p className="text-amber-600 text-sm"><span className="font-semibold">{selectedClient.propertyActivity.inquiriesMade}</span> consultas</p>
                          <p className="text-amber-600 text-sm"><span className="font-semibold">{selectedClient.propertyActivity.favoritesAdded}</span> favoritos</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="text-center">
                          <span className="text-xs text-[var(--text-muted)]">Score</span>
                          <p className="text-lg font-bold text-teal-600">{selectedClient.interactionScore}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-[var(--text-muted)]">Engagement</span>
                          <p className="text-lg font-bold text-emerald-600">{selectedClient.engagementRate}%</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-[var(--text-muted)]">Última Actividad</span>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {selectedClient.daysSinceLastActivity === 0 ? 'Hoy' :
                             selectedClient.daysSinceLastActivity === 1 ? 'Ayer' :
                             `Hace ${selectedClient.daysSinceLastActivity} días`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
