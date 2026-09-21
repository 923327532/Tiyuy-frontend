'use client';

import { useConversionPipeline } from '@/presentation/hooks/useAgentCRM';
import { TrendingDown, TrendingUp, Users, UserPlus, MessageCircle, Handshake, CheckCircle, Filter } from 'lucide-react';

const COLORS = [
  { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500' },
  { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' },
  { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200', bar: 'bg-purple-500' },
  { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' },
  { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' },
  { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500' },
  { bg: 'bg-cyan-500', text: 'text-cyan-700', light: 'bg-cyan-50', border: 'border-cyan-200', bar: 'bg-cyan-500' },
];

const STAGE_ICONS: Record<string, any> = {
  'NEW_LEAD': UserPlus,
  'CONTACTED': MessageCircle,
  'INTERESTED': Users,
  'NEGOTIATION': Handshake,
  'CLOSED_WON': CheckCircle,
  'CLOSED_LOST': TrendingDown,
};

export function ConversionPipeline() {
  const { data: pipeline, isLoading } = useConversionPipeline();

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Embudo de Conversión</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[var(--bg-tertiary)] rounded-lg" style={{ width: `${100 - i * 15}%`, margin: '0 auto' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!pipeline?.stages?.length) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Embudo de Conversión</h3>
        </div>
        <p className="text-[var(--text-secondary)] text-center py-3 text-sm">No hay datos de pipeline</p>
      </div>
    );
  }

  const maxCount = Math.max(...pipeline.stages.map(s => s.count));

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-200/50">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Embudo de Conversión</h3>
            <p className="text-xs text-[var(--text-muted)]">{pipeline.totalDeals} deals totales</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--text-primary)]">{pipeline.totalDeals}</p>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Total</p>
        </div>
      </div>

      {/* Funnel real - forma de embudo con datos reales */}
      <div className="relative flex flex-col items-center">
        {pipeline.stages.map((stage, index) => {
          const color = COLORS[index % COLORS.length];
          const Icon = STAGE_ICONS[stage.stage] || Users;
          const widthPercent = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const isLast = index === pipeline.stages.length - 1;
          
          return (
            <div key={stage.stage} className="w-full flex flex-col items-center">
              {/* CONTENEDOR DEL EMBUDO - se angosta según datos reales */}
              <div style={{ width: `${10 + (widthPercent * 0.9)}%` }} className="min-w-[60%] max-w-full transition-all duration-700">
                <div className={`
                  relative ${color.light} ${color.border} border-x-2
                  ${index === 0 ? 'border-t-2 rounded-t-2xl' : ''}
                  ${isLast ? 'border-b-2 rounded-b-2xl' : ''}
                  ${!isLast ? 'border-b-0' : ''}
                  transition-all duration-500
                `}>
                  {/* Contenido interno */}
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${color.bg} flex items-center justify-center shadow-lg shadow-${color.bg}/30`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">{stage.stageLabel}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{stage.count} {stage.count === 1 ? 'deal' : 'deals'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-black ${color.text}`}>{stage.count}</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                          {maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0}% del total
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="h-2 bg-[var(--bg-card)]/70 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full ${color.bar} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>

                    {/* Métricas de conversión */}
                    {!isLast && (
                      <div className="mt-3 flex items-center justify-center gap-4">
                        {stage.conversionRateToNext > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-[10px] font-bold text-green-700">
                              {stage.conversionRateToNext.toFixed(1)}% convierten
                            </span>
                          </div>
                        )}
                        {stage.dropOffRate > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 rounded-full">
                            <TrendingDown className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] font-bold text-red-600">
                              {stage.dropOffRate.toFixed(1)}% se pierden
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conector circular entre etapas */}
              {!isLast && (
                <div className="flex justify-center -my-1 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-color)] flex items-center justify-center shadow-md">
                    <svg className="w-3 h-3 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen con dots de colores */}
      <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
        <div className="grid grid-cols-5 gap-2">
          {pipeline.stages.slice(0, 5).map((stage, index) => {
            const color = COLORS[index % COLORS.length];
            return (
              <div key={stage.stage} className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1.5 ${color.bar} shadow-sm`} />
                <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider font-medium">{stage.stageLabel}</p>
                <p className={`text-sm font-extrabold ${color.text}`}>{stage.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}