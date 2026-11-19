'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp, MapPin, Home, ChevronRight, RefreshCw, BarChart3, Shield, Building2,
  DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Clock, Layers, LandPlot, FolderGit, X, ChevronDown, Search
} from 'lucide-react';
import { publicApiClient } from '@/infrastructure/api/axios-client';

interface ViviendaIndex { metadata: any; kpis: any; variation: any; districts: any[]; trend: any[]; }
interface LoteIndex { totalCount: number; avgM2Terreno: number; avgTotalPrice: number; avgTotalArea: number; districts: any[]; trend: any[]; variation: any; }
interface ProyectoIndex { totalProjects: number; avgPriceFrom: number; totalAvailable: number; avgAreaFrom: number; projects: any[]; phaseBreakdown: any[]; districtBreakdown: any[]; }
type Vertical = 'viviendas' | 'departamentos' | 'lotes' | 'proyectos';

const formatPrice = (p: number) => !p ? 'S/ 0' : 'S/ ' + Math.round(p).toLocaleString('es-PE');
const formatM2 = (v: number) => !v ? 'S/ 0' : 'S/ ' + Math.round(v).toLocaleString('es-PE');
const formatCompact = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n >= 1_000 ? (n / 1_000).toFixed(1) + 'K' : n.toLocaleString('es-PE');
const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'];

export default function PricePerM2Page() {
  const [vertical, setVertical] = useState<Vertical>('viviendas');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [txType, setTxType] = useState('SALE');
  const [propType, setPropType] = useState('');
  const [locationText, setLocationText] = useState('');
  const [projPhase, setProjPhase] = useState('');
  const [periodMonths, setPeriodMonths] = useState<number | undefined>(undefined);

  const [viviendaData, setViviendaData] = useState<ViviendaIndex | null>(null);
  const [loteData, setLoteData] = useState<LoteIndex | null>(null);
  const [proyectoData, setProyectoData] = useState<ProyectoIndex | null>(null);
  const [tooltipPt, setTooltipPt] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Sugerencias de ubicación
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const suggestRef = useRef<HTMLDivElement>(null);

  // Cargar todas las ubicaciones disponibles
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [regRes, provRes, distRes] = await Promise.all([
          publicApiClient.get<string[]>('/analytics/locations/regions'),
          publicApiClient.get<string[]>('/analytics/locations/provinces'),
          publicApiClient.get<string[]>('/analytics/locations/districts'),
        ]);
        const all = [...new Set([
          ...regRes.data,
          ...provRes.data,
          ...distRes.data,
        ])].sort();
        setAllLocations(all);
      } catch {}
    };
    fetchLocations();
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filtrar sugerencias mientras escribe
  const filteredSuggestions = useMemo(() => {
    if (!locationText) return [];
    return allLocations.filter(l => l.toLowerCase().includes(locationText.toLowerCase())).slice(0, 10);
  }, [allLocations, locationText]);

  // Fetch data on filter change
  useEffect(() => { fetchData(); }, [vertical, txType, propType, locationText, projPhase, periodMonths]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ transactionType: txType });
      if (propType) params.set('propertyType', propType);
      if (locationText) params.set('location', locationText);
      if (periodMonths !== undefined) params.set('periodMonths', String(periodMonths));

      if (vertical === 'viviendas' || vertical === 'departamentos') {
        if (vertical === 'departamentos') params.set('propertyType', 'APARTMENT');
        const res = await publicApiClient.get<ViviendaIndex>(`/analytics/index/viviendas?${params}`);
        setViviendaData(res.data);
      } else if (vertical === 'lotes') {
        const res = await publicApiClient.get<LoteIndex>(`/analytics/index/lotes?${params}`);
        setLoteData(res.data);
      } else {
        const params = new URLSearchParams();
        if (locationText) params.set('location', locationText);
        if (projPhase) params.set('phase', projPhase);
        const res = await publicApiClient.get<ProyectoIndex>(`/analytics/index/proyectos?${params}`);
        setProyectoData(res.data);
      }
      setLastUpdated(new Date().toLocaleString('es-PE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }));
    } catch { console.error('Error fetching index'); }
    finally { setLoading(false); }
  }, [vertical, txType, propType, locationText, projPhase, periodMonths]);

  const chartTrend = useMemo(() => {
    if ((vertical === 'viviendas' || vertical === 'departamentos') && viviendaData) return viviendaData.trend.filter((p: any) => p.medianM2 !== null);
    if (vertical === 'lotes' && loteData) return loteData.trend.filter((p: any) => p.medianM2 !== null);
    return [];
  }, [vertical, viviendaData, loteData]);

  const chartW = 700, chartH = 200, pad = { top: 15, right: 15, bottom: 30, left: 55 };
  const chartMax = useMemo(() => chartTrend.length > 0 ? Math.max(...chartTrend.map((p: any) => p.medianM2 as number)) * 1.15 : 1000, [chartTrend]);
  const chartMin = useMemo(() => chartTrend.length > 0 ? Math.min(...chartTrend.map((p: any) => p.medianM2 as number)) * 0.85 : 0, [chartTrend]);
  const xS = (i: number) => pad.left + (i / Math.max(chartTrend.length - 1, 1)) * (chartW - pad.left - pad.right);
  const yS = (v: number) => pad.top + chartH - pad.top - pad.bottom - ((v - chartMin) / (chartMax - chartMin)) * (chartH - pad.top - pad.bottom);

  if (loading && !viviendaData && !loteData && !proyectoData) {
    return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><div className="text-center space-y-4"><div className="w-10 h-10 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-[var(--text-muted)] text-sm">Cargando indice...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase"><BarChart3 className="w-3 h-3" />Datos del Portal</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">Indice Tiyuy</h1>
              <p className="text-[var(--text-secondary)] text-base max-w-2xl">Precio por metro cuadrado, lotes y proyectos. Datos agregados del inventario de Tiyuy.</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Clock className="w-3 h-3" />{lastUpdated}</span>}
              <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--brand-primary)]/80 shadow-sm"><RefreshCw className="w-4 h-4" />Actualizar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { k: 'viviendas' as Vertical, l: 'Casas y Dptos', i: <Home className="w-4 h-4" /> },
            { k: 'departamentos' as Vertical, l: 'Departamentos', i: <Building2 className="w-4 h-4" /> },
            { k: 'lotes' as Vertical, l: 'Lotes y Terrenos', i: <LandPlot className="w-4 h-4" /> },
            { k: 'proyectos' as Vertical, l: 'Proyectos', i: <FolderGit className="w-4 h-4" /> },
          ].map(v => (
            <button key={v.k} onClick={() => setVertical(v.k)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all flex-shrink-0 cursor-pointer ${vertical === v.k ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]'}`}>{v.i}{v.l}</button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5">
          <div className="flex flex-wrap items-end gap-4">
            {/* Operacion */}
            <div>
              <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1.5">Operacion</label>
              <div className="flex gap-1.5">
                {['SALE','RENT'].map(op => (
                  <button key={op} onClick={() => setTxType(op)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${txType === op ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>{op === 'SALE' ? 'Venta' : 'Alquiler'}</button>
                ))}
              </div>
            </div>

            {/* Tipo */}
            {vertical === 'viviendas' && (
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1.5">Tipo</label>
                <div className="flex gap-1.5">
                  {[{v:'',l:'Todos'},{v:'APARTMENT',l:'Dptos'},{v:'HOUSE',l:'Casas'}].map(t => (
                    <button key={t.v} onClick={() => setPropType(t.v)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${propType === t.v ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>{t.l}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Ubicación - BÚSQUEDA LIBRE */}
            <div className="relative min-w-[200px]" ref={suggestRef}>
              <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1.5">Ciudad / Distrito</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input type="text" value={locationText} placeholder="Ej: Lima, Miraflores, San Isidro..."
                  onChange={e => { setLocationText(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-8 pr-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-[var(--text-primary)]" />
                {locationText && (
                  <button onClick={() => { setLocationText(''); setShowSuggestions(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map(s => (
                    <button key={s} onClick={() => { setLocationText(s); setShowSuggestions(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">{s}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Periodo */}
            <div>
              <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1.5">Periodo</label>
              <div className="flex gap-1.5">
                {[{v:undefined,l:'Todo'},{v:1,l:'1m'},{v:3,l:'3m'},{v:6,l:'6m'},{v:12,l:'1a'},{v:24,l:'2a'},{v:60,l:'5a'}].map(t => (
                  <button key={String(t.v)} onClick={() => setPeriodMonths(t.v)}
                    className={`px-2.5 py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${periodMonths === t.v ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>{t.l}</button>
                ))}
              </div>
            </div>

            {/* Etapa (solo proyectos) */}
            {vertical === 'proyectos' && (
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1.5">Etapa</label>
                <div className="flex gap-1.5">
                  {[{v:'',l:'Todas'},{v:'PRE_SALE',l:'Preventa'},{v:'CONSTRUCTION',l:'Construccion'},{v:'DELIVERY',l:'Entrega'},{v:'COMPLETED',l:'Entregado'}].map(t => (
                    <button key={t.v} onClick={() => setProjPhase(t.v)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${projPhase === t.v ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>{t.l}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Views */}
        {(vertical === 'viviendas' || vertical === 'departamentos') && viviendaData && <ViviendaView data={viviendaData} trend={chartTrend} chartMax={chartMax} chartMin={chartMin} xS={xS} yS={yS} tooltipPt={tooltipPt} setTooltipPt={setTooltipPt} tooltipPos={tooltipPos} setTooltipPos={setTooltipPos} locationText={locationText} txType={txType} />}
        {vertical === 'lotes' && loteData && <LoteView data={loteData} trend={chartTrend} chartMax={chartMax} chartMin={chartMin} xS={xS} yS={yS} tooltipPt={tooltipPt} setTooltipPt={setTooltipPt} tooltipPos={tooltipPos} setTooltipPos={setTooltipPos} />}
        {vertical === 'proyectos' && proyectoData && <ProyectoView data={proyectoData} />}

        <div className="text-center py-6 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-muted)]">Datos calculados con informacion agregada del inventario de Tiyuy. Los valores se actualizan en cada consulta.</p>
        </div>
      </div>
    </div>
  );
}

// ─── VIVIENDA VIEW ───
function ViviendaView({ data, trend, chartMax, chartMin, xS, yS, tooltipPt, setTooltipPt, tooltipPos, setTooltipPos, locationText: loc, txType: tx }: any) {
  const { kpis, variation, districts } = data;
  const medianPrice = kpis?.medianPriceM2 || 0;
  const monthlyChange = variation?.monthlyChangePct;
  const yearlyChange = variation?.yearlyChangePct;
  const sampleCount = kpis?.sampleCount || 0;
  const avgPrice = kpis?.avgPriceM2 || 0;

  // Generate insight text
  const buildInsight = () => {
    const direction = monthlyChange != null ? (monthlyChange > 0 ? 'sube' : monthlyChange < 0 ? 'baja' : 'se mantiene') : 'se mantiene';
    const monthlyAbs = monthlyChange != null ? Math.abs(monthlyChange).toFixed(1) : '0.0';
    const yearlyAbs = yearlyChange != null ? Math.abs(yearlyChange).toFixed(1) : '0.0';
    const yearlyDir = yearlyChange != null ? (yearlyChange > 0 ? 'sube' : 'baja') : 'se mantiene';
    return `El precio medio ${direction} ${monthlyAbs}% este mes y se ubica en ${formatM2(medianPrice)}. En el año, ${yearlyDir} ${yearlyAbs}%. Muestra de ${sampleCount} propiedades en el periodo seleccionado.`;
  };

  return (
    <div className="space-y-6">
      {/* Insight header like Urbania */}
      {medianPrice > 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Indice Tiyuy · {loc || 'Nacional'}</h2>
                <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-md">
                  {tx === 'SALE' ? 'Venta' : 'Alquiler'}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                {buildInsight()}
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                <div>
                  <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Mediana</span>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{formatM2(medianPrice)}</p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Variacion mensual</span>
                  <p className={`text-xl font-bold ${monthlyChange != null && monthlyChange > 0 ? 'text-[var(--brand-primary)]' : monthlyChange != null && monthlyChange < 0 ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
                    {monthlyChange != null ? `${monthlyChange > 0 ? '+' : ''}${monthlyChange.toFixed(1)}%` : '--'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Muestra</span>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{sampleCount}</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-[var(--brand-primary-light)] rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Mediana m2" value={formatM2(kpis.medianPriceM2)} icon={<TrendingUp className="w-4 h-4" />}
          subtitle={variation.monthlyChangePct !== null ? (
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${variation.monthlyChangePct > 0 ? 'text-[var(--brand-primary)]' : 'text-red-600'}`}>
              {variation.monthlyChangePct > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(variation.monthlyChangePct).toFixed(1)}% vs mes ant.
            </span>
          ) : <span className="text-xs text-[var(--text-muted)]">Sin variacion</span>} />
        <KpiCard label="Promedio m2" value={formatM2(kpis.avgPriceM2)} icon={<Building2 className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Media aritmetica</span>} />
        <KpiCard label="Variacion anual" value={variation.yearlyChangePct !== null ? (
          <span className={`inline-flex items-center gap-1 ${variation.yearlyChangePct > 0 ? 'text-[var(--brand-primary)]' : variation.yearlyChangePct < 0 ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
            {variation.yearlyChangePct > 0 ? '+' : ''}{variation.yearlyChangePct?.toFixed(1)}%
          </span>
        ) : <span className="text-[var(--text-muted)] text-base">--</span>} icon={<Calendar className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">vs mismo mes ano anterior</span>} />
        <KpiCard label="Muestra" value={formatCompact(kpis.sampleCount)} icon={<BarChart3 className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Rango: {formatM2(kpis.minPriceM2)} - {formatM2(kpis.maxPriceM2)}</span>} />
      </div>
      <ChartSection title="Tendencia mensual" subtitle="Precio mediano por m2" data={trend} chartMax={chartMax} chartMin={chartMin} xS={xS} yS={yS} tooltipPt={tooltipPt} setTooltipPt={setTooltipPt} tooltipPos={tooltipPos} setTooltipPos={setTooltipPos} />
      <RankingTable title="Ranking de distritos" subtitle="Ordenado de mayor a menor precio mediano por m2"
        headers={['#','Distrito','Mediana m2','Promedio m2','Muestras','Precio prom.','Area prom.']}
        rows={districts.map((d: any, idx: number) => [idx + 1, d.district, formatM2(d.medianM2), formatM2(d.avgM2), d.sampleCount, formatPrice(d.avgTotalPrice), Math.round(d.avgBuiltArea) + ' m2'])} />
    </div>
  );
}

function LoteView({ data, trend, chartMax, chartMin, xS, yS, tooltipPt, setTooltipPt, tooltipPos, setTooltipPos }: any) {
  const { totalCount, avgM2Terreno, avgTotalPrice, avgTotalArea, districts, variation } = data;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Precio m2 terr." value={formatM2(avgM2Terreno)} icon={<LandPlot className="w-4 h-4" />}
          subtitle={variation.monthlyChangePct !== null ? (
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${variation.monthlyChangePct > 0 ? 'text-[var(--brand-primary)]' : 'text-red-600'}`}>
              {variation.monthlyChangePct > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(variation.monthlyChangePct).toFixed(1)}% vs mes ant.
            </span>
          ) : <span className="text-xs text-[var(--text-muted)]">Sin variacion</span>} />
        <KpiCard label="Ticket prom." value={formatPrice(avgTotalPrice)} icon={<DollarSign className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Precio total promedio</span>} />
        <KpiCard label="Area prom." value={Math.round(avgTotalArea) + ' m2'} icon={<Layers className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Area de terreno promedio</span>} />
        <KpiCard label="Total" value={formatCompact(totalCount)} icon={<BarChart3 className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">{districts.length} distritos</span>} />
      </div>
      <ChartSection title="Tendencia mensual" subtitle="Precio mediano por m2 de terreno" data={trend} chartMax={chartMax} chartMin={chartMin} xS={xS} yS={yS} tooltipPt={tooltipPt} setTooltipPt={setTooltipPt} tooltipPos={tooltipPos} setTooltipPos={setTooltipPos} />
      <RankingTable title="Ranking de distritos" subtitle="Precio por m2 de terreno"
        headers={['#','Distrito','Mediana m2 terr.','Promedio m2 terr.','Muestras','Precio prom.','Area prom.']}
        rows={districts.map((d: any, idx: number) => [idx + 1, d.district, formatM2(d.medianM2Terreno), formatM2(d.avgM2Terreno), d.sampleCount, formatPrice(d.avgTotalPrice), Math.round(d.avgTotalArea) + ' m2'])} />
    </div>
  );
}

function ProyectoView({ data }: any) {
  const { totalProjects, avgPriceFrom, totalAvailable, avgAreaFrom, projects, phaseBreakdown, districtBreakdown } = data;
  const lineColor = '#f97316';
  const gridColor = '#f1f5f9';
  const textColor = '#94a3b8';
  const [tip, setTip] = useState<{label: string; value: string; x: number; y: number} | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });

  // Build price evolution - use all projects, sorted by id if no createdAt
  const sortedProjects = useMemo(() => {
    const list = [...projects];
    const hasDate = list.some((p: any) => p.createdAt);
    if (hasDate) {
      list.sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    }
    return list;
  }, [projects]);

  // Line chart for price evolution
  const chartW = 820, chartH = 240, pad = { top: 20, right: 20, bottom: 36, left: 64 };
  const prices = sortedProjects.map((p: any) => Number(p.priceFrom));
  const maxPrice = Math.max(...prices, 1);
  const minPrice = Math.min(...prices, 0);
  const priceRange = maxPrice - minPrice || 1;
  const xP = (i: number) => pad.left + (i / Math.max(sortedProjects.length - 1, 1)) * (chartW - pad.left - pad.right);
  const yP = (v: number) => pad.top + chartH - pad.top - pad.bottom - ((v - minPrice) / priceRange) * (chartH - pad.top - pad.bottom);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (sortedProjects.length === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - r.left;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < sortedProjects.length; i++) {
      const d = Math.abs(xP(i) - mx);
      if (d < minDist) { minDist = d; closest = i; }
    }
    setHoveredIdx(closest);
    const p = sortedProjects[closest];
    const d = new Date(p.createdAt);
    const label = `${d.getDate()}/${d.getMonth()+1}`;
    setTip({ label, value: formatPrice(Number(p.priceFrom)), x: 0, y: 0 });
    setTipPos({ x: r.left + xP(closest), y: r.top + yP(Number(p.priceFrom)) });
  };
  const handleLeave = () => { setHoveredIdx(null); setTip(null); };

  const phaseLabels: Record<string, string> = {
    'PRE_SALE': 'Preventa', 'CONSTRUCTION': 'Construccion',
    'DELIVERY': 'Entrega', 'COMPLETED': 'Entregado',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Proyectos" value={totalProjects.toString()} icon={<FolderGit className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Total publicados</span>} />
        <KpiCard label="Precio desde" value={formatPrice(avgPriceFrom)} icon={<DollarSign className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Precio promedio minimo</span>} />
        <KpiCard label="Unidades" value={formatCompact(totalAvailable)} icon={<Home className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Stock disponible</span>} />
        <KpiCard label="Area desde" value={Math.round(avgAreaFrom) + ' m2'} icon={<Layers className="w-4 h-4" />} subtitle={<span className="text-xs text-[var(--text-muted)]">Area promedio minima</span>} />
      </div>

      {/* Line chart: price evolution */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm p-7">
        <div className="flex items-start justify-between mb-7">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Evolución de precios</h3>
            <p className="text-sm text-[var(--text-muted)] font-normal">Precio desde por proyecto publicado</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: lineColor}} />
            <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">Precio</span>
          </div>
        </div>

        {sortedProjects.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-3"><TrendingUp className="w-6 h-6 text-[var(--text-muted)]" /></div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Se necesitan al menos 2 proyectos</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Agrega más proyectos para ver la tendencia</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <svg width={chartW} height={chartH} className="min-w-[820px]"
              onMouseMove={handleMove} onMouseLeave={handleLeave}
              style={{cursor: 'crosshair'}}>
              {[0,0.25,0.5,0.75,1].map(frac => {
                const y = yP(minPrice + priceRange * frac);
                const val = minPrice + priceRange * frac;
                return (
                  <g key={frac}>
                    <line x1={pad.left} y1={y} x2={chartW-pad.right} y2={y} stroke={gridColor} strokeWidth={1} />
                    <text x={pad.left-10} y={y+4} textAnchor="end" className="text-[11px]" fill={textColor}>
                      {val >= 1000 ? 'S/ ' + (val/1000).toFixed(1) + 'k' : formatPrice(val)}
                    </text>
                  </g>
                );
              })}
              <polyline fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                points={sortedProjects.map((p: any, i: number) => `${xP(i)},${yP(Number(p.priceFrom))}`).join(' ')} />
              <path d={sortedProjects.map((p: any, i: number) => `${i===0?'M':'L'}${xP(i)},${yP(Number(p.priceFrom))}`).join(' ') + ` L${xP(sortedProjects.length-1)},${chartH-pad.bottom} L${xP(0)},${chartH-pad.bottom} Z`}
                fill={`url(#projGrad)`} opacity={0.06} />
              <defs><linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lineColor} /><stop offset="100%" stopColor={lineColor} stopOpacity={0} /></linearGradient></defs>
              {hoveredIdx !== null && (
                <line x1={xP(hoveredIdx)} y1={pad.top} x2={xP(hoveredIdx)} y2={chartH-pad.bottom}
                  stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3,3" />
              )}
              {sortedProjects.map((p: any, i: number) => {
                if (i !== hoveredIdx && i !== 0 && i !== sortedProjects.length-1) return null;
                return (
                  <circle key={i} cx={xP(i)} cy={yP(Number(p.priceFrom))}
                    r={i === hoveredIdx ? 6 : 4}
                    fill={i === hoveredIdx ? '#ffffff' : lineColor}
                    stroke={lineColor}
                    strokeWidth={i === hoveredIdx ? 3 : 2}
                    style={{filter: i === hoveredIdx ? 'drop-shadow(0 2px 6px rgba(249,115,22,0.35))' : 'none'}} />
                );
              })}
            </svg>
            {tip && hoveredIdx !== null && (
              <div className="fixed z-50 pointer-events-none"
                style={{ left: tipPos.x, top: tipPos.y - 60, transform: 'translateX(-50%)' }}>
                <div className="bg-[var(--bg-card)] backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[var(--border-color)] px-4 py-3 min-w-[130px]">
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{tip.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: lineColor}} />
                    <span className="text-sm font-bold text-[var(--text-primary)]">{tip.value}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phase breakdown */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm p-7">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Desglose por etapa</h3>
            <p className="text-sm text-[var(--text-muted)]">Proyectos por etapa de desarrollo</p>
          </div>
        </div>
        {phaseBreakdown.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--text-muted)]">No hay datos</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {phaseBreakdown.map((p: any) => (
              <div key={p.phase} className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">{phaseLabels[p.phase] || p.phase}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">{p.count}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatCompact(p.totalUnits)} uds</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <RankingTable title="Proyectos por distrito" subtitle="Distritos con mayor oferta"
        headers={['#','Distrito','Proyectos','Precio desde','Unidades disponibles']}
        rows={districtBreakdown.map((d: any, idx: number) => [idx + 1, d.district, d.count, formatPrice(d.avgPrice), formatCompact(d.totalAvailable)])} />
    </div>
  );
}

function KpiCard({ label, value, icon, subtitle }: any) {
  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 hover:shadow-lg hover:border-[var(--brand-primary-light)] transition-all">
      <div className="flex items-center gap-2 text-[var(--text-muted)] mb-3">{icon}<span className="text-xs font-medium uppercase tracking-wider">{label}</span></div>
      <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-1">{value}</div>
      {subtitle && <div>{subtitle}</div>}
    </div>
  );
}

function ChartSection({ title, subtitle, data, chartMax, chartMin, xS, yS, tooltipPt, setTooltipPt, tooltipPos, setTooltipPos }: any) {
  const chartW = 820, chartH = 240;
  const pad = { top: 20, right: 20, bottom: 36, left: 80 };
  // Local scales with generous left margin to completely avoid Y-label overlap
  const xLocal = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * (chartW - pad.left - pad.right);
  const yLocal = (v: number) => pad.top + chartH - pad.top - pad.bottom - ((v - chartMin) / (chartMax - chartMin)) * (chartH - pad.top - pad.bottom);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [chartMode, setChartMode] = useState<'line' | 'bars'>('line');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - svgRect.left;
    setMouseX(mx);
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const d = Math.abs(xLocal(i) - mx);
      if (d < minDist) { minDist = d; closest = i; }
    }
    setHoveredIdx(closest);
    const pt = data[closest];
    setTooltipPt(pt);
    const r = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: r.left + xLocal(closest), y: r.top + yLocal(pt.medianM2) });
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
    setTooltipPt(null);
  };

  const trendColor = '#0d9488';
  const gridColor = '#f1f5f9';
  const textColor = '#94a3b8';
  const barColors = ['#0d9488','#2563eb','#f97316','#8b5cf6','#ec4899','#14b8a6','#eab308','#6366f1'];

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">{title}</h3>
          <p className="text-sm text-[var(--text-muted)] font-normal">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {data.length > 0 && (
            <>
              <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-0.5">
                <button onClick={() => setChartMode('line')}
                  className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${chartMode === 'line' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                  <TrendingUp className="w-3 h-3 inline mr-1" />Lineal
                </button>
                <button onClick={() => setChartMode('bars')}
                  className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${chartMode === 'bars' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                  <BarChart3 className="w-3 h-3 inline mr-1" />Barras
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: trendColor}} />
                <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">Mediana</span>
              </div>
            </>
          )}
          <div className="w-8 h-8 bg-[var(--brand-primary-light)] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[var(--brand-primary)]" />
          </div>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)]">No hay datos suficientes</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Intenta con otro filtro o período</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2" ref={chartRef}>
          <svg width={chartW} height={chartH} className="min-w-[820px] w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{cursor: 'crosshair'}}>

            {/* Grid horizontal */}
            {[0,0.25,0.5,0.75,1].map((frac) => {
              const y = yLocal(chartMin + (chartMax - chartMin) * frac);
              const val = chartMin + (chartMax - chartMin) * frac;
              return (
                <g key={frac}>
                  <line x1={pad.left} y1={y} x2={chartW-pad.right} y2={y} stroke={gridColor} strokeWidth={1} />
                  <text x={pad.left-12} y={y+4} textAnchor="end" className="text-[11px]" fill={textColor} style={{fontFamily:'system-ui'}}>
                    {val >= 1000 ? 'S/ ' + (val/1000).toFixed(1) + 'k' : 'S/ ' + Math.round(val).toLocaleString('es-PE')}
                  </text>
                </g>
              );
            })}

            {chartMode === 'line' && (
              <>
                <path d={data.map((p: any,i: number)=>`${i===0?'M':'L'}${xLocal(i)},${yLocal(p.medianM2)}`).join(' ')}
                  fill="none" stroke={trendColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                <path d={data.map((p: any,i: number)=>`${i===0?'M':'L'}${xLocal(i)},${yLocal(p.medianM2)}`).join(' ')+` L${xLocal(data.length-1)},${chartH-pad.bottom} L${xLocal(0)},${chartH-pad.bottom} Z`}
                  fill={`url(#gradChart)`} opacity={0.08} />
                <defs><linearGradient id="gradChart" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={trendColor} /><stop offset="100%" stopColor={trendColor} stopOpacity={0} /></linearGradient></defs>
                {hoveredIdx !== null && (
                  <line x1={xLocal(hoveredIdx)} y1={pad.top} x2={xLocal(hoveredIdx)} y2={chartH-pad.bottom}
                    stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4,3" />
                )}
                {data.map((p: any,i: number)=>{
                  const isHovered = i === hoveredIdx;
                  const isExtreme = i === 0 || i === data.length - 1;
                  if (!isHovered && !isExtreme) return null;
                  return (
                    <circle key={i} cx={xLocal(i)} cy={yLocal(p.medianM2)}
                      r={isHovered ? 5 : 3.5} fill={isHovered ? '#ffffff' : trendColor}
                      stroke={trendColor} strokeWidth={isHovered ? 2.5 : 2}
                      style={{filter: isHovered ? 'drop-shadow(0 1px 3px rgba(13,148,136,0.3))' : 'none'}} />
                  );
                })}
              </>
            )}

            {chartMode === 'bars' && data.map((p: any, i: number) => {
              const maxBarW = Math.min(46, (chartW - pad.left - 20) / Math.max(data.length, 1) * 0.55);
              const barW = Math.max(8, maxBarW);
              const cx = xLocal(i);
              const x = cx - barW / 2;
              const y = yLocal(p.medianM2);
              const h = Math.max(1, chartH - pad.bottom - y);
              const c = barColors[i % barColors.length];
              const isHovered = hoveredIdx === i;
              return (
                <g key={`bar-${i}`}>
                  <rect x={x} y={y} width={barW} height={h} rx={3}
                    fill={c} opacity={isHovered ? 1 : 0.7}
                    style={{filter: isHovered ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'none'}}
                    className="transition-all duration-150 cursor-pointer" />
                </g>
              );
            })}

            {/* Eje X - fechas */}
            {data.filter((_:any,i:number)=>i%Math.max(1,Math.floor(data.length/8))===0).map((p:any)=>{
              const idx = data.indexOf(p);
              return (
                <text key={idx} x={xLocal(idx)} y={chartH-8} textAnchor="middle" className="text-[10px]" fill={textColor}
                  style={{fontFamily:'system-ui', fontWeight: 400}}>
                  {monthNames[p.month-1]} {p.year.toString().slice(-2)}
                </text>
              );
            })}
          </svg>

          {/* Tooltip premium */}
          {tooltipPt && hoveredIdx !== null && (
            <div className="fixed z-50 pointer-events-none"
              style={{left: tooltipPos.x, top: tooltipPos.y - 72, transform: 'translateX(-50%)'}}>
              <div className="bg-[var(--bg-card)] backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[var(--border-color)] px-4 py-3 min-w-[140px]">
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  {monthNames[tooltipPt.month-1]} {tooltipPt.year}
                </p>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: trendColor}} />
                  <span className="text-[11px] text-[var(--text-muted)]">Mediana</span>
                  <span className="text-sm font-bold text-[var(--text-primary)] ml-auto">{formatM2(tooltipPt.medianM2??0)}</span>
                </div>
                <div className="flex items-center gap-2.5 pt-1.5 border-t border-[var(--border-light)]">
                  <span className="text-[10px] text-[var(--text-muted)]">Muestras</span>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] ml-auto">{tooltipPt.count}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RankingTable({ title, subtitle, headers, rows }: any) {
  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5">
      <div className="mb-4"><h3 className="font-bold text-[var(--text-primary)]">{title}</h3><p className="text-sm text-[var(--text-muted)]">{subtitle}</p></div>
      {rows.length === 0 ? (
        <div className="text-center py-8"><BarChart3 className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" /><p className="text-sm text-[var(--text-muted)]">No hay datos suficientes</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border-color)]">{headers.map((h: any,i: number)=><th key={i} className={`py-3 px-3 font-semibold text-[var(--text-primary)] text-xs uppercase tracking-wider ${i===0||i===1?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((row: any,idx: number)=>{
                const intensity = 1-(idx/Math.max(rows.length-1,1));
                return (
                  <tr key={idx} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    style={{backgroundColor:`rgb(${Math.round(220-intensity*100)},${Math.round(240-intensity*60)},${Math.round(220-intensity*80)})`}}>
                    {row.map((cell: any,i: number)=><td key={i} className={`py-3 px-3 ${i===0?'text-[var(--text-muted)] font-medium':i===1?'font-semibold text-[var(--text-primary)]':i===2?'font-bold text-[var(--text-primary)] text-right':'text-[var(--text-secondary)] text-right'}`}>{cell}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
