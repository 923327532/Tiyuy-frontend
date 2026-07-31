'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Search, MapPin, Users, ChevronLeft, ChevronRight, ArrowRight, Home, FolderGit, Shield, Sparkles, CheckCircle, ChevronDown } from 'lucide-react';
import { publicApiClient } from '@/infrastructure/api/axios-client';

interface PublicAgency {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  city: string;
  shortDescription: string;
  agentsCount: number;
  activePropertiesCount: number;
  activeProjectsCount: number;
}

interface PageResponse {
  content: PublicAgency[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const FEATURES = [
  { icon: <Shield className="w-5 h-5" />, title: 'Roommates seguros', desc: 'Verificación completa' },
  { icon: <FolderGit className="w-5 h-5" />, title: 'Lotes transparentes', desc: 'Información clara' },
  { icon: <Users className="w-5 h-5" />, title: 'Dueños sin barreras', desc: 'Acceso universal' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Soporte Directo', desc: 'Trato preferencial' },
];

export default function AgenciesPage() {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(0);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, size: 9 };
      if (search) params.q = search;
      if (city) params.city = city;
      const res = await publicApiClient.get<PageResponse>('/public/agencies', { params });
      setData(res.data);
    } catch { /* empty */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAgencies(); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchAgencies();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* ===== HERO PREMIUM ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#166534] via-[#14532d] to-[#0d2b1a]">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url('https://edifica.com.pe/blog/wp-content/uploads/departamento-jovenes.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }} />

        {/* Curva decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 pt-24 pb-32 lg:pb-36">
            {/* Columna izquierda - Texto */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-[11px] font-semibold px-3.5 py-1.5 rounded-full tracking-[0.15em] uppercase border border-white/10">
                <Sparkles className="w-3 h-3" />
                Directorio
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Inmobiliarias<br />
                <span className="text-white/70">en Perú</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-lg">
                Empresas, constructoras y desarrolladores registrados en Tiyuy. Explora sus proyectos y propiedades en todo el Perú.
              </p>
            </div>

            {/* Columna derecha - Tarjetas flotantes */}
            <div className="hidden lg:grid grid-cols-2 gap-4 items-center">
              {FEATURES.map((f, i) => (
                <div key={i}
                  className="group bg-[var(--bg-card)]/95 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-[#22c55e]/25 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.05)] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    marginTop: i % 2 === 1 ? '24px' : '0',
                  }}>
                  <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] mb-3 group-hover:bg-[#166534] group-hover:text-white transition-all duration-300">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-0.5">{f.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 -mt-14 relative z-20">
        {/* ===== BUSCADOR PREMIUM ===== */}
        <form onSubmit={handleSearch}
          className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center gap-2 pl-4">
            <Search className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full py-3 text-sm outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]" />
          </div>
          <div className="relative sm:min-w-[160px] min-w-0">
            <button type="button" onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:border-[#c4beb6] focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/30 transition-all duration-200">
              <span className={city ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}>{city || 'Todas las ciudades'}</span>
              <ChevronDown className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform duration-200 ${showCityDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showCityDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCityDropdown(false)} />
                <div className="absolute top-full mt-1 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-20 overflow-hidden">
                  {[{v:'',l:'Todas las ciudades'},{v:'Lima',l:'Lima'},{v:'Arequipa',l:'Arequipa'},{v:'Cusco',l:'Cusco'},{v:'Trujillo',l:'Trujillo'},{v:'Piura',l:'Piura'},{v:'Ica',l:'Ica'}].map(opt => (
                    <button key={opt.v} type="button" onClick={() => { setCity(opt.v); setPage(0); setShowCityDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-secondary)] ${city === opt.v ? 'bg-[#F0F7F3] text-[#1F5A3B] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button type="submit"
            className="sm:px-6 px-4 py-3 bg-[#1F5A3B] hover:bg-[#163F2B] text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(31,90,59,0.2)] hover:shadow-[0_6px_20px_rgba(31,90,59,0.3)]">
            Buscar
          </button>
        </form>

        {/* ===== RESULTADOS ===== */}
        <div className="mt-12 lg:mt-16">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#1F5A3B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !data || data.content.length === 0 ? (
            <div className="text-center py-24">
              <Building2 className="w-14 h-14 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-base font-medium text-[var(--text-secondary)]">{search || city ? 'No se encontraron inmobiliarias' : 'No hay inmobiliarias registradas'}</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">{search || city ? 'Intenta con otros términos' : 'Aún no hay inmobiliarias disponibles'}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-[var(--text-secondary)]">{data.totalElements} inmobiliarias encontradas</p>
              </div>

              {/* ===== CARDS 3 por fila ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.content.map((agency) => (
          <Link key={agency.id} href={`/agencies/${agency.slug}`}
            className="group bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--border-color)] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(20,83,45,0.06)] hover:border-[#22c55e] hover:-translate-y-0.5 transition-all duration-300 flex flex-col">

                    {/* Logo + Nombre + Verificado */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] font-bold text-xl flex-shrink-0 border border-[var(--border-color)] overflow-hidden">
                        {agency.logoUrl ? (
                          <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
                        ) : (
                          agency.name?.[0] || 'I'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--text-primary)] text-[15px] leading-tight truncate group-hover:text-[#1F5A3B] transition-colors">
                            {agency.name}
                          </h3>
                          <CheckCircle className="w-4 h-4 text-[#1F5A3B] flex-shrink-0" />
                        </div>
                        {agency.city && (
                          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />{agency.city}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Descripción */}
                    {agency.shortDescription && (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-5 flex-1">
                        {agency.shortDescription}
                      </p>
                    )}

                    {!agency.shortDescription && <div className="flex-1" />}

                    {/* Métricas */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-4">
                      {agency.activeProjectsCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <FolderGit className="w-4 h-4 text-[#1F5A3B]/50" />
                          <span className="font-medium">{agency.activeProjectsCount}</span> proy.
                        </span>
                      )}
                      {agency.activePropertiesCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Home className="w-4 h-4 text-[#1F5A3B]/50" />
                          <span className="font-medium">{agency.activePropertiesCount}</span> prop.
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#1F5A3B]/50" />
                        <span className="font-medium">{agency.agentsCount}</span>
                      </span>
                      <span className="ml-auto text-xs font-medium text-[#1F5A3B] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Ver <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ===== PAGINACIÓN ===== */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pb-8">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-card)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                    .filter(i => i === 1 || i === data.totalPages || Math.abs(i - (page + 1)) <= 1)
                    .map((i, idx, arr) => (
                      <span key={i}>
                        {idx > 0 && arr[idx - 1] !== i - 1 && <span className="text-[var(--text-tertiary)] px-1">...</span>}
                        <button onClick={() => setPage(i - 1)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            page === i - 1
                              ? 'bg-[#1F5A3B] text-white shadow-[0_4px_12px_rgba(31,90,59,0.2)]'
                              : 'border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                          }`}>{i}</button>
                      </span>
                    ))}
                  <button onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={page >= data.totalPages - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-card)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}