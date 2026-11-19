'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Home, Eye, Heart, Phone, BarChart3,
  Activity, Zap, ChevronRight, RefreshCw, ArrowUpRight,
  ArrowDownRight, Building2, LandPlot, FolderGit,
  Clock, Layers, DollarSign, Search, Users, Info, Filter,
  X, ChevronDown, Loader
} from 'lucide-react';
import { publicApiClient } from '@/infrastructure/api/axios-client';

interface HotDistrict { district: string; totalViews: number; totalFavorites: number; totalContacts: number; listingCount: number; heatScore: number; }
interface DistrictTrend { district: string; avgPrice: number; changePct: number; }
interface NewPropertyInsight { label: string; count: number; }
interface GeneralRadar { totalPublished: number; avgPrice: number; totalViews: number; totalFavorites: number; totalContacts: number; totalProjects: number; hotDistricts: HotDistrict[]; topRisers: DistrictTrend[]; newByType: NewPropertyInsight[]; }
interface NewInventoryDistrict { district: string; newListings: number; avgPrice: number; totalViews: number; }
interface OpportunityDistrict { district: string; belowMedianCount: number; medianPrice: number; }
interface HighlightProperty { id: number; price: number; district: string; bedrooms: number; type: string; title: string; }
interface ViviendaRadar { totalPublished: number; totalViews: number; totalFavorites: number; totalContacts: number; avgViewsPerListing: number; avgFavsPerListing: number; avgContactsPerListing: number; topRisers: DistrictTrend[]; newListings: NewInventoryDistrict[]; hotDistricts: HotDistrict[]; opportunities: OpportunityDistrict[]; weeklyHighlights: HighlightProperty[]; }
interface PhaseRadarData { phase: string; count: number; totalAvailable: number; totalViews: number; }
interface ProyectoHotDistrict { district: string; totalViews: number; totalContacts: number; projectCount: number; totalAvailable: number; heatScore: number; }
interface RecentProyecto { id: number; name: string; district: string; priceFrom: number; availableUnits: number; totalUnits: number; phase: string; viewsCount: number; contactsCount: number; }
interface ProyectoRadar { totalProjects: number; newProjects: number; totalAvailable: number; avgPriceFrom: number; phases: PhaseRadarData[]; hotDistricts: ProyectoHotDistrict[]; recent: RecentProyecto[]; }
interface NewLandDistrict { district: string; newListings: number; avgM2Terreno: number; totalViews: number; }
interface LandHotDistrict { district: string; totalViews: number; totalFavorites: number; totalContacts: number; listingCount: number; heatScore: number; }
interface LoteRadar { totalLotes: number; avgM2Terreno: number; avgTotalPrice: number; avgTotalArea: number; newListings: NewLandDistrict[]; hotDistricts: LandHotDistrict[]; }

type Vertical = 'general' | 'viviendas' | 'proyectos' | 'lotes';
type MetricKey = 'precio' | 'nuevos' | 'vistas' | 'favoritos' | 'contactos' | 'heat';

const formatPrice = (p: number) => !p ? 'S/ 0' : 'S/ ' + Math.round(p).toLocaleString('es-PE');
const formatCompact = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n >= 1_000 ? (n / 1_000).toFixed(1) + 'K' : n.toLocaleString('es-PE');
const propertyLabel = (t: string) => ({ APARTMENT: 'Departamento', HOUSE: 'Casa', LAND: 'Terreno', OFFICE: 'Oficina', COMMERCIAL: 'Local', ROOM: 'Habitacion' }[t] || t);
const phaseLabel = (p: string) => ({ PRE_SALE: 'Preventa', CONSTRUCTION: 'Construccion', DELIVERY: 'Entrega inmediata', COMPLETED: 'Entregado' }[p] || p);

const chartW = 720; const chartH = 260;
const padding = { top: 20, right: 20, bottom: 30, left: 55 };

const METRICS_BY_VERTICAL: Record<Vertical, MetricKey[]> = {
  general: ['precio', 'nuevos', 'vistas', 'favoritos', 'contactos'],
  viviendas: ['precio', 'nuevos', 'vistas', 'favoritos', 'contactos', 'heat'],
  proyectos: ['nuevos', 'vistas', 'contactos'],
  lotes: ['precio', 'nuevos', 'vistas', 'favoritos', 'contactos', 'heat'],
};
const METRIC_LABELS: Record<MetricKey, string> = {
  precio: 'Precio mediano', nuevos: 'Nuevos avisos', vistas: 'Vistas totales',
  favoritos: 'Favoritos', contactos: 'Contactos', heat: 'Heat score',
};
const METRIC_ICONS: Record<MetricKey, React.ReactNode> = {
  precio: <TrendingUp className="w-4 h-4" />, nuevos: <Activity className="w-4 h-4" />,
  vistas: <Eye className="w-4 h-4" />, favoritos: <Heart className="w-4 h-4" />,
  contactos: <Phone className="w-4 h-4" />, heat: <Zap className="w-4 h-4" />,
};

export default function MarketRadarPage() {
  const [vertical, setVertical] = useState<Vertical>('general');
  const [metric, setMetric] = useState<MetricKey>('precio');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showMethodology, setShowMethodology] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [operation, setOperation] = useState('SALE');
  const [topN, setTopN] = useState(10);
  const [region, setRegion] = useState('');
  const [regionLabel, setRegionLabel] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [province, setProvince] = useState('');
  const [provinceLabel, setProvinceLabel] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [districtLabel, setDistrictLabel] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const regionRef = useRef<HTMLDivElement>(null);
  const provinceRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);
  const [general, setGeneral] = useState<GeneralRadar | null>(null);
  const [viviendas, setViviendas] = useState<ViviendaRadar | null>(null);
  const [proyectos, setProyectos] = useState<ProyectoRadar | null>(null);
  const [lotes, setLotes] = useState<LoteRadar | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; value: string; x: number; y: number } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<'line' | 'bars'>('line');

  const filteredRegions = useMemo(() => {
    if (!regionSearch) return regions;
    return regions.filter(r => r.toLowerCase().includes(regionSearch.toLowerCase()));
  }, [regions, regionSearch]);

  const filteredProvinces = useMemo(() => {
    if (!provinceSearch) return provinces;
    return provinces.filter(p => p.toLowerCase().includes(provinceSearch.toLowerCase()));
  }, [provinces, provinceSearch]);

  const filteredDistricts = useMemo(() => {
    if (!districtSearch) return districts;
    return districts.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()));
  }, [districts, districtSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setShowRegionDropdown(false);
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) setShowProvinceDropdown(false);
      if (districtRef.current && !districtRef.current.contains(e.target as Node)) setShowDistrictDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { fetchRadar(); fetchRegions(); }, []);
  useEffect(() => { if (!loading) { setChartLoading(true); fetchRadar().finally(() => setChartLoading(false)); } }, [operation]);

  const fetchRegions = async () => {
    try { const res = await publicApiClient.get<string[]>('/analytics/locations/regions'); setRegions(res.data); } catch {}
  };

  const fetchRadar = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { transactionType: operation, topN };
      if (region) params.region = region;
      if (province) params.province = province;
      if (district) params.district = district;
      const [g, v, p, l] = await Promise.all([
        publicApiClient.get<GeneralRadar>('/analytics/market-radar/general', { params }),
        publicApiClient.get<ViviendaRadar>('/analytics/market-radar/viviendas', { params }),
        publicApiClient.get<ProyectoRadar>('/analytics/market-radar/proyectos', { params: { region: region || undefined, province: province || undefined, district: district || undefined } }),
        publicApiClient.get<LoteRadar>('/analytics/market-radar/lotes', { params }),
      ]);
      setGeneral(g.data); setViviendas(v.data); setProyectos(p.data); setLotes(l.data);
      setLastUpdated(new Date().toLocaleString('es-PE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }));
    } catch { console.error('Error fetching market radar'); }
    finally { setLoading(false); }
  }, [operation, region, province, district, topN]);

  useEffect(() => {
    const available = METRICS_BY_VERTICAL[vertical];
    if (!available.includes(metric)) setMetric(available[0]);
  }, [vertical]);

  const trendData = useMemo(() => {
    if (vertical === 'general' && general) {
      return general.hotDistricts.slice(0, Math.min(topN, general.hotDistricts.length)).map((d, i) => ({
        label: d.district, value: Number(metric === 'vistas' ? (d.totalViews || 0) : metric === 'favoritos' ? (d.totalFavorites || 0) : metric === 'contactos' ? (d.totalContacts || 0) : (d.listingCount || 0)), x: i
      }));
    }
    if (vertical === 'viviendas' && viviendas) {
      const items = metric === 'nuevos' ? viviendas.newListings : metric === 'heat' ? viviendas.hotDistricts : metric === 'favoritos' ? viviendas.hotDistricts : metric === 'contactos' ? viviendas.hotDistricts : viviendas.topRisers;
      return items.slice(0, Math.min(topN, items.length)).map((d: any, i: number) => ({
        label: d.district || '', value: Number(d.avgPrice || d.heatScore || d.totalViews || d.totalFavorites || d.totalContacts || d.newListings || 0), x: i
      }));
    }
    if (vertical === 'proyectos' && proyectos) {
      if (metric === 'nuevos') {
        return proyectos.phases.map((d: any, i: number) => ({
          label: phaseLabel(d.phase), value: Number(d.count || 0), x: i
        }));
      }
      return proyectos.hotDistricts.slice(0, Math.min(topN, proyectos.hotDistricts.length)).map((d: any, i: number) => ({
        label: d.district, value: Number(d.heatScore || d.totalViews || d.totalContacts || 0), x: i
      }));
    }
    if (vertical === 'lotes' && lotes) {
      const items = metric === 'nuevos' ? lotes.newListings : lotes.hotDistricts;
      return items.slice(0, Math.min(topN, items.length)).map((d: any, i: number) => ({
        label: d.district, value: Number(d.avgM2Terreno || d.heatScore || d.totalViews || d.newListings || 0), x: i
      }));
    }
    return [];
  }, [vertical, metric, general, viviendas, proyectos, lotes, topN]);

  const chartMax = useMemo(() => {
    if (trendData.length === 0) return 100;
    const max = Math.max(...trendData.map(d => d.value));
    return max > 0 ? max * 1.15 : 100;
  }, [trendData]);

  const xScale = (i: number) => padding.left + (i / Math.max(trendData.length - 1, 1)) * (chartW - padding.left - padding.right);
  const yScale = (v: number) => {
    if (chartMax <= 0 || v <= 0) return chartH - padding.bottom;
    return padding.top + chartH - padding.top - padding.bottom - (v / chartMax) * (chartH - padding.top - padding.bottom);
  };

  // Line chart handler
  const handleChartMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (trendData.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - svgRect.left;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < trendData.length; i++) {
      const d = Math.abs(xScale(i) - mx);
      if (d < minDist) { minDist = d; closest = i; }
    }
    setHoveredPoint(closest);
    const pt = trendData[closest];
    setTooltip({
      label: pt.label,
      value: metric === 'precio' ? formatPrice(pt.value) : metric === 'heat' ? `${pt.value} pts` : formatCompact(pt.value),
      x: e.currentTarget.getBoundingClientRect().left + xScale(closest),
      y: e.currentTarget.getBoundingClientRect().top + yScale(pt.value),
    });
  };
  const handleChartLeave = () => { setHoveredPoint(null); setTooltip(null); };

  if (loading && !general) {
    return <div className="min-h-screen bg-white dark:bg-[var(--bg-primary)] flex items-center justify-center"><div className="text-center space-y-4"><div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-gray-400 dark:text-[var(--text-muted)] text-sm font-medium">Cargando radar...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-secondary)]">
      <div className="bg-white dark:bg-[var(--bg-card)] border-b border-gray-100 dark:border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-brand-light text-brand-dark text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase"><BarChart3 className="w-3.5 h-3.5" />Inteligencia de Mercado</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[var(--text-primary)] tracking-tight">Radar del Mercado</h1>
              <p className="text-gray-500 dark:text-[var(--text-secondary)] text-base max-w-2xl leading-relaxed">Indicadores de precio, oferta, demanda y actividad. Datos agregados del inventario de Tiyuy.</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && <span className="text-xs text-gray-400 dark:text-[var(--text-muted)] flex items-center gap-1"><Clock className="w-3 h-3" />{lastUpdated}</span>}
              <button onClick={fetchRadar} className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark shadow-sm"><RefreshCw className="w-4 h-4" />Actualizar</button>
              <button onClick={() => setShowMethodology(!showMethodology)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[var(--bg-card)] text-gray-700 dark:text-[var(--text-secondary)] text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)]"><Info className="w-4 h-4" />Metodologia</button>
            </div>
          </div>
        </div>
      </div>

      {showMethodology && (
        <div className="bg-gray-50 dark:bg-[var(--bg-secondary)] border-b border-gray-100 dark:border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-6">
              <h3 className="font-bold text-gray-900 dark:text-[var(--text-primary)] mb-3">Metodologia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div><h4 className="font-semibold text-gray-800 dark:text-[var(--text-primary)] mb-1">Fuente de datos</h4><p className="text-gray-500 dark:text-[var(--text-secondary)]">Indicadores calculados de anuncios y proyectos publicados en Tiyuy. Precios de oferta, no de cierre.</p></div>
                <div><h4 className="font-semibold text-gray-800 dark:text-[var(--text-primary)] mb-1">Demanda</h4><p className="text-gray-500 dark:text-[var(--text-secondary)]">Metricas basadas en vistas, favoritos y contactos agregados del portal.</p></div>
                <div><h4 className="font-semibold text-gray-800 dark:text-[var(--text-primary)] mb-1">Muestra minima</h4><p className="text-gray-500 dark:text-[var(--text-secondary)]">Se requiere muestra minima (5+ registros) para asegurar consistencia estadistica.</p></div>
                <div><h4 className="font-semibold text-gray-800 dark:text-[var(--text-primary)] mb-1">Actualizacion</h4><p className="text-gray-500 dark:text-[var(--text-secondary)]">Datos actualizados automaticamente en cada consulta. Cobertura nacional.</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { key: 'general' as Vertical, label: 'General', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'viviendas' as Vertical, label: 'Viviendas', icon: <Home className="w-4 h-4" /> },
            { key: 'proyectos' as Vertical, label: 'Proyectos', icon: <FolderGit className="w-4 h-4" /> },
            { key: 'lotes' as Vertical, label: 'Lotes', icon: <LandPlot className="w-4 h-4" /> },
          ].map(v => (
            <button key={v.key} onClick={() => setVertical(v.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${vertical === v.key ? 'bg-brand text-white shadow-md' : 'bg-white dark:bg-[var(--bg-card)] text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)]'}`}>
              {v.icon}{v.label}
            </button>
          ))}
          <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-[var(--bg-card)] text-gray-600 dark:text-[var(--text-secondary)] border border-gray-200 dark:border-[var(--border-color)] ml-auto"><Filter className="w-4 h-4" />Filtros</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {METRICS_BY_VERTICAL[vertical].map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${metric === m ? 'bg-brand-light text-brand-dark border border-brand-light' : 'bg-white dark:bg-[var(--bg-card)] text-gray-500 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)]'}`}>
                  {METRIC_ICONS[m]}{METRIC_LABELS[m]}
                </button>
              ))}
            </div>

            {/* Premium Line Chart */}
            <div className={`bg-white dark:bg-[var(--bg-card)] rounded-3xl border border-gray-100/80 dark:border-[var(--border-color)] shadow-sm p-7 ${chartLoading ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-7">
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-[var(--text-primary)] tracking-tight">{METRIC_LABELS[metric]}</h3>
                  <p className="text-sm text-gray-400 dark:text-[var(--text-muted)] font-normal">Distribucion por distrito - Top {topN}</p>
                </div>
                <div className="flex items-center gap-3">
                  {chartLoading && <Loader className="w-4 h-4 animate-spin text-brand" />}
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-[var(--bg-tertiary)] rounded-lg p-0.5">
                    <button onClick={() => setChartMode('line')}
                      className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${chartMode === 'line' ? 'bg-white dark:bg-[var(--bg-card)] text-gray-900 dark:text-[var(--text-primary)] shadow-sm' : 'text-gray-400 dark:text-[var(--text-muted)] hover:text-gray-600 dark:hover:text-[var(--text-secondary)]'}`}>
                      <TrendingUp className="w-3 h-3 inline mr-1" />Lineal
                    </button>
                    <button onClick={() => setChartMode('bars')}
                      className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${chartMode === 'bars' ? 'bg-white dark:bg-[var(--bg-card)] text-gray-900 dark:text-[var(--text-primary)] shadow-sm' : 'text-gray-400 dark:text-[var(--text-muted)] hover:text-gray-600 dark:hover:text-[var(--text-secondary)]'}`}>
                      <BarChart3 className="w-3 h-3 inline mr-1" />Barras
                    </button>
                  </div>
                  <select value={topN} onChange={e => setTopN(Number(e.target.value))}
                    className="text-xs bg-gray-50 dark:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)] rounded-lg px-2 py-1.5 cursor-pointer outline-none text-gray-500 dark:text-[var(--text-secondary)]">
                    <option value={5}>Top 5</option><option value={10}>Top 10</option><option value={20}>Top 20</option>
                  </select>
                </div>
              </div>

              {trendData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-3"><BarChart3 className="w-6 h-6 text-gray-200 dark:text-[var(--text-tertiary)]" /></div>
                  <p className="text-sm font-medium text-gray-400 dark:text-[var(--text-secondary)]">No hay datos suficientes</p>
                  <p className="text-xs text-gray-300 dark:text-[var(--text-muted)] mt-1">Intenta con otro filtro o periodo</p>
                </div>
              ) : (
                <div className="overflow-x-auto pb-2">
                  <svg width={720} height={260} className="min-w-[700px]"
                    onMouseMove={handleChartMove}
                    onMouseLeave={handleChartLeave}
                    style={{cursor: 'crosshair'}}>
                    {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                      const y = yScale(chartMax * frac);
                      const val = chartMax * frac;
                      return (
                        <g key={frac}>
                          <line x1={55} y1={y} x2={720-20} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={55-8} y={y+4} textAnchor="end" className="text-[11px]" fill="#94a3b8">
                            {val >= 1_000_000 ? (val / 1_000_000).toFixed(1) + 'M' : val >= 1_000 ? (val / 1_000).toFixed(0) + 'K' : Math.round(val).toString()}
                          </text>
                        </g>
                      );
                    })}

                    {chartMode === 'line' && (
                      <>
                        <polyline fill="none" stroke="#0d9488" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                          points={trendData.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(' ')} />
                        <path d={trendData.map((d, i) => `${i===0?'M':'L'}${xScale(i)},${yScale(d.value)}`).join(' ') + ` L${xScale(trendData.length-1)},${chartH-30} L${xScale(0)},${chartH-30} Z`}
                          fill="url(#radarGrad)" opacity={0.06} />
                        <defs><linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d9488" /><stop offset="100%" stopColor="#0d9488" stopOpacity={0} /></linearGradient></defs>
                        {hoveredPoint !== null && (
                          <line x1={xScale(hoveredPoint)} y1={20} x2={xScale(hoveredPoint)} y2={chartH-30}
                            stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3,3" />
                        )}
                        {trendData.map((d, i) => {
                          const isHovered = hoveredPoint === i;
                          const show = isHovered || trendData.length <= 12;
                          if (!show) return null;
                          return (
                            <circle key={i} cx={xScale(i)} cy={yScale(d.value)}
                              r={isHovered ? 6 : 3.5} fill={isHovered ? '#ffffff' : '#0d9488'}
                              stroke="#0d9488" strokeWidth={isHovered ? 3 : 2}
                              style={{filter: isHovered ? 'drop-shadow(0 2px 6px rgba(13,148,136,0.35))' : 'none'}} />
                          );
                        })}
                      </>
                    )}

                    {chartMode === 'bars' && trendData.map((d, i) => {
                      const maxBarW = Math.min(50, (720 - 55 - 10) / Math.max(trendData.length, 1) * 0.6);
                      const barW = Math.max(12, maxBarW);
                      const cx = 55 + (i + 0.5) / Math.max(trendData.length, 1) * (720 - 55 - 20);
                      const x = Math.max(55, cx - barW / 2);
                      const y = yScale(d.value);
                      const h = Math.max(1, chartH - 30 - y);
                      const colors = ['#0d9488','#2563eb','#f97316','#8b5cf6','#ec4899','#14b8a6','#eab308','#6366f1'];
                      const c = colors[i % colors.length];
                      const isHovered = hoveredPoint === i;
                      return (
                        <g key={`bar-${i}`}>
                          <rect x={x} y={y} width={barW} height={h} rx={4}
                            fill={isHovered ? c : c} opacity={isHovered ? 1 : 0.7}
                            style={{filter: isHovered ? 'drop-shadow(0 2px 8px rgba(13,148,136,0.25))' : 'none'}}
                            className="transition-all duration-150 cursor-pointer"
                            onMouseEnter={(e) => {
                              setHoveredPoint(i);
                              const r = e.currentTarget.getBoundingClientRect();
                              setTooltip({ label: d.label, value: metric === 'precio' ? formatPrice(d.value) : metric === 'heat' ? `${d.value} pts` : formatCompact(d.value), x: r.left + r.width/2, y: r.top });
                            }}
                            onMouseLeave={() => { setHoveredPoint(null); setTooltip(null); }} />
                          {trendData.length <= 10 && (
                            <text x={x + barW/2} y={236} textAnchor="end" className="text-[9px]" fill="#94a3b8"
                              transform={`rotate(-25, ${x + barW/2}, 236)`}>{d.label}</text>
                          )}
                        </g>
                      );
                    })}

                    {/* Labels del eje X - solo en modo línea (modo barras ya muestra labels rotados) */}
                    {chartMode === 'line' && trendData.map((d, i) => ({ ...d, idx: i }))
                      .filter((d, i, arr) => i % Math.max(1, Math.floor(arr.length / 8)) === 0)
                      .map((d) => (
                        <text key={d.idx} x={xScale(d.idx)} y={240 - 8} textAnchor="middle" className="text-[10px]" fill="#94a3b8">{d.label}</text>
                      ))}
                  </svg>

                  {/* Tooltip premium */}
                  {tooltip && hoveredPoint !== null && (
                    <div className="fixed z-50 pointer-events-none"
                      style={{ left: tooltip.x, top: tooltip.y - 60, transform: 'translateX(-50%)' }}>
                      <div className="bg-white/95 dark:bg-[var(--bg-card)]/95 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/80 dark:border-[var(--border-color)] px-4 py-3 min-w-[130px]">
                        <p className="text-[11px] font-semibold text-gray-500 dark:text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{tooltip.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#0d9488'}} />
                          <span className="text-[11px] text-gray-400 dark:text-[var(--text-muted)]">Valor</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-[var(--text-primary)] ml-auto">{tooltip.value}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vertical === 'viviendas' && viviendas && (
                <>
                  <InsightCard title="Subieron mas" badge="Precio" color="bg-brand-light text-brand-dark" items={viviendas.topRisers.slice(0, 4).map(d => ({ label: d.district, value: `+${d.changePct}%` }))} />
                  <InsightCard title="Mas nuevos" badge="Oferta" color="bg-blue-50 text-blue-700" items={viviendas.newListings.slice(0, 4).map(d => ({ label: d.district, value: `${d.newListings} nuevos` }))} />
                  <InsightCard title="Mas buscados" badge="Demanda" color="bg-brand-light text-brand-dark" items={viviendas.hotDistricts.slice(0, 4).map(d => ({ label: d.district, value: `${d.heatScore} pts` }))} />
                </>
              )}
              {vertical === 'general' && general && (
                <>
                  <InsightCard title="Nuevos en periodo" badge="Oferta" color="bg-blue-50 text-blue-700" items={general.newByType.map(d => ({ label: d.label, value: `${d.count}` }))} />
                  <InsightCard title="Subieron mas" badge="Precio" color="bg-brand-light text-brand-dark" items={general.topRisers.slice(0, 4).map(d => ({ label: d.district, value: `+${d.changePct}%` }))} />
                  <InsightCard title="Mas buscados" badge="Demanda" color="bg-brand-light text-brand-dark" items={general.hotDistricts.slice(0, 4).map(d => ({ label: d.district, value: `${d.heatScore} pts` }))} />
                </>
              )}
              {vertical === 'proyectos' && proyectos && (
                <>
                  <InsightCard title="Proyectos activos" badge="Oferta" color="bg-indigo-50 text-indigo-700" items={proyectos.phases.map(d => ({ label: phaseLabel(d.phase), value: `${d.count}` }))} />
                  <InsightCard title="Por distrito" badge="Demanda" color="bg-brand-light text-brand-dark" items={proyectos.hotDistricts.slice(0, 4).map(d => ({ label: d.district, value: `${d.heatScore} pts` }))} />
                  <InsightCard title="Nuevos proyectos" badge="Actividad" color="bg-amber-50 text-amber-700" items={[{ label: 'Nuevos este periodo', value: `${proyectos.newProjects}` }, { label: 'Unidades disponibles', value: formatCompact(proyectos.totalAvailable) }]} />
                </>
              )}
              {vertical === 'lotes' && lotes && (
                <>
                  <InsightCard title="Nuevos lotes" badge="Oferta" color="bg-blue-50 text-blue-700" items={lotes.newListings.slice(0, 4).map(d => ({ label: d.district, value: `${d.newListings} lotes` }))} />
                  <InsightCard title="Precio m2 terr." badge="Precio" color="bg-brand-light text-brand-dark" items={[{ label: 'Promedio nacional', value: formatPrice(lotes.avgM2Terreno) }, { label: 'Ticket promedio', value: formatPrice(lotes.avgTotalPrice) }]} />
                  <InsightCard title="Mas buscados" badge="Demanda" color="bg-brand-light text-brand-dark" items={lotes.hotDistricts.slice(0, 4).map(d => ({ label: d.district, value: `${d.heatScore} pts` }))} />
                </>
              )}
            </div>

            {/* Ranking */}
            {vertical === 'viviendas' && viviendas && viviendas.hotDistricts.length > 0 && (
              <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-5">
                <h3 className="font-bold text-gray-900 dark:text-[var(--text-primary)] mb-1">Ranking de distritos</h3>
                <p className="text-sm text-gray-400 dark:text-[var(--text-muted)] mb-4">Ordenado por heat score</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 dark:border-[var(--border-color)]">
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-[var(--text-secondary)] text-xs uppercase">#</th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-[var(--text-secondary)] text-xs uppercase">Distrito</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-[var(--text-secondary)] text-xs uppercase">Vistas</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-[var(--text-secondary)] text-xs uppercase">Favs</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-[var(--text-secondary)] text-xs uppercase">Contactos</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-[var(--text-secondary)] text-xs uppercase">Heat</th>
                    </tr></thead>
                    <tbody>
                      {viviendas.hotDistricts.map((d, idx) => (
                        <tr key={d.district} className="border-b border-gray-50 dark:border-[var(--border-light)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors">
                          <td className="py-3 px-3 text-gray-400 dark:text-[var(--text-muted)] font-medium">{idx + 1}</td>
                          <td className="py-3 px-3 font-semibold text-gray-900 dark:text-[var(--text-primary)]">{d.district}</td>
                          <td className="py-3 px-3 text-right text-gray-700 dark:text-[var(--text-secondary)]">{formatCompact(d.totalViews)}</td>
                          <td className="py-3 px-3 text-right text-gray-700 dark:text-[var(--text-secondary)]">{formatCompact(d.totalFavorites)}</td>
                          <td className="py-3 px-3 text-right text-gray-700 dark:text-[var(--text-secondary)]">{formatCompact(d.totalContacts)}</td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${d.heatScore >= 70 ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : d.heatScore >= 40 ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>{d.heatScore}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {vertical === 'viviendas' && viviendas && viviendas.weeklyHighlights.length > 0 && (
              <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="font-bold text-gray-900 dark:text-[var(--text-primary)]">Destacados de la semana</h3><p className="text-sm text-gray-400 dark:text-[var(--text-muted)]">Propiedades mas vistas en los ultimos 7 dias</p></div>
                  <Activity className="w-5 h-5 text-brand" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {viviendas.weeklyHighlights.map((item, idx) => (
                    <Link key={item.id} href={`/property/${item.id}`}
                      className="bg-gray-50 dark:bg-[var(--bg-tertiary)] rounded-xl p-4 border border-gray-100 dark:border-[var(--border-color)] hover:shadow-lg hover:border-brand-light transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 dark:text-[var(--text-muted)] group-hover:bg-brand-light group-hover:text-brand">{idx + 1}</div>
                        <span className="text-[10px] font-semibold text-gray-400 dark:text-[var(--text-muted)] uppercase">{propertyLabel(item.type)}</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-[var(--text-primary)] text-sm mb-1 line-clamp-1">{item.title || `${propertyLabel(item.type)} en ${item.district}`}</p>
                      <p className="text-xs text-gray-400 dark:text-[var(--text-muted)] mb-2">{item.district} · {item.bedrooms} dorm.</p>
                      <span className="font-bold text-gray-900 dark:text-[var(--text-primary)]">{formatPrice(item.price)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`lg:w-72 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-5 sticky top-24 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-[var(--text-primary)] text-sm uppercase tracking-wider">Filtros</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="lg:hidden text-gray-400 dark:text-[var(--text-muted)] hover:text-gray-600 dark:hover:text-[var(--text-secondary)]"><X className="w-4 h-4" /></button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-[var(--text-secondary)] uppercase tracking-wider mb-2">Operacion</label>
                <div className="flex gap-2">
                  {['SALE', 'RENT'].map(op => (
                    <button key={op} onClick={() => setOperation(op)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${operation === op ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 dark:bg-[var(--bg-tertiary)] text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-[var(--bg-secondary)]'}`}>
                      {op === 'SALE' ? 'Venta' : 'Alquiler'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-[var(--text-secondary)] uppercase tracking-wider mb-2">Region</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-[var(--text-muted)] pointer-events-none" />
                  <input type="text" value={regionSearch || regionLabel || ''} placeholder="Buscar region..."
                    onChange={e => { setRegionSearch(e.target.value); setShowRegionDropdown(true); }}
                    onFocus={() => setShowRegionDropdown(true)}
                    className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand text-gray-900 dark:text-[var(--text-primary)]" />
                </div>
                {showRegionDropdown && (
                  <div className="mt-1 bg-white dark:bg-[var(--bg-card)] border border-gray-200 dark:border-[var(--border-color)] rounded-xl shadow-lg max-h-48 overflow-y-auto" ref={regionRef}>
                    <button onClick={() => { setRegionLabel(''); setRegion(''); setRegionSearch(''); setShowRegionDropdown(false); setProvince(''); setDistrict(''); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] ${!region ? 'bg-brand-light text-brand-dark font-medium' : 'text-gray-600 dark:text-[var(--text-secondary)]'}`}>Todo el pais</button>
                    {filteredRegions.map(r => (
                      <button key={r} onClick={() => { setRegionLabel(r); setRegion(r); setRegionSearch(r); setShowRegionDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] ${region === r ? 'bg-brand-light text-brand-dark font-medium' : 'text-gray-600 dark:text-[var(--text-secondary)]'}`}>{r}</button>
                    ))}
                    {filteredRegions.length === 0 && <p className="px-3 py-2 text-sm text-gray-400 dark:text-[var(--text-muted)]">Sin resultados</p>}
                  </div>
                )}
              </div>

              {region && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-[var(--text-secondary)] uppercase tracking-wider mb-2">Provincia</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-[var(--text-muted)] pointer-events-none" />
                    <input type="text" value={provinceSearch || provinceLabel || ''} placeholder="Buscar provincia..."
                      onChange={e => { setProvinceSearch(e.target.value); setShowProvinceDropdown(true); }}
                      onFocus={() => setShowProvinceDropdown(true)}
                      className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand text-gray-900 dark:text-[var(--text-primary)]" />
                  </div>
                  {showProvinceDropdown && (
                    <div className="mt-1 bg-white dark:bg-[var(--bg-card)] border border-gray-200 dark:border-[var(--border-color)] rounded-xl shadow-lg max-h-48 overflow-y-auto" ref={provinceRef}>
                      <button onClick={() => { setProvinceLabel(''); setProvince(''); setProvinceSearch(''); setShowProvinceDropdown(false); setDistrict(''); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] ${!province ? 'bg-brand-light text-brand-dark font-medium' : 'text-gray-600 dark:text-[var(--text-secondary)]'}`}>Todas</button>
                      {filteredProvinces.map(p => (
                        <button key={p} onClick={() => { setProvinceLabel(p); setProvince(p); setProvinceSearch(p); setShowProvinceDropdown(false); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] ${province === p ? 'bg-brand-light text-brand-dark font-medium' : 'text-gray-600 dark:text-[var(--text-secondary)]'}`}>{p}</button>
                      ))}
                      {filteredProvinces.length === 0 && <p className="px-3 py-2 text-sm text-gray-400 dark:text-[var(--text-muted)]">Sin resultados</p>}
                    </div>
                  )}
                </div>
              )}

              {province && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-[var(--text-secondary)] uppercase tracking-wider mb-2">Distrito</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-[var(--text-muted)] pointer-events-none" />
                    <input type="text" value={districtSearch || districtLabel || ''} placeholder="Buscar distrito..."
                      onChange={e => { setDistrictSearch(e.target.value); setShowDistrictDropdown(true); }}
                      onFocus={() => setShowDistrictDropdown(true)}
                      className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand text-gray-900 dark:text-[var(--text-primary)]" />
                  </div>
                  {showDistrictDropdown && (
                    <div className="mt-1 bg-white dark:bg-[var(--bg-card)] border border-gray-200 dark:border-[var(--border-color)] rounded-xl shadow-lg max-h-48 overflow-y-auto" ref={districtRef}>
                      <button onClick={() => { setDistrictLabel(''); setDistrict(''); setDistrictSearch(''); setShowDistrictDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] ${!district ? 'bg-brand-light text-brand-dark font-medium' : 'text-gray-600 dark:text-[var(--text-secondary)]'}`}>Todos</button>
                      {filteredDistricts.map(d => (
                        <button key={d} onClick={() => { setDistrictLabel(d); setDistrict(d); setDistrictSearch(d); setShowDistrictDropdown(false); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] ${district === d ? 'bg-brand-light text-brand-dark font-medium' : 'text-gray-600 dark:text-[var(--text-secondary)]'}`}>{d}</button>
                      ))}
                      {filteredDistricts.length === 0 && <p className="px-3 py-2 text-sm text-gray-400 dark:text-[var(--text-muted)]">Sin resultados</p>}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-[var(--text-secondary)] uppercase tracking-wider mb-2">Top distritos</label>
                <div className="flex gap-2">
                  {[5, 10, 20, 50].map(n => (
                    <button key={n} onClick={() => setTopN(n)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${topN === n ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 dark:bg-[var(--bg-tertiary)] text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-[var(--bg-secondary)]'}`}>{n}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => { setChartLoading(true); fetchRadar().finally(() => setChartLoading(false)); }}
                className="w-full py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark shadow-sm flex items-center justify-center gap-2">
                <Loader className={`w-4 h-4 ${chartLoading ? 'animate-spin' : 'hidden'}`} />Aplicar filtros
              </button>

              <div className="pt-3 border-t border-gray-100 dark:border-[var(--border-color)]">
                <p className="text-xs text-gray-400 dark:text-[var(--text-muted)] leading-relaxed">Datos actualizados en cada consulta. Valores basados en anuncios publicados en Tiyuy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-100 dark:border-[var(--border-color)] mt-8">
          <p className="text-xs text-gray-400 dark:text-[var(--text-muted)] max-w-xl mx-auto">Indicadores calculados de anuncios y proyectos en Tiyuy. Precios de oferta, no de cierre.</p>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, badge, color, items }: { title: string; badge: string; color: string; items: { label: string; value: string }[] }) {
  return (
    <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-4 hover:shadow-lg hover:border-brand-light transition-all">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-bold text-gray-900 dark:text-[var(--text-primary)] text-sm">{title}</h4>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${color}`}>{badge}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-700 dark:text-[var(--text-secondary)]">{item.label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-[var(--text-primary)]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
