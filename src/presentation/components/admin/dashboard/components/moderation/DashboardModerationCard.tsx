'use client';

import { FileCheck, Flag, Clock3 } from 'lucide-react';

import type { DashboardModerationCardProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { AttentionCard } from '@/presentation/components/ui/Card';

import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { QUEUE_ITEMS_CONFIG } from './Config';
import { QueueItem } from './QueueItem';
import { PublishedStatus } from './PublishedStatus';
import { MetricCard } from './MetricCard';
import type { ModerationQueueItem } from './Config';

export function DashboardModerationCard({
  stats,
  expiredFeatured,
  propertyUnavailable,
}: DashboardModerationCardProps) {
  const rows: ModerationQueueItem[] = [
    {
      ...QUEUE_ITEMS_CONFIG[0],
      count: stats?.pendingProperties ?? 0,
    },
    {
      ...QUEUE_ITEMS_CONFIG[1],
      count: stats?.pendingReports ?? 0,
    },
    {
      ...QUEUE_ITEMS_CONFIG[2],
      count: propertyUnavailable ? 0 : (expiredFeatured ?? 0),
    },
  ];

  const total = stats?.totalProperties ?? 0;
  const published = stats?.publishedProperties ?? 0;
  const publishedPct = total > 0 ? Math.min(100, Math.round((published / total) * 100)) : 0;
  const open = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <AttentionCard
      title="Cola de revisión"
      description="Publicaciones y reportes sin resolver"
      items={rows}
      onViewAll={() => {
        window.location.href = '/admin/properties';
      }}
    >
      {open > 0 && (
        <div
          className="flex items-baseline justify-between gap-3 text-xs"
          slot="header-action"
        >
          <span className="rounded-full bg-[#164E63] px-2.5 py-1 text-xs font-semibold tabular-nums text-white">
            {formatNumber(open)} abiertos
          </span>
        </div>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 px-6 pt-4 pb-2">
        <MetricCard
          label="Por moderar"
          value={formatNumber(stats?.pendingProperties ?? 0)}
          description={`de ${formatNumber(stats?.totalProperties ?? 0)} propiedades`}
          icon={FileCheck}
          iconBackground="bg-[#FFF1DC]"
          iconColor="text-[#C58A3A]"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C58A3A]">
            <span className="h-3 w-3 rounded-full bg-[#C58A3A]" aria-hidden="true" />
            Pendiente
          </span>
        </MetricCard>

        <MetricCard
          label="Reportes"
          value={formatNumber(stats?.pendingReports ?? 0)}
          description="Requieren atención inmediata"
          icon={Flag}
          iconBackground="bg-[#FCE8E8]"
          iconColor="text-[#C45B5B]"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C45B5B]">
            <span className="h-3 w-3 rounded-full bg-[#C45B5B]" aria-hidden="true" />
            Crítico
          </span>
        </MetricCard>

        <MetricCard
          label="Destacados vencidos"
          value={formatNumber(propertyUnavailable ? 0 : (expiredFeatured ?? 0))}
          description="Cupos sin liberar"
          icon={Clock3}
          iconBackground="bg-[#E0F2FE]"
          iconColor="text-[#164E63]"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#164E63]">
            <span className="h-3 w-3 rounded-full bg-[#164E63]" aria-hidden="true" />
            Gestionar
          </span>
        </MetricCard>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E2EAF0] mx-6" />

      {/* Cola de revisión */}
      <ul className="moderation-queue-list divide-y divide-[#EAF0F4]">
        {rows.map((row, index) => (
          <QueueItem key={row.id} item={row} index={index} />
        ))}
      </ul>

      {/* Estado de moderación */}
      <PublishedStatus
        published={published}
        total={total}
        publishedPct={publishedPct}
      />
    </AttentionCard>
  );
}