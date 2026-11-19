'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CRMMetrics } from '@/core/domain/entities/CRM';

interface InteractiveActivityChartProps {
  metrics: CRMMetrics;
}

const CATEGORIES = [
  { key: 'Mensajes', color: '#0ea5e9' },
  { key: 'Activos', color: '#10b981' },
  { key: 'Alto Interés', color: '#8b5cf6' },
  { key: 'Interés Medio', color: '#f59e0b' },
  { key: 'Bajo Interés', color: '#6b7280' },
  { key: 'En Riesgo', color: '#ef4444' },
];

export function InteractiveActivityChart({ metrics }: InteractiveActivityChartProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Un solo array con cada punto como objeto separado para tener línea conectada
  const chartData = useMemo(() => [
    { name: 'Mensajes', value: metrics.messagesExchanged, fill: '#0ea5e9' },
    { name: 'Activos', value: metrics.activeClients, fill: '#10b981' },
    { name: 'Alto Interés', value: metrics.highInterestClients, fill: '#8b5cf6' },
    { name: 'Interés Medio', value: metrics.mediumInterestClients, fill: '#f59e0b' },
    { name: 'Bajo Interés', value: metrics.lowInterestClients, fill: '#6b7280' },
    { name: 'En Riesgo', value: metrics.clientsAtRisk.length, fill: '#ef4444' },
  ], [metrics]);

  const maxVal = Math.max(1, ...chartData.map(d => d.value));

  // Calcular puntos para SVG overlay (puntos exactos en coordenadas)
  const points = chartData.map((d, i) => ({
    ...d,
    cx: 10 + i * (100 / (chartData.length - 1)) * 0.9, // posición X relativa
    cy: d.value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] px-4 py-3 min-w-[160px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
          <span className="text-sm font-bold text-[var(--text-primary)]">{d.name}</span>
        </div>
        <p className="text-2xl font-black text-[var(--text-primary)]">{d.value}</p>
      </div>
    );
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="sm:px-6 px-4 py-5 border-b border-[var(--border-light)]">
        <h2 className="text-base font-bold text-[var(--text-primary)]">Analytics Predictivo</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">Pasa el mouse sobre los puntos para ver detalles</p>
      </div>

      {/* Chart */}
      <div className="px-6 py-4">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-5} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
              
              {/* Línea única conectando todos los puntos - estilo financiero */}
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="20%" stopColor="#10b981" />
                  <stop offset="40%" stopColor="#8b5cf6" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="80%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Área bajo la línea */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGrad)"
                strokeWidth={3}
                dot={false}
                activeDot={false}
              />

              {/* Puntos individuales por categoría */}
              {chartData.map((d, i) => {
                const isHovered = hoveredKey === d.name;
                return (
                  <Line
                    key={d.name}
                    type="monotone"
                    dataKey="value"
                    stroke="transparent"
                    fill="transparent"
                    dot={false}
                    activeDot={false}
                    data={[d]}
                    onMouseEnter={() => setHoveredKey(d.name)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer - línea horizontal con dots tipo timeline */}
      <div className="sm:px-6 px-4 py-5 border-t border-[var(--border-light)]">
        <div className="relative">
          {/* Línea base horizontal */}
          <div className="absolute top-[7px] left-0 right-0 h-px bg-[var(--border-color)]" />
          
          <div className="relative flex justify-between gap-1">
            {chartData.map((d) => {
              const isHovered = hoveredKey === d.name;
              return (
                <div
                  key={d.name}
                  className="flex flex-col items-center cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredKey(d.name)}
                  onMouseLeave={() => setHoveredKey(null)}
                  style={{ transform: isHovered ? 'translateY(-2px)' : 'none' }}
                >
                  <div
                    className={`w-[15px] h-[15px] rounded-full border-[3px] border-[var(--bg-card)] shadow-sm transition-all duration-200 ${
                      isHovered ? 'scale-125 shadow-md' : ''
                    }`}
                    style={{ backgroundColor: d.fill }}
                  />
                  <span className={`text-[10px] mt-2 font-semibold whitespace-nowrap transition-colors duration-200 ${
                    isHovered ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}>
                    {d.name}
                  </span>
                  <span className={`text-xs font-black transition-all duration-200 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-60'
                  }`} style={{ color: d.fill }}>
                    {d.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}