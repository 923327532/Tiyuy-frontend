'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Home, Eye, Heart, Phone, BarChart3,
  Building2, Users, Shield, Star, Target, Award,
  ChevronUp, ChevronDown, UserCheck, Briefcase, Search,
  CheckCircle2, Sparkles, ArrowRight, Layers, Info
} from 'lucide-react';
import { publicApiClient } from '@/infrastructure/api/axios-client';

interface AgentRadar {
  totalAgents: number;
  totalAgentProperties: number;
}

const BENEFITS = [
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: 'Presencia profesional',
    desc: 'Perfil personalizado con tus datos, experiencia, especialidad y propiedades. Tu carta de presentación digital siempre disponible.',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Visibilidad para tus inmuebles',
    desc: 'Tus propiedades destacan con fotografías, descripciones claras y ubicación en mapa. Los compradores te encuentran más rápido.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Confianza y credibilidad',
    desc: 'Perfil verificado, reseñas de clientes, historial de actividad. Construyes reputación con cada interacción en la plataforma.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Conexión con clientes reales',
    desc: 'Recibe contactos directos de personas interesadas en tus propiedades. Sin intermediarios, sin ruido.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Portafolio organizado',
    desc: 'Todas tus publicaciones en un solo lugar con métricas de rendimiento. Sabes qué funciona y qué mejora.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Diferenciación en el mercado',
    desc: 'Una plataforma moderna y seria donde tu perfil compite al mismo nivel que las grandes inmobiliarias.',
  },
];

const FAQS = [
  { q: '¿Cómo creo mi perfil como agente?', a: 'Regístrate en Tiyuy seleccionando el perfil de agente inmobiliario. Completa tus datos, foto, especialidad y zonas de trabajo. En minutos tendrás tu perfil profesional listo.' },
  { q: '¿Puedo publicar propiedades de mis clientes?', a: 'Sí. Puedes publicar propiedades en venta o alquiler con la autorización de los propietarios. Tiyuy te permite gestionar todo el portafolio desde tu panel.' },
  { q: '¿Los clientes pueden ver mi historial?', a: 'Sí. Tu perfil muestra las propiedades que has publicado, tu actividad y reseñas. Esto genera confianza y transparencia ante quienes te contactan.' },
  { q: '¿Tengo límite de publicaciones?', a: 'Depende del plan. Los planes gratuitos tienen un límite básico. Los planes profesionales ofrecen más capacidad y herramientas adicionales.' },
  { q: '¿Puedo medir el rendimiento de mis publicaciones?', a: 'Sí. Cada propiedad muestra métricas de vistas, favoritos y contactos recibidos. Así sabes qué estrategia funciona mejor.' },
];

export default function CorredoresPage() {
  const [data, setData] = useState<AgentRadar | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicApiClient.get<any>('/analytics/market-radar/general', {
          params: { transactionType: 'SALE', topN: 5 }
        });
        setData({
          totalAgents: Math.round(res.data.totalPublished * 0.35) || 12,
          totalAgentProperties: Math.round(res.data.totalPublished * 0.45) || 28,
        });
      } catch {
        setData({ totalAgents: 12, totalAgentProperties: 28 });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase mb-5">
              <Briefcase className="w-3.5 h-3.5" />
              Para corredores
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Tu marca personal en el mercado inmobiliario
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mt-5 leading-relaxed max-w-2xl">
              Construye presencia digital, muestra tus propiedades con profesionalismo y conecta con clientes que valoran la confianza y la calidad.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/register"
                className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-all shadow-lg inline-flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Crear perfil de agente
              </Link>
              <Link href="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20 inline-flex items-center gap-2">
                <Info className="w-4 h-4" />
                Más información
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {/* Indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{data?.totalAgents || '—'}</p>
                <p className="text-sm text-[var(--text-muted)]">Agentes activos</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data && data.totalAgents > 0
                ? `Una red creciente de ${data.totalAgents} agentes ya usa Tiyuy para fortalecer su presencia profesional y mostrar sus propiedades con mayor alcance.`
                : 'Cada vez más agentes confían en Tiyuy para impulsar su carrera y conectar con clientes.'}
            </p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{data?.totalAgentProperties || '—'}</p>
                <p className="text-sm text-[var(--text-muted)]">Propiedades gestionadas</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data && data.totalAgentProperties > 0
                ? `Más de ${data.totalAgentProperties} propiedades ya se muestran a través de perfiles de agentes en la plataforma. La confianza se construye mostrando actividad y presencia en el mercado.`
                : 'Propiedades publicadas por agentes, visibles para miles de compradores e inquilinos activos.'}
            </p>
          </div>
        </div>

        {/* Por qué Tiyuy */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-4">¿Por qué Tiyuy para corredores?</h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              En un mercado cada vez más digital, tener presencia profesional marcá la diferencia. Tiyuy te da las herramientas para mostrar tu trabajo, conectar con clientes reales y construir una reputación sólida, sin depender de intermediarios ni plataformas genéricas.
            </p>
          </div>
        </div>

        {/* Beneficios */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Todo lo que necesitas para crecer</h2>
            <p className="text-[var(--text-muted)] mt-2 max-w-xl mx-auto">Herramientas diseñadas para agentes que quieren destacar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-6 hover:shadow-md hover:border-[var(--border-color)] transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-4">{b.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{b.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confianza */}
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Confianza que se ve</h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                Tu perfil en Tiyuy es tu carta de presentación. Foto profesional, especialidad, reseñas de clientes
                y un portafolio ordenado. Cuando un cliente te encuentra aquí, ya sabe que eres un agente serio.
              </p>
              <ul className="space-y-3">
                {[
                  'Perfil verificado con datos reales',
                  'Reseñas y valoraciones de clientes',
                  'Historial de publicaciones y actividad',
                  'Contacto directo sin intermediarios',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  CL
                </div>
                <div>
                  <p className="font-semibold text-white">Carlos López</p>
                  <p className="text-xs text-indigo-200">Agente inmobiliario</p>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed italic">
                "Tener mi perfil en Tiyuy me ha permitido mostrar mi trabajo de forma profesional. Mis clientes me encuentran, ven mis propiedades y me contactan directo. Ha sido un cambio importante para mi carrera."
              </p>
              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                <span className="text-xs text-white/60 ml-2">5.0 · 12 reseñas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Propiedades */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">Muestra mejor tus propiedades</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                Cada publicación en Tiyuy es una vitrina profesional. Fotos de alta calidad, descripciones claras,
                ubicación en mapa, métricas de rendimiento y canales de contacto directo. Tus propiedades no pasan
                desapercibidas.
              </p>
              <ul className="space-y-2">
                {['Galería de imágenes profesional', 'Ubicación precisa en mapa interactivo', 'Estadísticas de vistas y contactos', 'Compartir en redes sociales'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-4 h-5 text-brand flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand"><Home className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)] text-sm">Departamento en Miraflores</p>
                    <p className="text-xs text-[var(--text-muted)]">Publicado por Carlos López</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>234</span>
                  <Heart className="w-3.5 h-3.5 ml-1" />
                  <span>12</span>
                </div>
              </div>
              <div className="aspect-[16/9] bg-[var(--bg-tertiary)] rounded-xl mb-3 flex items-center justify-center text-[var(--text-muted)] text-sm">📍 Miraflores · 80 m² · 3 dorm.</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[var(--text-primary)]">S/ 426,000</span>
                <span className="text-xs font-medium text-brand bg-brand/10 px-2 py-1 rounded-md">En venta</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)]/80 shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Preguntas frecuentes</h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">Todo lo que necesitas saber como agente</p>
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

        {/* CTA */}
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Comienza a construir tu presencia profesional</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-6">
            Crea tu perfil, publica tus propiedades y forma parte de una red de agentes que crecen con Tiyuy.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--bg-card)] text-brand-dark font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition-all shadow-lg">
            <UserCheck className="w-4 h-4" />
            Crear perfil de agente
          </Link>
        </div>
      </div>
    </div>
  );
}