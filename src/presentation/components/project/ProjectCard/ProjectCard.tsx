'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, Clock, AlertCircle, Star, MessageCircle, MessageCircleMore, Calendar } from 'lucide-react';
import type { Project, ProjectSummary } from '@/core/domain/entities/Project';
import { LazyImage } from '@/presentation/components/ui/LazyImage/LazyImage';
import { formatDistanceToNow } from '@/utils/formatters';

interface ProjectCardProps {
  project: Project | ProjectSummary;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
}

function getProjectSlug(project: Project | ProjectSummary): string {
  return project.slug ?? String(project.id);
}

function getPublishedDate(publishedAt?: Date | string): Date | null {
  if (!publishedAt) return null;
  const date = typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt;
  return isNaN(date.getTime()) ? null : date;
}

function getDaysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Proyecto Residencial',
  COMMERCIAL: 'Proyecto Comercial',
  MIXED_USE: 'Proyecto Mixto',
  INDUSTRIAL: 'Proyecto Industrial',
};

const PHASE_LABELS: Record<string, string> = {
  PRE_SALE: 'Preventa',
  SALE: 'En venta',
  DELIVERY: 'Entrega inmediata',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [rating, setRating] = useState<RatingData | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}/rating`);
        if (res.ok) {
          const data = await res.json();
          setRating(data);
        }
      } catch {
        // Silently fail
      }
    };
    fetchRating();
  }, [project.id]);

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol} ${price.toLocaleString('es-PE')}`;
  };

  const publishedDate = getPublishedDate(project.publishedAt);
  const publishedLabel = publishedDate ? formatDistanceToNow(publishedDate, { addSuffix: true }) : null;
  const isNew = publishedDate ? getDaysSince(publishedDate) <= 7 : false;
  const publishedDateLabel = publishedDate
    ? publishedDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;
  const publishedText = publishedDateLabel ? `Publicado el ${publishedDateLabel}` : null;

  const renderLifecycleBadge = () => {
    const lifecycleStatus = project.lifecycleStatus;
    const remainingDays = project.remainingGraceDays;

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
          <span>Proyecto eliminado</span>
        </div>
      );
    }

    if (project.status === 'PAUSED') {
      return (
        <div className="absolute bottom-3 left-3 right-3 bg-gray-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Inactivo - requiere renovacion</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="group flex flex-col w-full h-full min-w-0 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--bg-card)] shadow-[0_8px_30px_var(--shadow-color)] hover:shadow-[0_15px_45px_var(--shadow-color)] hover:-translate-y-1 transition-all duration-300">
      <Link href={`/projects/${getProjectSlug(project)}`} className="relative w-full overflow-hidden rounded-t-2xl aspect-[3/2] sm:aspect-[4/3]">
        {project.coverImageUrl ? (
          <LazyImage
            src={`/api/images/proxy?url=${encodeURIComponent(project.coverImageUrl)}`}
            alt={project.name || ''}
            className="w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--bg-tertiary)]">
            <span className="text-[var(--text-muted)] text-6xl">🏗️</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent opacity-50" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {project.isFeatured && (
            <div className="bg-[#1FA64A] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm tracking-wide">
              Destacado
            </div>
          )}
          {project.isVerified && (
            <div className="bg-[var(--bg-card)] text-[var(--text-primary)] text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-blue-500" />
              Verificado
            </div>
          )}
          {!project.isFeatured && !project.isVerified && isNew && (
            <div className="bg-[var(--bg-card)] text-[var(--text-primary)] text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md">
              Nuevo
            </div>
          )}
        </div>

        {renderLifecycleBadge()}
      </Link>

      <Link href={`/projects/${getProjectSlug(project)}`} className="flex flex-col flex-grow px-3 pt-2.5 pb-3 w-full min-w-0 overflow-hidden">
        <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-1.5 w-full min-w-0">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-1 sm:line-clamp-2 flex-1 min-w-0 h-[19px] sm:h-[34px]">
            {project.name}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] flex-shrink-0">
            <span className="text-[#FBBF24] text-xs leading-none">⭐</span>
            <span className="font-medium">{rating && rating.averageRating > 0 ? rating.averageRating.toFixed(1) : 'Nuevo'}</span>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 w-full truncate h-[16px] flex items-center gap-1">
          <svg className="w-3 h-3 text-[#EF4444] flex-shrink-0" viewBox="0 0 24 24" fill="#EF4444" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {PROJECT_TYPE_LABELS[project.type] || 'Proyecto'} en {project.district || 'Perú'}
        </p>

        <div className="w-full h-px bg-[var(--border-color)] my-1 sm:my-1.5" />

        <p className="text-[11px] text-[var(--text-secondary)] w-full truncate h-[16px]">
          {PHASE_LABELS[project.phase] || project.phase} · {project.availableUnits} unid. disponibles
        </p>

        <div className="w-full h-px bg-[var(--border-color)] my-1 sm:my-1.5" />

        {publishedText && (
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--text-muted)] mb-1.5">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium truncate">{isNew ? 'Recién publicado' : publishedText}</span>
          </div>
        )}

        <div className="flex items-center justify-between w-full h-[22px]">
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="text-[15px] font-bold text-[var(--brand-primary)] leading-tight truncate">
              Desde {formatPrice(project.priceFrom, project.currency)}
            </span>
          </div>
        </div>

        {commentCount !== null && commentCount > 0 && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-[var(--text-muted)]">
            <MessageCircle className="w-3 h-3" />
            <span>{commentCount} comentarios</span>
          </div>
        )}
        </div>

        <div className="w-full pt-1.5 sm:pt-2">
          <span className="flex items-center justify-center gap-1.5 w-full h-[30px] sm:h-[36px] text-xs font-semibold text-[var(--brand-primary)] bg-[var(--bg-card)] border-2 border-[var(--brand-primary)] rounded-xl hover:bg-[var(--brand-primary)] hover:text-white transition-all duration-250 cursor-default">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar
          </span>
        </div>
      </Link>
    </div>
  );
}