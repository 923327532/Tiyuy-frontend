'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Home, Eye, Heart, Phone, BarChart3,
  Activity, Zap, ChevronRight, ArrowUpRight,
  ArrowDownRight, Building2, LandPlot, FolderGit,
  Clock, Layers, DollarSign, Search, Users, Info, Shield,
  CheckCircle2, Star, Sparkles, Target, Award,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { publicApiClient } from '@/infrastructure/api/axios-client';

interface GeneralRadar {
  totalPublished: number;
  avgPrice: number;
  totalViews: number;
  totalFavorites: number;
  totalContacts: number;
  totalProjects: number;
  totalDevelopers: number;
  hotDistricts: { district: string; totalViews: number; totalFavorites: number; totalContacts: number; listingCount: number; heatScore: number; }[];
  topRisers: { district: string; avgPrice: number; changePct: number; }[];
  newByType: { label: string; count: number; }[];
}

const formatCompact = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n >= 1_000 ? (n / 1_000).toFixed(1) + 'K' : n.toLocaleString('es-PE');

const BENEFITS = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Visibilidad sin límites',
    desc: 'Llega a miles de compradores e inquilinos activos buscando propiedades en Tiyuy. Tu portafolio completo siempre visible.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Segmentación inteligente',
    desc: 'Conecta con el usuario correcto en el momento correcto. Filtros, insights y recomendaciones basadas en comportamiento real.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Diferenciación de marca',
    desc: 'Destaca tus propiedades con contenido premium, fotografías profesionales y herramientas de marketing inmobiliario.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Confianza y transparencia',
    desc: 'Verificación de perfiles, reseñas reales y métricas de desempeño que generan credibilidad ante tus clientes.',
  },
];

const FAQS = [
  { q: '¿Cómo publico propiedades como inmobiliaria?', a: 'Crea una cuenta, completa tu perfil profesional y comienza a publicar. Puedes gestionar todo tu portafolio desde un panel centralizado.' },
  { q: '¿Tengo límite de publicaciones?', a: 'Depende del plan que elijas. Los planes profesionales ofrecen mayor capacidad de publicación, destacados y herramientas de marketing.' },
  { q: '¿Puedo ver estadísticas de mis propiedades?', a: 'Sí. Cada publicación incluye métricas de vistas, favoritos y contactos para que midas el rendimiento.' },
  { q: '¿Cómo me contacto con prospectos?', a: 'Los interesados pueden contactarte a través de formulario, WhatsApp o llamada directa. Tú eliges los canales.' },
  { q: '¿Ofrecen planes para agencias con múltiples agentes?', a: 'Sí. Contamos con planes corporativos que permiten gestionar múltiples usuarios y propiedades bajo una misma cuenta.' },
];

export default function InmobiliariasPage() {
  const [radar, setRadar] = useState<GeneralRadar | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicApiClient.get<GeneralRadar>('/analytics/market-radar/general', {
          params: { transactionType: 'SALE', topN: 10 }
        });
        setRadar(res.data);
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Data for charts
  const typeData = useMemo(() => {
    if (!radar) return [];
    return radar.newByType || [];
  }, [radar]);

  const zoneTrend = useMemo(() => {
    if (!radar) return [];
    return (radar.topRisers || []).slice(0, 6);
  }, [radar]);

  const hotZones = useMemo(() => {
    if (!radar) return [];
    return radar.hotDistricts.slice(0, 6);
  }, [radar]);

  // Dynamic texts
  const dominantType = typeData.length > 0 ? typeData.reduce((a, b) => a.count > b.count ? a : b) : null;
  const topRiser = zoneTrend.length > 0 ? zoneTrend[0] : null;
  const hottestZone = hotZones.length > 0 ? hotZones[0] : null;
  const totalPublished = radar?.totalPublished || 0;
  const totalViews = radar?.totalViews || 0;
  const totalContacts = radar?.totalContacts || 0;

  // Chart scales
  const maxHeat = Math.max(...hotZones.map(z => z.heatScore), 1);
  const maxTypeCount = Math.max(...typeData.map(t => t.count), 1);
  const maxRiser = Math.max(...zoneTrend.map(z => Math.abs(z.changePct)), 1);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase mb-5">
              <Building2 className="w-3.5 h-3.5" />
              Para inmobiliarias
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Tu mercado inmobiliario en un solo lugar
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mt-5 leading-relaxed max-w-2xl">
              Publica, gestiona y destaca propiedades con herramientas profesionales.
              Conecta con compradores e inquilinos reales en todo el Perú.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/register"
                className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-all shadow-lg inline-flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Crear cuenta profesional
              </Link>
              <Link href="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20 inline-flex items-center gap-2">
                <Info className="w-4 h-4" />
                Solicitar información
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {/* Métricas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{radar?.totalDevelopers || '—'}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Empresas que confían</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{totalPublished > 0 ? totalPublished : '—'}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Propiedades publicadas</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{totalViews > 0 ? formatCompact(totalViews) : '—'}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Vistas totales</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{totalContacts > 0 ? formatCompact(totalContacts) : '—'}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Contactos generados</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{radar?.totalProjects || '—'}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Proyectos activos</p>
          </div>
        </div>

        {/* Data blocks */}
        {!loading && radar && (
          <div className="space-y-8">
            {/* 1. Tendencia de publicaciones por zona */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-7">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Zonas con mayor crecimiento</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {topRiser
                      ? `${topRiser.district} lidera con ${topRiser.changePct > 0 ? '+' : ''}${topRiser.changePct.toFixed(1)}% de variación en precio`
                      : 'Variación de precio por distrito'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand" />
                </div>
              </div>
              {zoneTrend.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] py-4">No hay datos suficientes</p>
              ) : (
                <div className="space-y-3">
                  {zoneTrend.map((z, i) => {
                    const barW = Math.max(8, (Math.abs(z.changePct) / maxRiser) * 100);
                    const isPositive = z.changePct >= 0;
                    return (
                      <div key={z.district} className="flex items-center gap-3">
                        <span className="w-6 text-xs font-semibold text-[var(--text-muted)] text-right">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[var(--text-primary)]">{z.district}</span>
                            <span className={`text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{z.changePct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                            <div className={`h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-400'}`}
                              style={{ width: `${Math.min(barW, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-[var(--text-muted)] pt-2">
                    {zoneTrend.filter(z => z.changePct > 0).length} zonas en crecimiento y {zoneTrend.filter(z => z.changePct < 0).length} con ajuste a la baja
                  </p>
                </div>
              )}
            </div>

            {/* 2. Oferta disponible por tipo */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-7">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Oferta por tipo de propiedad</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {dominantType
                      ? `${dominantType.label} representa la mayor oferta con ${dominantType.count} publicaciones`
                      : 'Distribución de la oferta actual'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-brand" />
                </div>
              </div>
              {typeData.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] py-4">No hay datos suficientes</p>
              ) : (
                <div className="space-y-4">
                  {typeData.map((t) => {
                    const pct = (t.count / maxTypeCount) * 100;
                    return (
                      <div key={t.label} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[var(--text-primary)]">{t.label}</span>
                            <span className="text-sm font-semibold text-[var(--text-secondary)]">{t.count}</span>
                          </div>
                          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5">
                            <div className="h-2.5 rounded-full bg-brand" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Zonas con mayor movimiento */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-7">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Zonas con mayor movimiento</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {hottestZone
                      ? `${hottestZone.district} lidera en actividad con ${hottestZone.heatScore} pts de heat score`
                      : 'Ranking de distritos más activos'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand" />
                </div>
              </div>
              {hotZones.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] py-4">No hay datos suficientes</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-light)]">
                        <th className="text-left py-3 px-3 font-semibold text-[var(--text-secondary)] text-xs uppercase">#</th>
                        <th className="text-left py-3 px-3 font-semibold text-[var(--text-secondary)] text-xs uppercase">Distrito</th>
                        <th className="text-right py-3 px-3 font-semibold text-[var(--text-secondary)] text-xs uppercase">Vistas</th>
                        <th className="text-right py-3 px-3 font-semibold text-[var(--text-secondary)] text-xs uppercase">Contactos</th>
                        <th className="text-right py-3 px-3 font-semibold text-[var(--text-secondary)] text-xs uppercase">Heat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotZones.map((z, i) => (
                        <tr key={z.district} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors">
                          <td className="py-3 px-3 text-[var(--text-muted)] font-medium">{i + 1}</td>
                          <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">{z.district}</td>
                          <td className="py-3 px-3 text-right text-[var(--text-secondary)]">{formatCompact(z.totalViews)}</td>
                          <td className="py-3 px-3 text-right text-[var(--text-secondary)]">{formatCompact(z.totalContacts)}</td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              z.heatScore >= 70 ? 'bg-red-50 text-red-700' : z.heatScore >= 40 ? 'bg-orange-50 text-orange-700' : 'bg-yellow-50 text-yellow-700'
                            }`}>{z.heatScore}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-[var(--text-muted)] pt-3">
                    {hotZones.length} distritos concentran la mayor actividad del portal
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Beneficios */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">¿Por qué elegir Tiyuy?</h2>
            <p className="text-[var(--text-muted)] mt-2 max-w-xl mx-auto">Herramientas profesionales para impulsar tu negocio inmobiliario</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-6 hover:shadow-md hover:border-[var(--border-color)] transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-4">{b.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{b.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Preguntas frecuentes</h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">Todo lo que necesitas saber para empezar</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-[var(--border-color)] transition-all">
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-secondary)] transition-colors">
                  <span className="font-medium text-[var(--text-primary)] text-sm pr-4">{faq.q}</span>
                  {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-brand flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-4 border-t border-[var(--border-light)] pt-3">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Únete a las inmobiliarias que ya crecen con Tiyuy</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-6">
            Comienza a publicar, conectar y cerrar más negocios. Crea tu cuenta profesional hoy.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-dark font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition-all shadow-lg">
            <Building2 className="w-4 h-4" />
            Crear cuenta profesional
          </Link>
        </div>
      </div>
    </div>
  );
}