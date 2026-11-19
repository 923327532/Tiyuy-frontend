'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Building2, Home, Ruler, DollarSign, ArrowRight } from 'lucide-react';
import { PromotionCampaign } from '@/core/domain/entities/Admin';
import { publicApiClient } from '@/infrastructure/api/axios-client';

const MAX_VISIBLE_CARDS = 10;

/**
 * FeaturedCampaigns - Grid de campañas activas estilo portales inmobiliarios premium
 * Se muestra en la Home Page
 * Diseño: 6 columnas en desktop, 3 en tablet, 1 en mobile
 * Logo de inmobiliaria superpuesto en la imagen (esquina superior izquierda)
 * Card compacta para maximizar visibilidad
 */
export function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await publicApiClient.get('/v1/public/marketing/campaigns/active');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching active campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-16 bg-background border-b border-[var(--border-light)]">
        <div className="w-full max-w-[1920px] mx-auto px-8 xl:px-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-72 bg-[var(--bg-tertiary)] rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[340px] bg-[var(--bg-tertiary)] rounded-[18px]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return null;
  }

  const displayCampaigns = campaigns.slice(0, MAX_VISIBLE_CARDS);
  const showViewAllCard = campaigns.length > MAX_VISIBLE_CARDS;

  return (
    <section className="py-8 sm:py-16 bg-background border-b border-[var(--border-light)]">
      <div className="w-full max-w-[1920px] mx-auto px-8 xl:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 rounded-xl p-2.5">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Proyectos Destacados de la Semana
              </h2>
              <p className="text-sm text-foreground/60">
                Las mejores promociones de inmobiliarias y agentes
              </p>
            </div>
          </div>
          <Link
            href="/campaigns"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover transition-colors"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid de campañas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-6">
          {displayCampaigns.map((campaign) => {
            const entityName = campaign.targetProjectName || campaign.targetPropertyName || campaign.title;
            const entityType = campaign.targetProjectId ? 'Proyecto' : campaign.targetPropertyId ? 'Propiedad' : 'Promoción';
            const entityIcon = campaign.targetProjectId ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />;

            // Usar datos enriquecidos del proyecto si están disponibles
            const locationText = campaign.projectDistrict || campaign.placementLocation || 'Perú';
            const projectTypeLabel = campaign.projectType || entityType;
            const areaText = campaign.projectAreaFrom;
            const priceText = campaign.projectPriceFrom
              ? `Desde ${campaign.projectPriceCurrency === 'USD' ? '$' : 'S/'} ${Number(campaign.projectPriceFrom).toLocaleString()}`
              : null;

            let targetUrl = campaign.linkUrl || '/campaigns';

            return (
              <Link
                key={campaign.id}
                href={targetUrl}
                className="group block"
              >
                <div className="bg-[var(--bg-card)] rounded-[18px] shadow-sm hover:shadow-lg transition-all duration-250 overflow-hidden h-full hover:-translate-y-1 flex flex-col">
                  {/* Imagen - 160px height con logo superpuesto */}
                  <div className="relative w-full h-[160px] overflow-hidden rounded-t-[18px] flex-shrink-0">
                    {campaign.imageUrl ? (
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                        <Star className="w-12 h-12 text-emerald-300" />
                      </div>
                    )}

                    {/* Logo de inmobiliaria superpuesto - esquina superior izquierda */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {campaign.ownerLogoUrl ? (
                        <div
                          className="w-9 h-9 rounded-[10px] overflow-hidden shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', padding: '4px' }}
                        >
                          <img
                            src={campaign.ownerLogoUrl}
                            alt={campaign.ownerName || 'Logo'}
                            className="w-full h-full object-cover rounded-[6px]"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}
                        >
                          <Building2 className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                      )}
                    </div>

                    {/* Nombre de inmobiliaria sobre la imagen - esquina superior derecha */}
                    {campaign.ownerName && (
                      <div className="absolute top-3 right-3">
                        <span
                          className="text-[11px] font-semibold px-2 py-1 rounded-md"
                          style={{
                            color: 'white',
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                            background: 'rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {campaign.ownerName}
                        </span>
                      </div>
                    )}

                    {/* Badge Premium - esquina inferior izquierda sobre la imagen */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-semibold shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-[#059669]" />
                        7 Días Premium
                      </span>
                    </div>
                  </div>

                  {/* Bloque de información - compacto */}
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    {/* Nombre del proyecto */}
                    <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight line-clamp-1">
                      {entityName}
                    </h3>

                    {/* Descripción corta - 1 línea */}
                    {campaign.description && (
                      <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-1">
                        {campaign.description.length > 80
                          ? campaign.description.substring(0, 80) + '...'
                          : campaign.description}
                      </p>
                    )}

                    {/* Información rápida - 2 líneas máximo */}
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-auto">
                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[100px]">{locationText}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                        {entityIcon}
                        <span className="truncate max-w-[80px]">{projectTypeLabel}</span>
                      </div>
                      {areaText && (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                          <Ruler className="w-3 h-3 flex-shrink-0" />
                          <span>{areaText}</span>
                        </div>
                      )}
                      {priceText && (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                          <DollarSign className="w-3 h-3 flex-shrink-0" />
                          <span className="font-semibold text-emerald-600">{priceText}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer compacto */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border-light)] mt-1">
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {campaign.endDate
                          ? `Hasta ${new Date(campaign.endDate).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}`
                          : '7 días'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Tarjeta "Ver todo" */}
          {showViewAllCard && (
            <Link
              href="/campaigns"
              className="group block"
            >
              <div className="bg-[var(--bg-card)] rounded-[18px] border-2 border-dashed border-[var(--border-color)] hover:border-emerald-400 hover:bg-emerald-50/30 hover:dark:bg-emerald-950/20 transition-all duration-250 overflow-hidden h-full flex flex-col items-center justify-center min-h-[340px] cursor-pointer hover:scale-[1.03]">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                    <ArrowRight className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-[16px] font-bold text-[var(--text-primary)] mb-1">
                    Ver todos los proyectos
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Explora todas las campañas disponibles
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
