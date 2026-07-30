'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { LocationSearch } from '@/presentation/components/forms/LocationSearch/LocationSearch';
import { usePublicBanners } from '@/presentation/hooks/usePublicBanners';
import { prefetchFeaturedProperties } from '@/presentation/hooks/useFeaturedProperties';
import { prefetchFeaturedProjects } from '@/presentation/hooks/useFeaturedProjects';
import { prefetchFilteredProperties } from '@/presentation/hooks/useFilteredProperties';

// Componentes pesados con lazy loading + Splitting de código para reducir bundle inicial
const FeaturedProperties = lazy(() => import('@/presentation/components/property/FeaturedProperties/FeaturedProperties').then(m => ({ default: m.FeaturedProperties })));
const FeaturedProjects = lazy(() => import('@/presentation/components/project/FeaturedProjects/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));
const IntelligentPropertySections = lazy(() => import('@/presentation/components/property/IntelligentPropertySections/IntelligentPropertySections').then(m => ({ default: m.IntelligentPropertySections })));
const FeaturedCampaigns = lazy(() => import('@/presentation/components/marketing/FeaturedCampaigns').then(m => ({ default: m.FeaturedCampaigns })));
const Footer = lazy(() => import('@/presentation/components/layout/Footer/Footer').then(m => ({ default: m.Footer })));

// Skeleton de cards que coincide exactamente con el layout real
const CardsSkeleton = () => (
  <div className="flex overflow-x-auto hide-scrollbar gap-3">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="w-[160px] sm:w-[280px] md:w-[320px] lg:w-[240px] xl:w-[190px] 2xl:w-[220px] flex-shrink-0">
        <div className="bg-transparent rounded-none border-none overflow-hidden animate-pulse">
          <div className="w-full aspect-square bg-[var(--bg-tertiary)] rounded-[14px]" />
          <div className="pt-2 space-y-1.5">
            <div className="h-3.5 bg-[var(--bg-tertiary)] rounded w-full" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-2/3" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Fallback para Suspense que ya muestra las cards skeleton (el usuario ve algo inmediato)
const SectionFallback = ({ height = '300px' }: { height?: string }) => (
  <div className="py-4" style={{ minHeight: height }}>
    <CardsSkeleton />
  </div>
);

// Fallback images si no hay banners configurados en admin
const FALLBACK_HERO_IMAGES = [
  '/assets/images/hero/hero-1.jpg',
  '/assets/images/hero/hero-2.jpg',
  '/assets/images/hero/hero-3.webp',
  '/assets/images/hero/hero-4.webp',
];

const links = [
  { href: "/rent/departamentos/lima", label: "Alquilar" },
  { href: "/sale/departamentos/lima", label: "Comprar" },
  { href: "/properties", label: "Propiedades" },
  { href: "/my-properties/new", label: "Publicar" },
  { href: "/projects/departamentos/lima", label: "Proyectos" },
];
const quickLinks = [
  {
    href: "/properties",
    icon: "material-symbols:home",
    title: "Propiedades Inmobiliarias",
    description: "Explora departamentos, casas, terrenos y locales en venta y alquiler en todo el Perú.",
    actionText: "Ver propiedades",
  },
  {
    href: "/projects",
    icon: "material-symbols:apartment",
    title: "Proyectos Inmobiliarios",
    description: "Descubre los mejores proyectos de vivienda e inversión de las principales inmobiliarias.",
    actionText: "Ver proyectos",
  },
  {
    href: "/blog",
    icon: "material-symbols:article-outline",
    title: "Nuestro blog",
    description: "Consejos, novedades y noticias del ámbito de la construcción.",
    actionText: "Ver blog completo",
  },
  {
    href: "/rental-guide",
    icon: "material-symbols:assignment-outline",
    title: "Guía para alquilar",
    description: "Lo que necesitas saber a la hora de alquilar en un solo lugar.",
    actionText: "Ver guía completa",
  },
  {
    href: "/about-tiyuy",
    icon: "material-symbols:info-outline",
    title: "Conoce TIYUY",
    description: "Toda la información sobre cómo usar nuestro portal ¡y mucho más!",
    actionText: "Conocer más",
  },
];

function CustomSelect({ options, value, onChange, placeholder }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)] text-base text-[var(--text-primary)] cursor-pointer transition-all hover:border-[var(--border-color)] shadow-sm focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
      >
        <span className={selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>{selected ? selected.label : placeholder}</span>
        <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm transition-colors hover:bg-brand-light hover:text-brand-dark ${value === opt.value ? 'bg-brand-light text-brand-dark font-semibold' : 'text-[var(--text-primary)]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  // Prefetch inmediato de TODAS las secciones — arranca antes que monten los componentes
  useEffect(() => {
    prefetchFeaturedProperties();
    prefetchFeaturedProjects();
    prefetchFilteredProperties({ type: 'APARTMENT', transactionType: 'RENT' });
    prefetchFilteredProperties({ type: 'HOUSE', transactionType: 'SALE' });
    prefetchFilteredProperties({ type: 'COMMERCIAL' });
    prefetchFilteredProperties({ type: 'LAND' });
  }, []);

  const { data: sliderBanners = [] } = usePublicBanners('SLIDER');
  const { data: mainBanners = [] } = usePublicBanners('HOME_MAIN');
  const { data: homeBanners = [] } = usePublicBanners('HOME_BANNER');

  // Memoizar integratedBanners para referencia estable
  const integratedBanners = useMemo(() => {
    const all = [...sliderBanners, ...mainBanners, ...homeBanners];
    return all.filter(b => b.displayMode === 'INTEGRATED' || !b.displayMode);
  }, [sliderBanners, mainBanners, homeBanners]);

  // Si hay banners del admin, SOLO se muestran esos (sin imágenes estáticas de fallback)
  // Si no hay banners del admin, se usan las imágenes estáticas por defecto
  const heroImages = useMemo(() => 
    integratedBanners.length > 0
      ? integratedBanners.map(b => b.imageUrl)
      : FALLBACK_HERO_IMAGES,
    [integratedBanners]
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesLoadedRef = useRef(false);

  // Precargar todas las imágenes del carrusel (solo una vez)
  useEffect(() => {
    if (imagesLoadedRef.current) return;
    imagesLoadedRef.current = true;
    heroImages.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {};
      img.onerror = () => {};
      img.src = src;
    });
  }, [heroImages]);
  const [activeTab, setActiveTab] = useState<'rent' | 'sale' | 'projects'>('sale');
  const [selectedPropertyType, setSelectedPropertyType] = useState('departamentos');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [selectedMinArea, setSelectedMinArea] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      const currentPath = window.location.pathname;

      if (currentPath.includes('/rent/') || referrer.includes('/rent/')) {
        setActiveTab('rent');
      } else if (currentPath.includes('/sale/') || referrer.includes('/sale/')) {
        setActiveTab('sale');
      } else if (currentPath.includes('/projects') || referrer.includes('/projects')) {
        setActiveTab('projects');
      }

      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab && ['rent', 'sale', 'projects'].includes(savedTab)) {
        setActiveTab(savedTab as 'rent' | 'sale' | 'projects');
      }
    }
  }, [pathname]);

  const getPropertyTypes = (tab = activeTab) => {
    switch (tab) {
      case 'projects':
        return [
          { value: 'departamentos', label: 'Residencial' },
          { value: 'locales', label: 'Comercial' },
          { value: 'mixto', label: 'Mixto' },
          { value: 'industrial', label: 'Industrial' },
        ];
      default:
        return [
          { value: 'departamentos', label: 'Departamentos' },
          { value: 'casas', label: 'Casas' },
          { value: 'habitaciones', label: 'Habitaciones' },
          { value: 'terrenos', label: 'Terrenos' },
          { value: 'oficinas', label: 'Oficinas' },
          { value: 'locales', label: 'Local Comercial' }
        ];
    }
  };

  const handleTabClick = (tab: 'rent' | 'sale' | 'projects') => {
    setActiveTab(tab);
    const availableTypes = getPropertyTypes(tab);
    if (!availableTypes.some(t => t.value === selectedPropertyType)) {
      setSelectedPropertyType(availableTypes[0].value);
    }
    localStorage.setItem('selectedTab', tab);
    sessionStorage.setItem('lastActiveTab', tab);
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location.mainText);
  };

  const handleSearch = () => {
    const baseUrl = activeTab === 'rent' ? '/rent' : activeTab === 'sale' ? '/sale' : '/projects';
    const location = selectedLocation || 'lima';
    let url = `${baseUrl}/${selectedPropertyType}/${location}`;

    const params = new URLSearchParams();

    if (activeTab !== 'projects') {
      if ((selectedPropertyType === 'departamentos' || selectedPropertyType === 'casas') && selectedBedrooms) {
        params.append('bedrooms', selectedBedrooms);
      }
      if (selectedPropertyType === 'habitaciones' && selectedBathrooms) {
        params.append('bathrooms', selectedBathrooms);
      }
      if (['oficinas', 'terrenos', 'lotes', 'locales'].includes(selectedPropertyType) && selectedMinArea) {
        params.append('minArea', selectedMinArea);
      }
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    if (activeTab !== 'projects') {
      localStorage.setItem('lastSearch', JSON.stringify({
        transactionType: activeTab === 'rent' ? 'rent' : 'sale',
        type: selectedPropertyType,
        district: selectedLocation || '',
        bedrooms: selectedBedrooms || '',
        bathrooms: selectedBathrooms || '',
        minArea: selectedMinArea || '',
      }));
    }

    router.push(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[540px] overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="100vw"
                priority={index < 2}
                loading={index < 2 ? undefined : 'lazy'}
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full px-4 sm:px-8 xl:px-16">
            <div className="max-w-[1920px] mx-auto flex justify-center items-center">
              <div className="max-w-[800px] w-full text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-8 drop-shadow-lg">
                  Encuentra tu hogar
                </h1>

                <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border-color)]">
                  <div className="border-b border-[var(--border-color)] rounded-t-2xl bg-[var(--bg-card)] overflow-hidden">
                    <div className="flex">
                      <button
                        onClick={() => handleTabClick('rent')}
                        className={`flex-1 py-4 text-base font-semibold transition-colors bg-[var(--bg-card)] ${
                          activeTab === 'rent'
                            ? 'text-brand border-b-2 border-brand'
                            : 'text-[var(--text-muted)] hover:text-brand hover:bg-[var(--bg-secondary)]/50'
                        }`}
                      >
                        Alquilar
                      </button>
                      <button
                        onClick={() => handleTabClick('sale')}
                        className={`flex-1 py-4 text-base font-semibold transition-colors bg-[var(--bg-card)] ${
                          activeTab === 'sale'
                            ? 'text-brand border-b-2 border-brand'
                            : 'text-[var(--text-muted)] hover:text-brand hover:bg-[var(--bg-secondary)]/50'
                        }`}
                      >
                        Comprar
                      </button>
                      <button
                        onClick={() => handleTabClick('projects')}
                        className={`flex-1 py-4 text-base font-semibold transition-colors bg-[var(--bg-card)] ${
                          activeTab === 'projects'
                            ? 'text-brand border-b-2 border-brand'
                            : 'text-[var(--text-muted)] hover:text-brand hover:bg-[var(--bg-secondary)]/50'
                        }`}
                      >
                        Proyectos
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--bg-card)] rounded-b-2xl">
                    <div className="flex flex-col lg:flex-row gap-3 relative z-10">
                      <div className="flex-1">
                        <CustomSelect 
                          options={getPropertyTypes()}
                          value={selectedPropertyType}
                          onChange={setSelectedPropertyType}
                          placeholder="Tipo"
                        />
                      </div>

                      {activeTab !== 'projects' && (selectedPropertyType === 'departamentos' || selectedPropertyType === 'casas') ? (
                        <div className="flex-1">
                          <CustomSelect 
                            options={[
                              { value: '', label: 'Habitaciones' },
                              { value: '1', label: '1 habitación' },
                              { value: '2', label: '2 habitaciones' },
                              { value: '3', label: '3 habitaciones' },
                              { value: '4', label: '4 habitaciones' },
                              { value: '5', label: '5+ habitaciones' },
                            ]}
                            value={selectedBedrooms}
                            onChange={setSelectedBedrooms}
                            placeholder="Habitaciones"
                          />
                        </div>
                      ) : activeTab !== 'projects' && selectedPropertyType === 'habitaciones' ? (
                        <div className="flex-1">
                          <CustomSelect 
                            options={[
                              { value: '', label: 'Baños' },
                              { value: 'propio', label: 'Propio' },
                              { value: 'compartido', label: 'Compartido' },
                            ]}
                            value={selectedBathrooms}
                            onChange={setSelectedBathrooms}
                            placeholder="Baños"
                          />
                        </div>
                      ) : activeTab !== 'projects' && ['oficinas', 'terrenos', 'locales', 'lotes'].includes(selectedPropertyType) ? (
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            placeholder="Área mínima (m²)"
                            value={selectedMinArea}
                            onChange={(e) => setSelectedMinArea(e.target.value)}
                            className="w-full hero-input-number px-5 py-3.5 border border-[var(--border-color)] rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none text-base text-[var(--text-primary)] bg-[var(--bg-card)] transition-all hover:border-[var(--border-color)] shadow-sm"
                          />
                        </div>
                      ) : null}

                      <div className="flex-[2]">
                        <LocationSearch
                          onLocationSelect={handleLocationSelect}
                          placeholder="Ingresa ubicaciones o características (ej: piscina)"
                        />
                      </div>

                      <button
                        onClick={handleSearch}
                        className="bg-brand text-white px-10 py-3.5 rounded-xl font-bold text-base hover:bg-brand-hover transition-colors whitespace-nowrap w-full lg:w-[180px] shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-primary)]">
        <div className="w-full px-4 sm:px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
              {links.map(({ href, label }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`py-4 text-sm sm:text-base font-semibold border-b-4 transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "text-[var(--brand-primary)] border-[var(--brand-primary)]"
                        : "text-[var(--text-secondary)] border-transparent hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-2 sm:py-3 bg-[var(--bg-primary)]">
        <div className="w-full px-4 sm:px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickLinks.map(({ href, icon, title, description, actionText }) => (
                <Link key={href} href={href} className="block group h-full">
                  <div className="flex flex-col h-full bg-[var(--bg-card)] rounded-xl p-4 sm:p-5 shadow-sm border border-[var(--border-color)] hover:border-brand/30 group-hover:scale-[1.02] transition-all duration-300">
                    <div className="flex-grow">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--brand-primary-light)] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[var(--brand-primary-light-hover)] transition-colors">
                        <Icon icon={icon} className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                        {title}
                      </h3>
                      <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
                        {description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand font-semibold text-[11px] sm:text-xs pt-1">
                      <span>{actionText}</span>
                      <Icon icon="material-symbols:arrow-forward-ios-rounded" className="w-2.5 h-2.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-2 sm:py-3 bg-background">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16">
          <Suspense fallback={<SectionFallback height="300px" />}>
            <FeaturedProperties />
          </Suspense>
        </div>
      </section>

      <section className="py-2 sm:py-3 bg-background">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16">
          <Suspense fallback={<SectionFallback height="400px" />}>
            <IntelligentPropertySections />
          </Suspense>
        </div>
      </section>

      <section className="py-2 sm:py-3 bg-background">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16">
          <Suspense fallback={<SectionFallback height="300px" />}>
            <FeaturedProjects />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<SectionFallback height="200px" />}>
        <FeaturedCampaigns />
      </Suspense>

      <section className="py-2 sm:py-3 bg-background">
        <div className="w-full px-4 sm:px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Búsquedas populares en Perú
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              <Link href="/rent/departamentos/lima" className="text-brand hover:underline text-base font-medium">
                Departamentos en Lima
              </Link>
              <Link href="/rent/casas/arequipa" className="text-brand hover:underline text-base font-medium">
                Casas en Arequipa
              </Link>
              <Link href="/rent/departamentos/cusco" className="text-brand hover:underline text-base font-medium">
                Departamentos en Cusco
              </Link>
              <Link href="/sale/casas/trujillo" className="text-brand hover:underline text-base font-medium">
                Casas en Trujillo
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={<div style={{ height: '200px' }} />}>
        <Footer />
      </Suspense>
    </div>
  );
}