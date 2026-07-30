'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/core/domain/entities/Property';
import { PropertyGallery } from '../PropertyGallery/PropertyGallery';
import { PropertyQuickInfo } from './PropertyQuickInfo';
import { PropertyLocation } from './PropertyLocation';
import { PropertyComments } from './PropertyComments';
import { ContactForm } from '../../shared/ContactForm/ContactForm';
import { WhatsAppButton } from './WhatsAppButton';
import { FavoriteButton } from '../../shared/FavoriteButton/FavoriteButton';
import { ShareButton } from '../../shared/ShareButton/ShareButton';
import { SimilarProperties } from '../SimilarProperties';
import { PersonalizedRecommendations } from '../PersonalizedRecommendations';
import { FeaturePropertyButton } from './FeaturePropertyButton';
import { Star, MapPin, FileText, Calendar } from 'lucide-react';
import { StarRating } from './StarRating';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/infrastructure/storage/auth-storage';

interface PropertyDetailProps {
  property: Property;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Departamento',
  HOUSE: 'Casa',
  LAND: 'Terreno',
  OFFICE: 'Oficina',
  COMMERCIAL: 'Local Comercial',
  ROOM: 'Habitación',
};

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
};

function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const words = description.split(/\s+/);
  const isLong = words.length > 50;
  const truncated = isLong ? words.slice(0, 50).join(' ') + '...' : description;

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
      <h2 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
        Descripción de la propiedad
      </h2>
      <div className="text-[var(--text-primary)] leading-relaxed text-sm whitespace-pre-wrap">
        {expanded ? description : truncated}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  // Trackear vista en CRM automáticamente
  useEffect(() => {
    if (!property.id) return;
    const trackView = async () => {
      try {
        const token = authStorage.getToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch(`/api/properties/${property.id}/view`, { method: 'POST', headers });
      } catch { /* silently fail */ }
    };
    trackView();
  }, [property.id]);

  const [rating, setRating] = useState<{ averageRating: number; totalRatings: number } | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/properties/${property.id}/rating`);
        if (res.ok) {
          const data = await res.json();
          setRating(data);
        }
      } catch {
        // Silently fail
      }
    };
    fetchRating();
  }, [property.id]);

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? 'US$' : 'S/';
    return `${symbol} ${price.toLocaleString('es-PE')}`;
  };

  const propertyTypeLabel = PROPERTY_TYPE_LABELS[property.type] || property.type;
  const transactionLabel  = TRANSACTION_TYPE_LABELS[property.transactionType] || property.transactionType;

  const locationLine = [
    property.location?.fullAddress,
    property.location?.district,
    property.location?.province,
  ].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">

      <div className="w-full px-8 xl:px-16 py-6">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ════════════════════════════════════════
              COLUMNA PRINCIPAL  (2 / 3)
          ════════════════════════════════════════ */}
          <div className="lg:col-span-9 space-y-4">

            {/* ── Botones encima de galería ── */}
            <div className="flex items-center justify-end gap-1">
              <FavoriteButton propertyId={property.id} variant="topbar" />
              <ShareButton variant="topbar" />
            </div>

            {/* 1. GALERÍA */}
            <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] shadow-[0_1px_2px_var(--shadow-color)] -mt-2">
              <PropertyGallery media={property.media} coverPhotoUrl={property.coverPhotoUrl} />
            </div>

            {/* 2. TIPO · PRECIO · TÍTULO · DIRECCIÓN · STATS */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                      {propertyTypeLabel}
                    </span>
                    <span className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                      {transactionLabel}
                    </span>
                    {property.isNegotiable && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                         Negociable
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] leading-tight mb-4 break-words">
                    {property.title}
                  </h1>

                  <div className="flex items-baseline gap-3 flex-wrap mb-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      {formatPrice(property.price, property.currency)}
                      {property.transactionType === 'RENT' && (
                        <span className="text-lg font-medium text-[var(--text-secondary)] ml-1">/ mes</span>
                      )}
                    </h2>
                    {property.pricePerSqm && (
                      <span className="text-sm text-[var(--text-secondary)] font-medium bg-[var(--bg-secondary)] px-2 py-1 rounded-md border border-[var(--border-color)]">
                        {formatPrice(property.pricePerSqm, property.currency)} / m²
                      </span>
                    )}
                  </div>

                  {locationLine && (
                    <p className="text-base text-[var(--text-secondary)] flex items-center gap-2 font-medium">
                      <MapPin className="w-5 h-5 text-[var(--text-tertiary)]" />
                      {locationLine}
                    </p>
                  )}
                </div>

                {/* Estrellas de calificación a la derecha */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                  <StarRating
                    propertyId={property.id}
                    size="md"
                    showValue
                    averageRating={rating?.averageRating || 0}
                    totalRatings={rating?.totalRatings || 0}
                    onRatingSaved={() => {
                      fetch(`/api/properties/${property.id}/rating`).then(res => {
                        if (res.ok) res.json().then(data => setRating(data));
                      }).catch(() => {});
                    }}
                  />
                  {rating && rating.totalRatings > 0 && (
                    <span className="text-xs text-[var(--text-secondary)]">
                      {rating.averageRating.toFixed(1)} ({rating.totalRatings} {rating.totalRatings === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  )}
                </div>
              </div>

              {/* Stats — UNA SOLA VEZ aquí */}
              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <PropertyQuickInfo property={property} />
              </div>
            </div>

            {/* 3. DESCRIPCIÓN — ANTES del mapa, siempre visible */}
            {property.description && (
              <DescriptionSection description={property.description} />
            )}
            
            {/* Si no hay descripción */}
            {!property.description && (
              <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                 <p className="text-[var(--text-tertiary)] font-medium">El anunciante no ha proporcionado una descripción detallada.</p>
              </div>
            )}

            {/* 4. MAPA — después de la descripción */}
            <PropertyLocation location={property.location} propertyId={property.id} />

            {/* 5. CONTACTA AL ANUNCIANTE — solo móvil */}
            <div className="lg:hidden space-y-4">
              <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_4px_6px_var(--shadow-color)] border border-[var(--border-color)] overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-[var(--border-light)]">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Contacta al anunciante</h3>
                </div>
                <div className="px-6 py-4">
                  <ContactForm propertyId={property.id} ownerId={property.owner.id} />
                </div>
                <div className="px-6 pb-6 pt-2">
                  <WhatsAppButton property={property} className="w-full" />
                </div>
              </div>
            </div>

            {/* 6. ANUNCIANTE + ESTADÍSTICAS + CALIFICAR — solo móvil (DEBE IR ANTES DE SIMILARES) */}
            <div className="lg:hidden space-y-4">
              {/* Anunciante */}
              <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Anunciante</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-inner">
                    {property.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text-primary)] text-base truncate">{property.owner.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{property.owner.role}</p>
                  </div>
                  {(property.owner as any).phone && (
                    <a
                      href={`tel:${(property.owner as any).phone}`}
                      className="text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold rounded-lg px-3 py-2 whitespace-nowrap transition-colors"
                    >
                      Llamar
                    </a>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-3">Estadísticas</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: property.viewsCount    ?? 0, l: 'Visitas'   },
                    { v: property.favoritesCount ?? 0, l: 'Favoritos' },
                    { v: property.contactsCount  ?? 0, l: 'Contactos' },
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                      <div className="text-xl font-bold text-[var(--text-primary)]">{v}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>

                {rating && rating.totalRatings > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(rating.averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-[var(--text-tertiary)]'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-[var(--text-primary)]">{rating.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">({rating.totalRatings} {rating.totalRatings === 1 ? 'reseña' : 'reseñas'})</span>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  Publicado el {new Date(property.createdAt).toLocaleDateString('es-PE', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>

              {/* Calificar propiedad */}
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-3">Calificar propiedad</h3>
                <div className="flex flex-col items-center gap-2">
                  <StarRating
                    propertyId={property.id}
                    size="md"
                    showValue
                    averageRating={rating?.averageRating || 0}
                    totalRatings={rating?.totalRatings || 0}
                    onRatingSaved={() => {
                      fetch(`/api/properties/${property.id}/rating`).then(res => {
                        if (res.ok) res.json().then(data => setRating(data));
                      }).catch(() => {});
                    }}
                  />
                  {rating && rating.totalRatings > 0 && (
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Promedio: {rating.averageRating.toFixed(1)} ({rating.totalRatings} {rating.totalRatings === 1 ? 'voto' : 'votos'})
                    </p>
                  )}
                  {(!rating || rating.totalRatings === 0) && (
                    <p className="text-xs text-[var(--text-tertiary)]">Sé el primero en calificar</p>
                  )}
                </div>
              </div>
            </div>

            {/* 7. COMENTARIOS DE LA ZONA */}
            <PropertyComments propertyId={property.id} location={property.location} />

            {/* 7. SIMILARES */}
            <SimilarProperties currentProperty={property} />

            {/* 8. RECOMENDACIONES */}
            <PersonalizedRecommendations 
              title="Más recomendaciones para ti" 
              properties={[]}
              currentPropertyId={property.id}
              currentTransactionType={property.transactionType}
              currentDistrict={property.location?.district}
              currentProvince={property.location?.province}
              currentType={property.type}
            />
          </div>
          {/* Sidebar — oculta en móvil (se muestra en columna principal con lg:hidden) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-4 space-y-4">

              {/* Contactar */}
              <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_4px_6px_var(--shadow-color)] border border-[var(--border-color)] overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-[var(--border-light)]">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Contacta al anunciante</h3>
                </div>
                <div className="px-6 py-4">
                  <ContactForm propertyId={property.id} ownerId={property.owner.id} />
                </div>
                <div className="px-6 pb-6 pt-2">
                  <WhatsAppButton property={property} className="w-full" />
                </div>
              </div>

              {/* Agente */}
              <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Anunciante</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-inner">
                    {property.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text-primary)] text-base truncate">{property.owner.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{property.owner.role}</p>
                  </div>
                  {(property.owner as any).phone && (
                    <a
                      href={`tel:${(property.owner as any).phone}`}
                      className="text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold rounded-lg px-3 py-2 whitespace-nowrap transition-colors"
                    >
                      Llamar
                    </a>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-3">Estadísticas</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: property.viewsCount    ?? 0, l: 'Visitas'   },
                    { v: property.favoritesCount ?? 0, l: 'Favoritos' },
                    { v: property.contactsCount  ?? 0, l: 'Contactos' },
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                      <div className="text-xl font-bold text-[var(--text-primary)]">{v}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>

                {rating && rating.totalRatings > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(rating.averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-[var(--text-tertiary)]'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-[var(--text-primary)]">{rating.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">({rating.totalRatings} {rating.totalRatings === 1 ? 'reseña' : 'reseñas'})</span>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  Publicado el {new Date(property.createdAt).toLocaleDateString('es-PE', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>

              <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-3">Calificar propiedad</h3>
                <div className="flex flex-col items-center gap-2">
                  <StarRating
                    propertyId={property.id}
                    size="md"
                    showValue
                    averageRating={rating?.averageRating || 0}
                    totalRatings={rating?.totalRatings || 0}
                    onRatingSaved={() => {
                      fetch(`/api/properties/${property.id}/rating`).then(res => {
                        if (res.ok) res.json().then(data => setRating(data));
                      }).catch(() => {});
                    }}
                  />
                  {rating && rating.totalRatings > 0 && (
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Promedio: {rating.averageRating.toFixed(1)} ({rating.totalRatings} {rating.totalRatings === 1 ? 'voto' : 'votos'})
                    </p>
                  )}
                  {(!rating || rating.totalRatings === 0) && (
                    <p className="text-xs text-[var(--text-tertiary)]">Sé el primero en calificar</p>
                  )}
                </div>
              </div>

              <FeaturePropertyButton 
                propertyId={property.id}
                ownerId={property.owner.id}
                isFeatured={property.isFeatured}
                status={property.status}
              />

            </div>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}