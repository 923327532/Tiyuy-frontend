'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, Star, AlertCircle, Clock, MessageCircle, MessageCircleMore } from 'lucide-react';
import type { Property, PropertySummary } from '@/core/domain/entities/Property';
import { FavoriteButton } from '@/presentation/components/shared/FavoriteButton';
import { LazyImage } from '@/presentation/components/ui/LazyImage/LazyImage';

interface PropertyCardProps {
  property: Property | PropertySummary;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
}

function isFullProperty(property: Property | PropertySummary): property is Property {
  return 'seo' in property && property.seo !== undefined;
}

function getPropertySlug(property: Property | PropertySummary): string {
  if (isFullProperty(property)) {
    return property.seo?.slug ?? String(property.id);
  }
  return property.slug ?? String(property.id);
}

export function PropertyCard({ property }: PropertyCardProps) {
  const commentCount: number | null = null;
  const [rating, setRating] = useState<RatingData | null>(null);

  // Cargar rating de la propiedad
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

  const PROPERTY_TYPE_LABELS: Record<string, string> = {
    APARTMENT: 'Departamento',
    HOUSE: 'Casa',
    LAND: 'Terreno',
    OFFICE: 'Oficina',
    COMMERCIAL: 'Local Comercial',
    ROOM: 'Habitacion',
  };

  const TRANSACTION_TYPE_LABELS: Record<string, string> = {
    SALE: 'Venta',
    RENT: 'Alquiler',
  };
  
  // En producción cargar imágenes directo de CloudFront/S3 (más rápido)
  // En desarrollo usar proxy para evitar CORS
  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return '';
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return `/api/images/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? 'US$' : 'S/';
    return `${symbol} ${price.toLocaleString('es-PE')}`;
  };

  const renderLifecycleBadge = () => {
    const lifecycleStatus = property.lifecycleStatus;
    const remainingDays = property.remainingGraceDays;

    if (lifecycleStatus === 'GRACE_PERIOD' && remainingDays !== undefined && remainingDays > 0) {
      return (
        <div className="absolute bottom-3 left-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Plan vencido - {remainingDays} dias para renovar</span>
        </div>
      );
    }

    if (lifecycleStatus === 'PENDING_DELETION' || lifecycleStatus === 'DELETED') {
      return (
        <div className="absolute bottom-3 left-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Propiedad eliminada</span>
        </div>
      );
    }

    if (property.status === 'PAUSED') {
      return (
        <div className="absolute bottom-3 left-3 right-3 bg-gray-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Inactiva - requiere renovacion</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="group flex flex-col w-full h-full cursor-pointer overflow-hidden">
      <Link href={`/property/${getPropertySlug(property)}`} className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 block">
        {property.coverPhotoUrl ? (
          <LazyImage
            src={getImageUrl(property.coverPhotoUrl)}
            alt={property.title || ''}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-5xl">🏠</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent opacity-50" />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {property.isFeatured && (
            <div className="bg-white text-gray-900 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              Destacado
            </div>
          )}
          {property.isVerified && (
            <div className="bg-white text-gray-900 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
              Verificado
            </div>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <div className="hover:scale-110 transition-transform drop-shadow-md scale-90 sm:scale-100">
            <FavoriteButton propertyId={property.id} />
          </div>
        </div>

        {renderLifecycleBadge()}
      </Link>

      <Link href={`/property/${getPropertySlug(property)}`} className="flex flex-col flex-grow mt-0.5 w-full min-w-0 overflow-hidden">
        <div className="flex justify-between items-start gap-1.5 w-full min-w-0">
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 truncate flex-1 min-w-0">
            {PROPERTY_TYPE_LABELS[property.type] || 'Propiedad'} en {'location' in property ? property.location?.district : property.district || 'Ubicación'}
          </h3>
          <div className="flex items-center gap-0.5 sm:gap-1 text-[13px] sm:text-[14px] text-gray-900 flex-shrink-0 min-w-fit pl-0.5">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-amber-400 fill-amber-400" />
            <span className="whitespace-nowrap select-none">
              {rating && rating.averageRating > 0 ? rating.averageRating.toFixed(1) : 'Nuevo'}
            </span>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] text-gray-500 truncate mt-0.5 w-full">
          {[
            property.bedrooms && `${property.bedrooms} camas`,
            property.bathrooms && `${property.bathrooms} baños`,
            property.totalArea && `${property.totalArea} m²`
          ].filter(Boolean).join(' · ')}
        </p>

        <div className="mt-0.5 flex items-center justify-between w-full">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[14px] sm:text-[15px] font-semibold text-gray-900 truncate">
              {formatPrice(property.price, property.currency)}
            </span>
            <span className="text-[14px] sm:text-[15px] text-gray-900 whitespace-nowrap">
              {property.transactionType === 'RENT' ? ' / mes' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Botón Contactar estilo WhatsApp - usa span porque ya está dentro de un Link */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-brand hover:bg-brand-dark px-2.5 py-1 rounded-md transition-colors shadow-sm cursor-default">
              <MessageCircleMore className="w-3.5 h-3.5" />
              Contactar
            </span>

            {commentCount !== null && commentCount > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <MessageCircle className="w-2.5 h-2.5" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}