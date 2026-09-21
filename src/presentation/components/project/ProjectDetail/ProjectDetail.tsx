'use client';

import { useState, useMemo } from 'react';
import { ProjectFull, ProjectUnit } from '@/core/domain/entities/Project';
import { useProjects } from '@/presentation/hooks/useProjects';
import ProjectQuotation from './ProjectQuotation';
import { SimilarProjects } from '../SimilarProjects';
import { ProjectGallery } from './ProjectGallery';
import { ProjectContactSidebar } from './ProjectContactSidebar';
import { ProjectComments } from './ProjectComments';
import { FavoriteButton } from '../../shared/FavoriteButton/FavoriteButton';
import { ShareButton } from '../../shared/ShareButton/ShareButton';
import { StarRating } from '../../property/PropertyDetail/StarRating';
import { Bath, Building, Calendar, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Globe, Home, Landmark, MapPin, Maximize, Menu, MessageCircle, ShoppingCart, Tag, X, ImageOff } from 'lucide-react';

interface ProjectDetailProps {
  project: ProjectFull;
}

const PHASE_LABELS: Record<string, string> = {
  PRE_SALE: 'En planos',
  SALE: 'En construcción',
  DELIVERY: 'Entrega inmediata',
};

const TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residencial',
  COMMERCIAL: 'Comercial',
  INDUSTRIAL: 'Industrial',
  MIXED_USE: 'Uso mixto',
};

const UNITS_PER_PAGE = 8; // 4 por fila × 2 filas

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const truncated = text.slice(0, 100);
  return (
    <div>
      <p className="text-gray-600 leading-relaxed">
        {expanded ? text : truncated}
        {text.length > 100 && !expanded && <span className="text-gray-300">...</span>}
      </p>
      {text.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const { projectUnits, projectFull } = useProjects();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ProjectUnit | null>(null);
  const [rating, setRating] = useState<{ averageRating: number; totalRatings: number } | null>(null);
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);

  const { data: unitsData } = projectUnits(project.id, 0, 100);
  const { data: fullProjectData } = projectFull(project.id);

  const currentProject = fullProjectData || project;
  // Usar las unidades del detalle completo (blueprintImage incluido), no del endpoint paginado
  const units: ProjectUnit[] = currentProject.units || [];

  // ── AGRUPAR UNIDADES SIMILARES ──
  const groupedUnitTypes = useMemo(() => {
    const map = new Map<string, { units: ProjectUnit[]; key: string }>();

    units.forEach(unit => {
      const bedrooms = unit.bedrooms ?? 0;
      const bathrooms = unit.bathrooms ?? 0;
      const area = unit.area ?? 0;
      const price = unit.price ?? 0;
      const key = `${unit.type}-${bedrooms}-${bathrooms}-${area}-${price}`;
      if (!map.has(key)) {
        map.set(key, { units: [], key });
      }
      map.get(key)!.units.push(unit);
    });

    return Array.from(map.values()).sort((a, b) =>
      (a.units[0].bedrooms ?? 0) - (b.units[0].bedrooms ?? 0)
    );
  }, [units]);

  const bedroomGroups = [...new Set(
    groupedUnitTypes.map(g => g.units[0].bedrooms ?? 0)
  )].sort((a, b) => a - b);

  // Usar ProjectQuotation hook
  const quotation = ProjectQuotation({
    project: currentProject,
    groupedUnitTypes,
    currency: currentProject.currency || 'S/.',
    TYPE_LABELS,
    PHASE_LABELS,
    deliveryDate: (currentProject as any).deliveryDate
      ? new Date((currentProject as any).deliveryDate).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })
      : undefined,
  });

  const activeGroup = activeTab ?? bedroomGroups[0] ?? null;

  // Imágenes
  const allImages = currentProject.images || [];
  const coverImage = currentProject.coverImageUrl;
  const galleryImages = allImages.length > 0 ? allImages : coverImage ? [coverImage] : [];
  const galleryImagesOnly = galleryImages.filter((img: string) =>
    !img.includes('.mp4') && !img.includes('.avi') && !img.includes('.mov') && !img.includes('.webm')
  );
  const blueprints = currentProject.blueprints || [];
  const renders = currentProject.renders || [];

  const video: string | null = renders && renders.length > 0
    ? renders.find(r => r.includes('.mp4') || r.includes('.avi') || r.includes('.mov') || r.includes('.webm')) ?? null
    : null;

  const currency = currentProject.currency === 'USD' ? '$' : 'S/.';

  const deliveryDate = currentProject.estimatedDelivery
    ? new Date(currentProject.estimatedDelivery).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
      })
    : null;

  // ── OBTENER IMAGEN DE PLANO PARA UN TIPO DE UNIDAD ──
  const getGroupBlueprintImage = (groupUnits: ProjectUnit[]): string | null => {
    // Solo devolver URLs reales que empiecen con http
    const sample = groupUnits[0];
    if ((sample as any).blueprintImage && String((sample as any).blueprintImage).startsWith('http')) {
      return (sample as any).blueprintImage;
    }
    for (const unit of groupUnits) {
      if ((unit as any).blueprintImage && String((unit as any).blueprintImage).startsWith('http')) {
        return (unit as any).blueprintImage;
      }
    }
    return null;
  };

  // ── PAGINACIÓN POR TIPO DE UNIDAD ──
  const [unitPages, setUnitPages] = useState<Record<string, number>>({});

  const getPage = (key: string) => unitPages[key] || 0;
  const setPage = (key: string, page: number) => {
    setUnitPages(prev => ({ ...prev, [key]: page }));
  };

  const handleToggleExpand = (key: string) => {
    if (expandedGroupKey === key) {
      setExpandedGroupKey(null);
    } else {
      setExpandedGroupKey(key);
      setUnitPages(prev => ({ ...prev, [key]: 0 })); // reset page
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ════════════════════════════════════════
              COLUMNA PRINCIPAL (3/4)
          ════════════════════════════════════════ */}
          <div className="lg:col-span-9 space-y-4">

            {/* ── FAVORITO / COMPARTIR (encima de la galería) ── */}
            <div className="flex items-center justify-end gap-1">
              <FavoriteButton propertyId={project.id} variant="topbar" />
              <ShareButton variant="topbar" />
            </div>

            {/* 1. GALERÍA */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm -mt-2">
              <ProjectGallery
                project={currentProject}
                galleryImagesOnly={galleryImagesOnly}
                blueprints={blueprints}
                video={video}
              />
            </div>

            {/* 2. INFO PRINCIPAL */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">
                    {TYPE_LABELS[currentProject.type] || currentProject.type} en {currentProject.district}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {PHASE_LABELS[currentProject.phase] || currentProject.phase}
                      {deliveryDate && ` · Entrega ${deliveryDate}`}
                    </span>
                    {currentProject.isVerified && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                    )}
                    {currentProject.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">⭐ Destacado</span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{currentProject.name}</h1>

                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    Venta desde {currency} {currentProject.priceFrom?.toLocaleString('en-US')}
                  </p>

                  {currentProject.address && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {currentProject.address}
                    </p>
                  )}
                </div>

                {/* Estrellas de calificación a la derecha */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                  <StarRating
                    projectId={project.id}
                    size="md"
                    showValue
                    onRatingSaved={() => {
                      fetch(`/api/projects/${project.id}/rating`).then(res => {
                        if (res.ok) res.json().then(data => setRating(data));
                      }).catch(() => {});
                    }}
                  />
                  {rating && rating.totalRatings > 0 && (
                    <span className="text-xs text-gray-500">
                      {rating.averageRating.toFixed(1)} ({rating.totalRatings} {rating.totalRatings === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {currentProject.publishedAt
                      ? `Publicado el ${new Date(currentProject.publishedAt).toLocaleDateString('es-PE', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}`
                      : 'Publicado'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {currentProject.totalUnits > 0 && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {currentProject.totalUnits} {currentProject.type === 'LOTIZATION' ? 'lotes' : 'unidades'}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.areaFrom && (
                <div className="flex items-center gap-3">
                  <Maximize className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {currentProject.areaFrom}{currentProject.areaTo ? ` a ${currentProject.areaTo}` : ''} m² {currentProject.type === 'LOTIZATION' ? 'c/u' : 'tot.'}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.type === 'LOTIZATION' ? (
                /* Stats para lotización */
                <>
                  {currentProject.priceFrom && (
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Desde {currency} {currentProject.priceFrom.toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                  )}
                  {(currentProject as any).initialFee && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Inicial {currency} {(currentProject as any).initialFee.toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                  )}
                  {(currentProject as any).monthlyPayment && (
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Cuota {currency} {(currentProject as any).monthlyPayment.toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Stats para departamentos */
                <>
                  {currentProject.floors && (
                    <div className="flex items-center gap-3">
                      <Landmark className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{currentProject.floors} pisos</p>
                      </div>
                    </div>
                  )}
                  {bedroomGroups.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {bedroomGroups[0] === 0
                            ? 'Estudio'
                            : bedroomGroups.length > 1
                            ? `${bedroomGroups[0]} a ${bedroomGroups[bedroomGroups.length - 1]} dorm.`
                            : `${bedroomGroups[0]} dorm.`}
                        </p>
                      </div>
                    </div>
                  )}
                  {(() => {
                    const bathNums = [...new Set(units.filter(u => (u.bathrooms ?? 0) > 0).map(u => u.bathrooms ?? 0))].sort((a,b) => a-b);
                    if (bathNums.length > 0) {
                      return (
                        <div className="flex items-center gap-3">
                          <Bath className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {bathNums.length > 1 ? `${bathNums[0]} a ${bathNums[bathNums.length-1]} baños` : `${bathNums[0]} baño${bathNums[0] > 1 ? 's' : ''}`}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  {(() => {
                    const parkNums = [...new Set(units.filter(u => (u.parkingSpots ?? 0) > 0).map(u => u.parkingSpots ?? 0))].sort((a,b) => a-b);
                    if (parkNums.length > 0) {
                      return (
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {parkNums.length > 1 ? `${parkNums[0]} a ${parkNums[parkNums.length-1]} est.` : `${parkNums[0]} est.`}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </>
              )}
            </div>

            {/* 4. DESCRIPCIÓN - con "Ver más" si supera 100 caracteres */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Sobre el proyecto</h2>
              {currentProject.description && currentProject.description.length > 100 ? (
                <ExpandableDescription text={currentProject.description} />
              ) : (
                <p className="text-gray-600 leading-relaxed">{currentProject.description}</p>
              )}
            </div>

            {/* 4b. REDES SOCIALES - solo las que el desarrollador agregó */}
            {(() => {
              const socialRaw = (currentProject as any).socialMediaUrl;
              if (!socialRaw) return null;
              const socialUrls = socialRaw.split('|').filter(Boolean);
              if (socialUrls.length === 0) return null;
              
              const socialIcons: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
                instagram: {
                  label: 'Instagram',
                  color: '#DD2A7B',
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#ig-grad-det)"><defs><linearGradient id="ig-grad-det" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#F58529"/><stop offset="50%" stopColor="#DD2A7B"/><stop offset="100%" stopColor="#8134AF"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                },
                facebook: {
                  label: 'Facebook',
                  color: '#1877F2',
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                },
                tiktok: {
                  label: 'TikTok',
                  color: '#000',
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                },
                web: {
                  label: 'Sitio Web',
                  color: '#14b8a6',
                  icon: <Globe className="w-5 h-5" />
                }
              };

              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Redes sociales</h2>
                  <div className="flex flex-wrap gap-3">
                    {socialUrls.map((url: string, i: number) => {
                      const domain = url.toLowerCase();
                      let type = 'web';
                      if (domain.includes('instagram')) type = 'instagram';
                      else if (domain.includes('facebook')) type = 'facebook';
                      else if (domain.includes('tiktok')) type = 'tiktok';
                      
                      const social = socialIcons[type] || socialIcons.web;
                      return (
                        <a key={i}
                          href={url.startsWith('http') ? url : `https://${url}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:shadow-md transition-all bg-white hover:-translate-y-0.5"
                          style={{ borderColor: social.color + '40' }}
                        >
                          {social.icon}
                          <span className="text-sm font-medium text-gray-700">{social.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ════════════════════════════════════════
               5. TIPOS DE UNIDADES — REDISEÑO COMPLETO
               ════════════════════════════════════════ */}
            {groupedUnitTypes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Tipos de unidades</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {(() => {
                    const avail = units.filter(u => u.status === 'AVAILABLE').length;
                    const total = units.length;
                    const unitWord = (n: number) => n === 1 ? 'unidad' : 'unidades';
                    const dispWord = (n: number) => n === 1 ? 'disponible' : 'disponibles';
                    return `${avail} ${unitWord(avail)} ${dispWord(avail)} de ${total} ${unitWord(total)} en total`;
                  })()}
                </p>

                {bedroomGroups.length > 1 && (
                  <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    {bedroomGroups.map(beds => (
                      <button
                        key={beds}
                        onClick={() => {
                          setActiveTab(beds);
                          setExpandedGroupKey(null);
                        }}
                        className={`pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                          activeGroup === beds
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {beds === 0 ? 'Estudio / Comercial' : `${beds} Dormitorio${beds > 1 ? 's' : ''}`}
                        <span className="ml-1 text-xs bg-gray-100 text-gray-500 rounded-full px-1.5">
                          {units.filter(u => (u.bedrooms ?? 0) === beds && u.status === 'AVAILABLE').length}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

              <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar" style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
                  {groupedUnitTypes
                    .filter(g => activeGroup === null || (g.units[0].bedrooms ?? 0) === activeGroup)
                    .map(({ units: groupUnits, key }) => {
                      const sample = groupUnits[0];
                      const available = groupUnits.filter(u => u.status === 'AVAILABLE').length;
                      const reserved = groupUnits.filter(u => u.status === 'RESERVED').length;
                      const sold = groupUnits.filter(u => u.status === 'SOLD').length;
                      const blueprintImageUrl = getGroupBlueprintImage(groupUnits);
                      const isGroup = groupUnits.length > 1;

                      const groupLabel = (() => {
                        const parts = sample.unitNumber?.split('-') || [];
                        if (parts.length >= 3) return parts.slice(0, -2).join(' ');
                        return `${sample.bedrooms ?? 0} dorm · ${sample.area ?? 0}m²`;
                      })();

                      const waPhone = currentProject.developer?.phone?.replace(/\D/g, '') || '';
                      const waMsg = encodeURIComponent(
                        `Hola, estoy interesado en la unidad *${sample.unitNumber}* del proyecto *${currentProject.name}*.\n` +
                        `• Área: ${sample.area ?? 0} m²\n• Precio: ${currency} ${(sample.price ?? 0).toLocaleString()}\n¿Podría darme más información?`
                      );

                      return (
                        <div key={key} className="border border-gray-200 rounded-2xl bg-white hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col overflow-hidden min-w-[180px] sm:min-w-[220px] max-w-[260px]">
                          {/* Imagen */}
                          <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                            {blueprintImageUrl ? (
                              <img src={blueprintImageUrl} alt={groupLabel}
                                className="w-full h-full object-contain p-2"
                                key={blueprintImageUrl}
                              />
                            ) : (
                              <div className="text-center">
                                <Home className="w-8 h-8 text-gray-300 mx-auto mb-0.5" />
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                                  {sample.type === 'APARTMENT' ? 'Departamento' :
                                   sample.type === 'LOT' ? 'Lote' :
                                   sample.type === 'PENTHOUSE' ? 'Penthouse' : sample.type || 'Unidad'}
                                </p>
                              </div>
                            )}
                            {/* Badges */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                              {isGroup && (
                                <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {groupUnits.length} unid.
                                </span>
                              )}
                              {available > 0 && (
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {available} disp.
                                </span>
                              )}
                              {reserved > 0 && (
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full">
                                  {reserved} res.
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="p-3 flex flex-col flex-1 gap-1.5">
                            <p className="font-bold text-gray-900 text-xs capitalize truncate">{groupLabel}</p>

                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-500">
                              {(sample.bedrooms ?? 0) > 0 && <span>{sample.bedrooms} dorm</span>}
                              {(sample.bathrooms ?? 0) > 0 && <span>{sample.bathrooms} baños</span>}
                              <span>{sample.area ?? 0} m²</span>
                              {(sample.parkingSpots ?? 0) > 0 && <span>{sample.parkingSpots} est.</span>}
                            </div>

                            <p className="font-bold text-gray-900 text-sm mt-auto">
                              {currency} {(sample.price ?? 0).toLocaleString('en-US')}
                            </p>

                            <div className="flex gap-1.5 mt-1">
                              <a href={`https://wa.me/${waPhone}?text=${waMsg}`}
                                target="_blank" rel="noopener noreferrer"
                                suppressHydrationWarning
                                className="flex-1 bg-green-500 text-white text-[10px] font-medium py-1.5 rounded-lg text-center hover:bg-green-600 transition">
                                WhatsApp
                              </a>
                              <button onClick={() => setSelectedUnit(sample)}
                                className="flex-1 border border-gray-200 text-gray-600 text-[10px] font-medium py-1.5 rounded-lg hover:bg-gray-50 transition">
                                Detalle
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 6. AMENIDADES - solo las seleccionadas con nombre */}
            {(() => {
              const validAmenities = (currentProject.amenities as any[] || []).filter(a => {
                const name = typeof a === 'string' ? a : a?.name;
                return name && name.trim().length > 0;
              });
              if (validAmenities.length === 0) return null;
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Amenidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {validAmenities.map((amenity, i) => {
                      const name = typeof amenity === 'string' ? amenity : amenity.name;
                      return (
                        <span key={i} className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100">
                          <span className="text-green-600 font-bold">✓</span>
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 7. TIMELINE */}
            {currentProject.timeline && currentProject.timeline.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cronograma del proyecto</h2>
                <div className="relative border-l-2 border-blue-200 pl-6 space-y-6">
                  {currentProject.timeline.map((milestone, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[29px] w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(milestone.date).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })}
                      </p>
                      <p className="font-semibold text-gray-800">{milestone.phase}</p>
                      {milestone.description && (
                        <p className="text-sm text-gray-500">{milestone.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. UBICACIÓN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Ubicación del proyecto</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                {currentProject.fullAddress ||
                  currentProject.address ||
                  `${currentProject.street ? currentProject.street + ' ' : ''}${currentProject.streetNumber || ''}, ${currentProject.district}, ${currentProject.province}`}
              </p>

              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-72">
                {process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? (
                  <>
                    {currentProject.latitude && currentProject.longitude ? (
                      <iframe
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&q=${currentProject.latitude},${currentProject.longitude}&zoom=16`}
                      />
                    ) : currentProject.fullAddress || currentProject.address ? (
                      <iframe
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&q=${encodeURIComponent(
                          currentProject.fullAddress || currentProject.address || `${currentProject.district}, ${currentProject.province}, Perú`
                        )}&zoom=16`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        Sin coordenadas ni dirección
                      </div>
                    )}
                  </>
                ) : (
                  <iframe
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentProject.longitude ? currentProject.longitude - 0.01 : '-77.0428'},${currentProject.latitude ? currentProject.latitude - 0.01 : '-12.0464'},${currentProject.longitude ? currentProject.longitude + 0.01 : '-77.0428'},${currentProject.latitude ? currentProject.latitude + 0.01 : '-12.0464'}&layer=mapnik&marker=${currentProject.latitude || '-12.0464'},${currentProject.longitude || '-77.0428'}`}
                  />
                )}
              </div>

              {/* Comentarios del proyecto */}
              <div className="border-t border-gray-100 mt-6 pt-6">
                <ProjectComments projectId={currentProject.id} />
              </div>
            </div>

          </div>

          {/* ════════════════════════════════════════
              SIDEBAR (1/3) — sticky
          ════════════════════════════════════════ */}
          <div className="lg:col-span-3">
            <ProjectContactSidebar
              project={currentProject}
              units={units}
              currency={currency}
            />
          </div>

          {/* 9. PROYECTOS SIMILARES (al final, después del contacto en mobile) */}
          <div className="col-span-1 lg:col-span-12 mt-2">
            <SimilarProjects currentProject={currentProject} />
          </div>

        </div>
      </div>

      {/* ── MODAL DETALLE DE UNIDAD ── */}
      {selectedUnit && (() => {
        const whatsappPhone = currentProject.developer?.phone?.replace(/\D/g, '') || '';
        const whatsappMsg = encodeURIComponent(
          `Hola, estoy interesado en la unidad *${selectedUnit.unitNumber}* del proyecto *${currentProject.name}*.\n` +
          `• Tipo: ${selectedUnit.type}\n` +
          `• Piso: ${selectedUnit.floor}\n` +
          `• Área: ${selectedUnit.area} m²\n` +
          `• Dormitorios: ${selectedUnit.bedrooms ?? '-'}\n` +
          `• Baños: ${selectedUnit.bathrooms}\n` +
          `• Estacionamientos: ${selectedUnit.parkingSpots}\n` +
          `• Vista: ${selectedUnit.view || 'No especificada'}\n` +
          `• Precio: ${currency} ${selectedUnit.price.toLocaleString()}\n\n` +
          `¿Podría darme más información?`
        );
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`;

        return (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedUnit(null); }}>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedUnit.unitNumber}</h3>
                  <p className="text-xs text-gray-400">{currentProject.name}</p>
                </div>
                <button onClick={() => setSelectedUnit(null)}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-52 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                {(selectedUnit as any).blueprintImage ? (
                  <img src={(selectedUnit as any).blueprintImage} alt={`Plano ${selectedUnit.unitNumber}`}
                    className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center text-gray-300">
                    <FileText className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">Plano no disponible</p>
                  </div>
                )}
                <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-bold ${
                  selectedUnit.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                  selectedUnit.status === 'RESERVED'  ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                }`}>
                  {selectedUnit.status === 'AVAILABLE' ? 'Disponible' :
                   selectedUnit.status === 'RESERVED'  ? 'Reservado' : 'Vendido'}
                </span>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedUnit.type === 'LOT' ? (
                    /* Info para lotes */
                    <>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Building className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Lote</p>
                        <p className="font-bold text-gray-800 text-sm">{(selectedUnit as any).lotNumber || (selectedUnit as any).unitNumber || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Maximize className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Área</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUnit.area} m²</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Tag className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Manzana</p>
                        <p className="font-bold text-gray-800 text-sm">{(selectedUnit as any).block || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><ShoppingCart className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Frente</p>
                        <p className="font-bold text-gray-800 text-sm">{(selectedUnit as any).frontWidth || '-'} ml</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Calendar className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Estado</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {selectedUnit.status === 'AVAILABLE' ? 'Disponible' :
                           selectedUnit.status === 'RESERVED' ? 'Reservado' : 'Vendido'}
                        </p>
                      </div>
                    </>
                  ) : (
                    /* Info para departamentos */
                    <>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Building className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Piso</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUnit.floor}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Maximize className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Área</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUnit.area} m²</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Tag className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Tipo</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {selectedUnit.type === 'APARTMENT' ? 'Depto' :
                           selectedUnit.type === 'PENTHOUSE' ? 'PH' :
                           selectedUnit.type === 'DUPLEX' ? 'Dúplex' :
                           selectedUnit.type === 'OFFICE' ? 'Oficina' : selectedUnit.type}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Calendar className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Dormitorios</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUnit.bedrooms ?? '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><Bath className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Baños</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUnit.bathrooms}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="mb-1"><ShoppingCart className="w-5 h-5 text-gray-400 mx-auto" /></div>
                        <p className="text-xs text-gray-400 mt-0.5">Estac.</p>
                        <p className="font-bold text-gray-800 text-sm">{selectedUnit.parkingSpots}</p>
                      </div>
                    </>
                  )}
                </div>

                {selectedUnit.view && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <Menu className="w-4 h-4 text-gray-400" />
                    <span>{selectedUnit.type === 'LOT' ? 'Ubicación' : 'Vista'}: <strong>{selectedUnit.view}</strong></span>
                  </div>
                )}

                <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-blue-500 font-medium">Precio de venta</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {currency} {selectedUnit.price.toLocaleString('en-US')}
                    </p>
                  </div>
                  {currentProject.developer?.phone && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Vendedor</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {currentProject.developer.companyName || 'Desarrollador'}
                      </p>
                      <p className="text-xs text-gray-500">{currentProject.developer.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Escribir por WhatsApp
                </a>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}