'use client';

import { useMemo, useState } from 'react';
import { CRMClient, ClientHeatmapData } from '@/core/domain/entities/CRM';
import { Clock, Users, TrendingUp, Activity } from 'lucide-react';

interface RealTimeHeatmapProps {
  clients: CRMClient[];
  heatmapData: ClientHeatmapData[];
}

interface HeatmapCell {
  hour: number;
  day: number;
  dayLabel: string;
  value: number;
  clients: string[];
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getIntensityColor(value: number, max: number): string {
  if (max === 0) return 'bg-gray-50';
  const intensity = value / max;
  if (intensity === 0) return 'bg-gray-50';
  if (intensity < 0.1) return 'bg-teal-50';
  if (intensity < 0.2) return 'bg-teal-100';
  if (intensity < 0.35) return 'bg-teal-200';
  if (intensity < 0.5) return 'bg-teal-300';
  if (intensity < 0.65) return 'bg-teal-400';
  if (intensity < 0.8) return 'bg-teal-500';
  return 'bg-teal-600';
}

function getTextColor(value: number, max: number): string {
  if (max === 0) return 'text-gray-400';
  const intensity = value / max;
  if (intensity < 0.35) return 'text-gray-700';
  return 'text-white';
}

function formatHour(hour: number): string {
  if (hour === 0) return '0:00';
  if (hour === 12) return '12:00';
  if (hour < 12) return `${hour}:00`;
  return `${hour - 12}:00`;
}

function generateAggregatedHeatmap(clients: CRMClient[], heatmapData: ClientHeatmapData[]) {
  const grid: Map<string, HeatmapCell> = new Map();
  const hourlyTotals = Array(24).fill(0);
  const dailyTotals = Array(7).fill(0);

  DAYS.forEach((day, dayIdx) => {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${dayIdx}-${hour}`;
      grid.set(key, { hour, day: dayIdx, dayLabel: day, value: 0, clients: [] });
    }
  });

  // Use real heatmap data from hook
  heatmapData.forEach((data: ClientHeatmapData) => {
    if (data.hourlyActivity && data.hourlyActivity.length > 0) {
      data.hourlyActivity.forEach(({ hour, count }: { hour: number; count: number }) => {
        if (count > 0) {
          for (let d = 0; d < 7; d++) {
            const key = `${d}-${hour}`;
            const cell = grid.get(key);
            if (cell) {
              const weight = 1 / 7;
              const contribution = Math.max(1, Math.round(count * weight));
              cell.value += contribution;
              if (data.clientName && !cell.clients.includes(data.clientName)) {
                cell.clients.push(data.clientName);
              }
            }
          }
          hourlyTotals[hour] += count;
        }
      });
    }

    if (data.dailyActivity && data.dailyActivity.length > 0) {
      data.dailyActivity.forEach(({ day, count }: { day: string; count: number }) => {
        const dayIdx = DAYS.indexOf(day);
        if (dayIdx >= 0) {
          dailyTotals[dayIdx] += count;
        }
      });
    }
  });

  // Fallback: use client lastInteractionAt if no heatmapData
  if (heatmapData.length === 0) {
    clients.forEach(client => {
      const hour = client.lastInteractionAt ? new Date(client.lastInteractionAt).getHours() : 0;
      const dayIdx = client.lastInteractionAt ? new Date(client.lastInteractionAt).getDay() : 0;
      const key = `${dayIdx}-${hour}`;
      const cell = grid.get(key);
      if (cell) {
        cell.value += Math.max(1, client.totalInteractions || 1);
        if (client.name && !cell.clients.includes(client.name)) {
          cell.clients.push(client.name);
        }
      }
      hourlyTotals[hour] += 1;
      dailyTotals[dayIdx] += 1;
    });
  }

  const gridArray = Array.from(grid.values());
  const maxValue = Math.max(1, ...gridArray.map(c => c.value));
  const totalActivity = gridArray.reduce((sum, c) => sum + c.value, 0);
  
  const peakHourIdx = hourlyTotals.indexOf(Math.max(...hourlyTotals));
  const peakDayIdx = dailyTotals.indexOf(Math.max(...dailyTotals));
  
  const now = new Date();
  const currentHour = now.getHours();
  const activeNow = clients.filter(c => {
    if (!c.lastInteractionAt) return false;
    const lastActivity = new Date(c.lastInteractionAt);
    const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 1;
  }).length;

  return {
    grid: gridArray,
    maxValue,
    hourlyTotals,
    dailyTotals,
    totalActivity,
    peakHour: peakHourIdx,
    peakDay: DAYS[peakDayIdx],
    activeNow,
    currentHour
  };
}

export function RealTimeHeatmap({ clients, heatmapData }: RealTimeHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  const heatmap = useMemo(() => generateAggregatedHeatmap(clients, heatmapData), [clients, heatmapData]);

  // Calcular las últimas 6 horas de forma inteligente
  const now = new Date();
  const currentHour = now.getHours();
  const last6Hours = Array.from({ length: 6 }, (_, i) => {
    // Va hacia atrás desde la hora actual, manejando el cambio de día
    let hour = currentHour - (5 - i);
    if (hour < 0) hour += 24;
    return hour;
  });

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="sm:px-6 px-4 py-5 border-b border-[var(--border-light)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500" />
              Mapa de Calor - Últimas 6 Horas
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Actividad inteligente en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Actividad Total</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{heatmap.totalActivity.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Activos ahora</p>
              <p className="text-xl font-bold text-teal-500">{heatmap.activeNow}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Pico</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{formatHour(heatmap.peakHour)} - {heatmap.peakDay}</p>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-[var(--text-muted)]">Baja</span>
          <div className="flex gap-0.5">
            {['bg-gray-50', 'bg-teal-50', 'bg-teal-100', 'bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-teal-500', 'bg-teal-600'].map(color => (
              <div key={color} className={`w-5 h-3 ${color} rounded-sm`} />
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)]">Alta</span>
        </div>
      </div>

      {/* Grid - Solo últimas 6 horas */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Day headers */}
          <div className="flex mb-2">
            <div className="w-20 shrink-0" />
            {DAYS.map(day => (
              <div key={day} className="flex-1 text-center">
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{day}</span>
              </div>
            ))}
          </div>

          {/* Hour rows - Solo últimas 6 horas */}
          <div className="space-y-0.5">
            {last6Hours.map(hour => {
              const rowTotal = heatmap.hourlyTotals[hour];
              const isPeakHour = hour === heatmap.peakHour;
              const isCurrentHour = hour === heatmap.currentHour;

              return (
                <div key={hour} className="flex items-center gap-1">
                  <div className={`w-20 shrink-0 text-right pr-3 ${isCurrentHour ? 'font-bold text-teal-600' : ''}`}>
                    <span className="text-xs text-[var(--text-secondary)]">{formatHour(hour)}</span>
                    {rowTotal > 0 && (
                      <span className="text-[10px] text-[var(--text-muted)] ml-1">({rowTotal})</span>
                    )}
                  </div>

                  {DAYS.map((_, dayIdx) => {
                    const cell = heatmap.grid.find(c => c.hour === hour && c.day === dayIdx);
                    if (!cell) return null;
                    
                    const isSelected = selectedCell?.hour === hour && selectedCell?.day === dayIdx;

                    return (
                      <div key={`${hour}-${dayIdx}`} className="flex-1">
                        <div
                          onMouseEnter={() => setSelectedCell(cell)}
                          onMouseLeave={() => setSelectedCell(null)}
                          className={`
                            h-8 rounded-md cursor-pointer relative
                            transition-all duration-150 ease-in-out
                            ${getIntensityColor(cell.value, heatmap.maxValue)}
                            ${getTextColor(cell.value, heatmap.maxValue)}
                            ${isSelected ? 'ring-2 ring-teal-400 scale-105 z-10' : ''}
                            ${isPeakHour && cell.value > 0 ? 'ring-1 ring-amber-300' : ''}
                            hover:ring-2 hover:ring-teal-300 hover:scale-105 hover:z-10
                          `}
                        >
                          {isSelected && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20">
                              <div className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap border border-[var(--border-color)]">
                                <p className="font-semibold">{formatHour(hour)} - {DAYS[dayIdx]}</p>
                                <p className="text-teal-400">{cell.value} interacciones</p>
                                {cell.clients.length > 0 && (
                                  <p className="text-[var(--text-muted)]">{cell.clients.length} clientes</p>
                                )}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--bg-tertiary)]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

              {/* Totals row */}
          <div className="flex mt-3 pt-3 border-t border-[var(--border-color)]">
            <div className="w-20 shrink-0" />
            {DAYS.map((day, idx) => (
              <div key={day} className="flex-1 text-center">
                <span className={`text-xs font-semibold ${heatmap.dailyTotals[idx] === Math.max(...heatmap.dailyTotals) ? 'text-teal-600' : 'text-[var(--text-secondary)]'}`}>
                  {heatmap.dailyTotals[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--border-color)] border-t border-[var(--border-color)]">
        <div className="sm:px-6 px-3 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-teal-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Pico Hoy</span>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)]">{formatHour(heatmap.peakHour)}</p>
        </div>
        <div className="sm:px-6 px-3 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Día Pico</span>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)]">{heatmap.peakDay}</p>
        </div>
        <div className="sm:px-6 px-3 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-500 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Clientes</span>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)]">{clients.length}</p>
        </div>
        <div className="sm:px-6 px-3 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-green-500 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Promedio/h</span>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {Math.round(heatmap.totalActivity / Math.max(1, 6))}
          </p>
        </div>
      </div>
    </div>
  );
}