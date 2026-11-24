/**
 * Tarjeta de proyecto con el mismo sistema visual apagado que Propiedades.
 */

'use client';

import type { KeyboardEvent } from 'react';
import { Building, Calendar, Eye, MapPin, Star, TrendingUp } from 'lucide-react';

import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { formatProjectDate } from '@/presentation/components/admin/projects/utils/projectFormat';

interface ProjectCardProps {
  project: ProjectAdminItem;
  onClick?: (project: ProjectAdminItem) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Publicado',
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  DRAFT: 'Borrador',
  SUSPENDED: 'Suspendido',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const PHASE_LABELS: Record<string, string> = {
  PLANNING: 'Planificación',
  PRE_SALE: 'Pre venta',
  SALE: 'En venta',
  CONSTRUCTION: 'Construcción',
  COMPLETED: 'Completado',
};

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

function statusVariant(status: string): BadgeVariant {
  if (status === 'PUBLISHED' || status === 'ACTIVE' || status === 'COMPLETED') return 'success';
  if (status === 'PAUSED') return 'warning';
  if (status === 'SUSPENDED' || status === 'CANCELLED') return 'danger';
  return 'neutral';
}

function phaseVariant(phase: string): BadgeVariant {
  if (phase === 'SALE') return 'success';
  if (phase === 'PRE_SALE' || phase === 'CONSTRUCTION') return 'info';
  if (phase === 'PLANNING') return 'warning';
  return 'neutral';
}

function formatPrice(value: number): string {
  const amount = value || 0;
  if (amount >= 1_000_000) return `S/ ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `S/ ${Math.round(amount / 1_000)}K`;
  return `S/ ${amount.toLocaleString('es-PE')}`;
}

function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const open = () => onClick?.(project);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  return (
    <article
      className="projects-card"
      role="button"
      tabIndex={0}
      aria-label={`Ver proyecto ${project.name}`}
      onClick={open}
      onKeyDown={handleKeyDown}
    >
      <div className="projects-card__media">
        {project.coverImageUrl ? (
          <img src={project.coverImageUrl} alt="" loading="lazy" />
        ) : (
          <span className="projects-card__placeholder">#{project.id}</span>
        )}
        {project.isFeatured && (
          <span className="projects-card__featured">
            <Star className="h-3 w-3 fill-amber-400 text-amber-500" aria-hidden="true" />
            Destacado
          </span>
        )}
      </div>

      <div className="projects-card__body">
        <div className="projects-card__top">
          <Badge variant={statusVariant(project.status)} size="sm">
            {STATUS_LABELS[project.status] ?? project.status}
          </Badge>
          <span className="projects-card__price">
            {formatPriceRange(project.priceRange?.min ?? 0, project.priceRange?.max ?? 0)}
          </span>
        </div>

        <h3 className="projects-card__title">{project.name}</h3>

        <p className="projects-card__location">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{project.district || project.city || 'Sin ubicación'}</span>
        </p>

        <p className="projects-card__developer" title={project.developerEmail}>
          {project.developerName || 'Sin desarrollador'} · {project.developerEmail}
        </p>

        <div className="projects-card__metrics">
          <span className="projects-card__metric" title="Unidades totales">
            <Building className="h-3 w-3" aria-hidden="true" />
            {project.totalUnits ?? 0} unid.
          </span>
          <span className="projects-card__metric" title="Unidades vendidas">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {project.soldUnits ?? 0} vend.
          </span>
          <span className="projects-card__metric" title="Visitas">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {project.viewsCount ?? 0}
          </span>
        </div>

        <div className="projects-card__footer">
          <span className="projects-card__dates">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            Inicio {formatProjectDate(project.startDate)} · Entrega{' '}
            {formatProjectDate(project.estimatedDeliveryDate)}
          </span>
          <Badge variant={phaseVariant(project.phase)} size="xs">
            {PHASE_LABELS[project.phase] ?? project.phase}
          </Badge>
        </div>
      </div>
    </article>
  );
}
